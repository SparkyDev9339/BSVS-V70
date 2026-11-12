"""Launch the v70 iOS client and relay its game TCP connection over Frida USB."""
import argparse
from pathlib import Path
import queue
import socket
import threading
import sys

import frida

sys.path.insert(0, str(Path(__file__).resolve().parents[1]))
from Classes.Crypto import PepperSession, SERVER_PUBLIC_KEY, box_key, secretbox_open


class Channel:
    def __init__(self, script, channel_id, target):
        self.script = script
        self.id = channel_id
        self.target = target
        self.queue = queue.Queue(maxsize=8)
        self.closed = threading.Event()
        self.ack = threading.Event()
        self.socket = None
        self.buffers = {"client": bytearray(), "server": bytearray()}
        self.thread = threading.Thread(target=self.run, daemon=True)

    def trace(self, direction, data):
        buffer = self.buffers[direction]
        buffer.extend(data)
        while len(buffer) >= 7:
            message_type = int.from_bytes(buffer[:2], "big")
            length = int.from_bytes(buffer[2:5], "big")
            if length > 1024 * 1024 + 128:
                raise ValueError(f"Invalid {direction} frame length {length}")
            if len(buffer) < length + 7:
                break
            print(f"[USB {self.id}] {direction} packet={message_type} bytes={length}", flush=True)
            if direction == "client" and message_type == 10101:
                payload = bytes(buffer[7:length + 7])
                nonce = PepperSession._hash(payload[:32] + SERVER_PUBLIC_KEY)
                try:
                    plaintext = secretbox_open(payload[32:], nonce, box_key())
                    print(f"[USB {self.id}] login authentication OK; prefix={plaintext[0]}; plaintext={len(plaintext)}", flush=True)
                except ValueError as error:
                    print(f"[USB {self.id}] login authentication FAILED; expected nonce={nonce.hex()}: {error}", flush=True)
            del buffer[:length + 7]

    def post(self, suffix, **message):
        self.script.post({"type": f"usb-{suffix}-{self.id}", **message})

    def close(self):
        self.closed.set()
        self.ack.set()
        if self.socket is not None:
            try:
                self.socket.shutdown(socket.SHUT_RDWR)
            except OSError:
                pass
            self.socket.close()

    def read(self):
        try:
            while not self.closed.is_set():
                data = self.socket.recv(65536)
                if not data:
                    print(f"[USB {self.id}] server closed connection", flush=True)
                    break
                self.trace("server", data)
                self.ack.clear()
                self.post("down", action="data", hex=data.hex())
                if not self.ack.wait(15):
                    raise TimeoutError("iPhone did not acknowledge USB data")
        except OSError as error:
            if not self.closed.is_set():
                print(f"[USB {self.id}] receive: {error}", flush=True)
        except TimeoutError as error:
            print(f"[USB {self.id}] {error}", flush=True)
        finally:
            self.close()

    def run(self):
        try:
            self.socket = socket.create_connection(self.target, timeout=7)
            self.socket.settimeout(None)
            print(f"[USB {self.id}] server {self.target[0]}:{self.target[1]} connected", flush=True)
            threading.Thread(target=self.read, daemon=True).start()
            while not self.closed.is_set():
                try:
                    data = self.queue.get(timeout=0.5)
                except queue.Empty:
                    continue
                self.socket.sendall(data)
                self.trace("client", data)
                self.post("up-ack")
        except Exception as error:
            if not self.closed.is_set():
                print(f"[USB {self.id}] {error}", flush=True)
        finally:
            self.close()
            try:
                self.post("up-ack")
                self.post("down", action="close")
            except frida.InvalidOperationError:
                pass


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--bundle", default="com.supercell.laser.R283WFH23U")
    parser.add_argument("--host", default="127.0.0.1", help="Server address on this computer")
    parser.add_argument("--port", default=9339, type=int)
    parser.add_argument("--device", help="Frida USB device ID, if multiple iPhones are connected")
    parser.add_argument("--diagnostics", action="store_true", help="Trace native packet decoders and exceptions")
    parser.add_argument("--mod-script", type=Path, help="Load an additional Frida mod in the same USB session")
    args = parser.parse_args()
    mod_source = ""
    if args.mod_script:
        from importlib.resources import files
        bridge = files("frida_tools").joinpath("bridges/objc.js").read_text()
        mod_source = "\n" + bridge + "\nglobalThis.ObjC = bridge;\n" + args.mod_script.read_text()
    devices = [d for d in frida.get_device_manager().enumerate_devices() if d.type == "usb"]
    if args.device:
        devices = [d for d in devices if d.id == args.device]
    if len(devices) != 1:
        parser.error("Connect one iPhone or select it with --device")
    device = devices[0]
    # Fail before restarting the app if the Python game server is not running.
    with socket.create_connection((args.host, args.port), timeout=3):
        pass
    app = next((a for a in device.enumerate_applications() if a.identifier == args.bundle), None)
    if app is None:
        parser.error(f"Application {args.bundle} is not installed")
    if app.pid:
        print(f"Restarting {args.bundle} (pid {app.pid})", flush=True)
        device.kill(app.pid)
    pid = device.spawn([args.bundle])
    session = device.attach(pid)
    ready = threading.Event()
    stopped = threading.Event()
    channels = {}
    startup_error = []
    source = "globalThis.BSVS_V70_OPTIONS = {transport: 'usb', diagnostics: " + str(args.diagnostics).lower() + "};\n"
    source += Path(__file__).with_name("v70-ios.js").read_text()
    source += mod_source
    script = session.create_script(source)

    def on_message(message, data):
        if message["type"] == "log":
            print(message["payload"], flush=True)
            return
        if message["type"] == "error":
            print(message.get("stack", message), flush=True)
            startup_error.append(message)
            ready.set()
            return
        payload = message.get("payload", {})
        kind = payload.get("kind")
        if kind == "bsvs-ready":
            ready.set()
        elif kind == "bsvs-error":
            startup_error.append(payload)
            ready.set()
        elif kind == "usb-open":
            channel = Channel(script, payload["id"], (args.host, args.port))
            channels[channel.id] = channel
            channel.thread.start()
        elif kind == "usb-data":
            channel = channels.get(payload["id"])
            if channel is not None:
                try:
                    channel.queue.put_nowait(data)
                except queue.Full:
                    channel.close()
        elif kind == "usb-down-ack":
            channel = channels.get(payload["id"])
            if channel is not None:
                channel.ack.set()
        elif kind == "usb-close":
            channel = channels.get(payload["id"])
            if channel is not None:
                print(f"[USB {channel.id}] iPhone closed connection", flush=True)
                channel.close()

    def on_detached(reason, crash=None):
        print(f"[Frida] detached: {reason}", flush=True)
        if crash is not None:
            print(crash, flush=True)
        stopped.set()

    script.on("message", on_message)
    session.on("detached", on_detached)
    try:
        script.load()
        if not ready.wait(10) or startup_error:
            device.kill(pid)
            raise RuntimeError(f"Script startup failed: {startup_error or 'timeout'}")
        device.resume(pid)
        print(f"[USB] {args.bundle} pid={pid}; keep this terminal open; Ctrl+C to stop", flush=True)
        report_mod = bool(args.mod_script and "status" in script.list_exports_sync())
        last_mod_status = None
        while not stopped.wait(1):
            if report_mod:
                mod_status = script.exports_sync.status()
                if mod_status != last_mod_status:
                    print(f"[Mod] {mod_status}", flush=True)
                    last_mod_status = mod_status
    except KeyboardInterrupt:
        print("Stopping USB tunnel", flush=True)
    finally:
        for channel in list(channels.values()):
            channel.close()
        try:
            session.detach()
        except frida.InvalidOperationError:
            pass


if __name__ == "__main__":
    main()
