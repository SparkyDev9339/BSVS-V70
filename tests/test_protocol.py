import asyncio
import json
from pathlib import Path
import socket
import unittest
from unittest.mock import patch

import Configuration
from Classes.AsyncServerConnection import AsyncServerConnection
from Classes.ByteStream import ByteStream
from Classes.ClientsManager import ClientsManager
from Classes.Connection import Connection
from Classes.Crypto import (
    PepperEncrypter, PepperSession, SERVER_PUBLIC_KEY, box_key, secretbox,
    secretbox_open,
)
from Classes.Instances.Classes.Player import Player
from Classes.Packets.Server.Home.OwnHomeDataMessage import OwnHomeDataMessage


VECTORS = json.loads((Path(__file__).parent / "fixtures/bsl_v68_vectors.json").read_text())
HOME_V70 = bytes.fromhex((Path(__file__).parent / "fixtures/own_home_v70.hex").read_text())


def frame(message_type, payload):
    return message_type.to_bytes(2, "big") + len(payload).to_bytes(3, "big") + bytes(2) + payload


def login_payload():
    stream = ByteStream(b"")
    stream.writeLong(0, 1)
    stream.writeString("test-token")
    stream.writeInt(70)
    stream.writeInt(0)
    stream.writeInt(1)
    stream.writeString("test-sha")
    return stream.messagePayload


def encrypted_login():
    client_pk = bytes(range(32))
    receive_nonce = bytes(range(24))
    nonce = PepperSession._hash(client_pk + SERVER_PUBLIC_KEY)
    payload = secretbox(b"\x00" + receive_nonce + login_payload(), nonce, box_key())
    return client_pk, receive_nonce, frame(10101, client_pk + payload)


def decode_login_response(payload, client_pk, receive_nonce):
    nonce = PepperSession._hash(receive_nonce + client_pk + SERVER_PUBLIC_KEY)
    plaintext = secretbox_open(payload, nonce, box_key())
    return plaintext[56:], PepperEncrypter(plaintext[24:56], plaintext[:24])


class ProtocolTests(unittest.TestCase):
    def test_ciphertext_matches_upstream_csharp(self):
        for length, expected in VECTORS["secretbox"].items():
            with self.subTest(length=length):
                message = bytes(i % 256 for i in range(int(length)))
                ciphertext = secretbox(message, bytes(range(24)), bytes(range(32)))
                self.assertEqual(ciphertext.hex(), expected)
                self.assertEqual(secretbox_open(ciphertext, bytes(range(24)), bytes(range(32))), message)
        self.assertEqual(box_key().hex(), VECTORS["boxkey"])

    def test_home_matches_v70_reference_and_resets_on_reencode(self):
        message = OwnHomeDataMessage(b"")
        player = Player(ID=[0, 1], Name="LkPrtctrd")
        expected = HOME_V70
        self.assertEqual(message.encode({}, player), expected)
        self.assertEqual(message.encode({}, player), expected)
        self.assertEqual(message.offset, len(expected))
        self.assertEqual(message.bitoffset, 2)  # v70 avatar ends with two packed flags.
        player.ID = [1, 234]
        player.Name = "Тест"
        payload = message.encode({}, player)
        self.assertIn(player.Name.encode(), payload)
        self.assertNotEqual(payload, expected)

    def test_avatar_tutorial_state_at_native_v70_boundary(self):
        # Live native decoder boundaries: Daily=142, Conf=391, Home=443.
        # Avatar field order comes from native 0x100A5A25C.
        player = Player(ID=[0, 1], Name="LkPrtctrd")
        payload = OwnHomeDataMessage(b"").encode({}, player)
        reader = ByteStream(payload)
        reader.offset = 443
        self.assertEqual(reader.readVLong(), player.ID)
        self.assertEqual(reader.readVLong(), player.ID)
        self.assertEqual(reader.readVLong(), [0, 0])
        self.assertEqual(reader.readString(), player.Name)
        self.assertTrue(reader.readBoolean())
        reader.readInt()
        self.assertEqual(reader.readVInt(), 35)
        for _ in range(35):
            for _ in range(2):
                count = reader.readVInt()
                self.assertLessEqual(count, 100)
                for _ in range(count):
                    reader.readDataReference()
                    reader.readVInt()
                    reader.readVInt()
        stats = [reader.readVInt() for _ in range(13)]
        self.assertEqual(stats[11], 2)  # Native Avatar +696; 0 starts tutorial.
        reader.readVInt()  # Avatar +704 nested scalar
        reader.readVInt()  # Avatar +712
        self.assertEqual(reader.readInt(), 0xFFFFFFFF)  # Avatar +720 null string
        for _ in range(4):
            reader.readVInt()
        self.assertFalse(reader.readBoolean())
        self.assertFalse(reader.readBoolean())
        self.assertEqual(reader.offset, len(payload))
        self.assertEqual(reader.bitoffset, 2)

    def test_authentication_rejects_modified_or_truncated_packets(self):
        ciphertext = bytes.fromhex(VECTORS["secretbox"]["65"])
        for invalid in (ciphertext[:15], bytes([ciphertext[0] ^ 1]) + ciphertext[1:], ciphertext[:-1]):
            with self.subTest(length=len(invalid)), self.assertRaises(ValueError):
                secretbox_open(invalid, bytes(range(24)), bytes(range(32)))

    def test_nonce_carry_and_wrap(self):
        stream = PepperEncrypter(bytes(32), b"\xff" + bytes(23))
        stream.encrypt(b"test")
        self.assertEqual(stream.nonce, b"\x01\x01" + bytes(22))
        stream = PepperEncrypter(bytes(32), b"\xff" * 24)
        stream.encrypt(b"test")
        self.assertEqual(stream.nonce, b"\x01" + bytes(23))

    def test_handshake_state_validation_and_receive_stream(self):
        session = PepperSession()
        with self.assertRaises(ValueError):
            session.receive(10101, b"")
        self.assertIsNone(session.receive(10100, b""))
        with self.assertRaises(ValueError):
            session.receive(10101, bytes(80))
        client_pk, receive_nonce, packet = encrypted_login()
        self.assertEqual(session.receive(10101, packet[7:]), login_payload())
        login_response = session.send(20104, b"login-ok")
        decoded, receive_stream = decode_login_response(login_response, client_pk, receive_nonce)
        self.assertEqual(decoded, b"login-ok")
        self.assertEqual(receive_stream.decrypt(session.send(24101, b"home")), b"home")
        sender = PepperEncrypter(session.secret_key, receive_nonce)
        self.assertEqual(session.receive(14600, sender.encrypt(b"request")), b"request")
        self.assertEqual(session.receive(14600, sender.encrypt(b"next")), b"next")
        other = PepperSession()
        self.assertNotEqual(session.secret_key, other.secret_key)

    def test_threaded_transport_login_and_home(self):
        server_socket, client_socket = socket.socketpair()
        client_socket.settimeout(5)
        player = Player(ID=[0, 1], Token="test-token", Name="LkPrtctrd")

        def read_exact(length):
            data = bytearray()
            while len(data) < length:
                chunk = client_socket.recv(length - len(data))
                if not chunk:
                    raise EOFError()
                data.extend(chunk)
            return bytes(data)

        def read_frame():
            header = read_exact(7)
            return int.from_bytes(header[:2], "big"), read_exact(int.from_bytes(header[2:5], "big"))

        with patch.dict(Configuration.settings, {"UsePepperCrypto": True, "ClientMajor": 70, "PrintEnabled": False}), patch.dict(ClientsManager.PlayersList, {}, clear=True), patch("Classes.Packets.Client.Authentification.LoginMessage.DatabaseHandler") as database:
            database.return_value.__enter__.return_value.login.return_value = player
            connection = Connection(server_socket, ("local-test", 0))
            connection.start()
            try:
                client_socket.sendall(frame(10100, bytes(40)))
                message_type, payload = read_frame()
                self.assertEqual(message_type, 20100)
                self.assertEqual(payload[:4], (24).to_bytes(4, "big"))
                self.assertEqual(len(payload), 28)
                client_pk, receive_nonce, packet = encrypted_login()
                # Exercise TCP fragmentation while reading the login header.
                client_socket.sendall(packet[:3])
                client_socket.sendall(packet[3:])
                message_type, payload = read_frame()
                self.assertEqual(message_type, 20104)
                decoded, receiver = decode_login_response(payload, client_pk, receive_nonce)
                self.assertTrue(decoded)
                message_type, payload = read_frame()
                self.assertEqual(message_type, 24101)
                self.assertEqual(receiver.decrypt(payload), HOME_V70)
                database.return_value.__enter__.return_value.login.assert_called_once_with([0, 1], "test-token")
            finally:
                client_socket.close()
                connection.join(timeout=5)
                server_socket.close()
            self.assertFalse(connection.is_alive())
            self.assertEqual(ClientsManager.PlayersList, {})


