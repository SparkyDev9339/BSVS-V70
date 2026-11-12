#!/usr/bin/env python3
import argparse
import hashlib
import json
import math
from pathlib import Path
import sys
import threading


def account_id(value):
    try:
        parts = [int(part) for part in value.split(':')]
        if len(parts) != 2 or any(part < 0 or part > 2147483647 for part in parts):
            raise ValueError()
        return parts
    except ValueError:
        raise argparse.ArgumentTypeError('Account ID must be HIGH:LOW, for example 0:2')


def main():
    parser = argparse.ArgumentParser(description='Launch the v70 iOS client and load the offline server after startup.')
    parser.add_argument('--bundle-id', required=True, help='Bundle identifier of your v70 client')
    parser.add_argument('--device', help='Frida device ID (defaults to USB)')
    parser.add_argument('--attach-delay', type=float, default=3.0,
                        help='Seconds to let the app start before attaching (default: 3; 0 enables early injection)')
    parser.add_argument('--script', type=Path, default=Path(__file__).resolve().parents[1] / 'script.js')
    accounts = parser.add_mutually_exclusive_group()
    accounts.add_argument('--create-account', nargs='?', const='Player', metavar='NAME', help='Create and activate a local account')
    accounts.add_argument('--account', type=account_id, metavar='HIGH:LOW', help='Activate a saved local account')
    parser.add_argument('--show-profile', type=account_id, metavar='HIGH:LOW', help='Print a saved profile before starting the game')
    args = parser.parse_args()
    if not math.isfinite(args.attach_delay) or not 0 <= args.attach_delay <= 60:
        parser.error('--attach-delay must be between 0 and 60 seconds')
    try:
        import frida
        if not args.script.is_file():
            parser.error('script.js is missing; run npm run build')
        device = frida.get_device(args.device, timeout=10) if args.device else frida.get_usb_device(timeout=10)
        if not any(app.identifier == args.bundle_id for app in device.enumerate_applications()):
            parser.error(f'{args.bundle_id} is not installed on {device.name}')
        pid = device.spawn([args.bundle_id])
        session = None
        stop = threading.Event()
        resumed = False
        try:
            if args.attach_delay > 0:
                device.resume(pid)
                resumed = True
                print(f'Waiting {args.attach_delay:g}s before attaching to PID {pid}...', flush=True)
                stop.wait(args.attach_delay)
            session = device.attach(pid)
            session.on('detached', lambda *event: (print('Session detached:', event), stop.set()))
            source = args.script.read_text()
            print('Script:', args.script.resolve(), 'SHA-256:', hashlib.sha256(source.encode()).hexdigest(), flush=True)
            script = session.create_script(source)
            script.on('message', lambda message, data: print(json.dumps(message, ensure_ascii=False), flush=True))
            script.load()
            status = script.exports_sync.status()
            if status['failure']:
                raise RuntimeError(status['failure'])
            if args.create_account is not None:
                print('Created account:', json.dumps(script.exports_sync.createaccount(args.create_account), ensure_ascii=False))
            elif args.account is not None:
                if not script.exports_sync.selectaccount(*args.account):
                    raise RuntimeError('Local account not found')
            if args.show_profile is not None:
                print('Profile:', json.dumps(script.exports_sync.profile(*args.show_profile), ensure_ascii=False, indent=2))
            print(json.dumps(script.exports_sync.status(), ensure_ascii=False, indent=2))
            print('Accounts:', json.dumps(script.exports_sync.accounts(), ensure_ascii=False))
            if not resumed:
                device.resume(pid)
            print('Offline server loaded. Ctrl+C closes this spawned game and ends the session.')
            stop.wait()
        except KeyboardInterrupt:
            pass
        finally:
            try:
                device.kill(pid)
            except frida.ProcessNotFoundError:
                pass
            if session:
                session.detach()
    except Exception as exc:
        print(f'Error: {exc}', file=sys.stderr)
        return 1
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