class AsyncProtocolTests(unittest.IsolatedAsyncioTestCase):
    async def test_async_transport_login_and_home(self):
        server_impl = AsyncServerConnection(("127.0.0.1", 0))
        finished = asyncio.Event()

        async def handle(reader, writer):
            try:
                await server_impl._handle_client(reader, writer)
            finally:
                finished.set()

        async def read_frame(reader):
            header = await asyncio.wait_for(reader.readexactly(7), 5)
            payload = await asyncio.wait_for(reader.readexactly(int.from_bytes(header[2:5], "big")), 5)
            return int.from_bytes(header[:2], "big"), payload

        player = Player(ID=[0, 1], Token="test-token", Name="LkPrtctrd")
        with patch.dict(Configuration.settings, {"UsePepperCrypto": True, "ClientMajor": 70, "PrintEnabled": False}), patch.dict(ClientsManager.PlayersList, {}, clear=True), patch("Classes.Packets.Client.Authentification.LoginMessage.DatabaseHandler") as database:
            database.return_value.__enter__.return_value.login.return_value = player
            server = await asyncio.start_server(handle, "127.0.0.1", 0)
            writer = None
            try:
                reader, writer = await asyncio.open_connection(*server.sockets[0].getsockname())
                writer.write(frame(10100, bytes(40)))
                await writer.drain()
                message_type, payload = await read_frame(reader)
                self.assertEqual((message_type, len(payload)), (20100, 28))
                client_pk, receive_nonce, packet = encrypted_login()
                writer.write(packet)
                await writer.drain()
                message_type, payload = await read_frame(reader)
                self.assertEqual(message_type, 20104)
                _, receiver = decode_login_response(payload, client_pk, receive_nonce)
                message_type, payload = await read_frame(reader)
                self.assertEqual(message_type, 24101)
                self.assertEqual(receiver.decrypt(payload), HOME_V70)
            finally:
                if writer is not None:
                    writer.close()
                    await writer.wait_closed()
                    await asyncio.wait_for(finished.wait(), 5)
                server.close()
                await server.wait_closed()
            self.assertEqual(ClientsManager.PlayersList, {})


if __name__ == "__main__":
    unittest.main()
