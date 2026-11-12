# Adapted from LkPrtctrd/BSL.v68, Apache-2.0 (see THIRD_PARTY_NOTICES.md).
"""The upstream Pepper dialect uses XSalsa19, not standard XSalsa20."""

import hashlib
import secrets
import struct
import threading

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey, X25519PublicKey
from cryptography.hazmat.primitives.poly1305 import Poly1305


CLIENT_SECRET_KEY = bytes.fromhex("36abd74b2db5faa4d5a7977a1bc8be137ad7330efc934dfba36600ecd6871476")
SERVER_PUBLIC_KEY = bytes.fromhex("46cb575cd747a84045647b8f59473ffafbcd302093c73fd5f8233d779bea886b")
_MASK = 0xFFFFFFFF


def _rotate(value, bits):
    value &= _MASK
    return ((value << bits) | (value >> (32 - bits))) & _MASK


def _core(nonce, key, hsalsa=False):
    constants = struct.unpack("<4I", b"expand 32-byte k")
    keys = struct.unpack("<8I", key)
    inputs = struct.unpack("<4I", nonce)
    x = [0] * 16
    for i in range(4):
        x[5 * i] = constants[i]
        x[1 + i] = keys[i]
        x[6 + i] = inputs[i]
        x[11 + i] = keys[4 + i]
    initial = x[:]
    for _ in range(19):
        w = [0] * 16
        for j in range(4):
            t = [x[(5 * j + 4 * m) % 16] for m in range(4)]
            t[1] ^= _rotate(t[0] + t[3], 7)
            t[2] ^= _rotate(t[1] + t[0], 9)
            t[3] ^= _rotate(t[2] + t[1], 13)
            t[0] ^= _rotate(t[3] + t[2], 18)
            for m in range(4):
                w[4 * j + (j + m) % 4] = t[m]
        x = w
    if hsalsa:
        return struct.pack("<8I", *(x[i] for i in (0, 5, 10, 15, 6, 7, 8, 9)))
    return struct.pack("<16I", *((a + b) & _MASK for a, b in zip(x, initial)))


def _stream(length, nonce, key):
    if len(nonce) != 24 or len(key) != 32:
        raise ValueError("Pepper requires a 24-byte nonce and a 32-byte key")
    subkey = _core(nonce[:16], key, hsalsa=True)
    return b"".join(
        _core(nonce[16:] + counter.to_bytes(8, "little"), subkey)
        for counter in range((length + 63) // 64)
    )[:length]


def secretbox(message, nonce, key):
    stream = _stream(len(message) + 32, nonce, key)
    ciphertext = bytes(a ^ b for a, b in zip(message, stream[32:]))
    return Poly1305.generate_tag(stream[:32], ciphertext) + ciphertext


def secretbox_open(ciphertext, nonce, key):
    ciphertext = bytes(ciphertext)
    if len(ciphertext) < 16:
        raise ValueError("Truncated Pepper ciphertext")
    stream = _stream(len(ciphertext) + 16, nonce, key)
    try:
        Poly1305.verify_tag(stream[:32], ciphertext[16:], ciphertext[:16])
    except InvalidSignature as exc:
        raise ValueError("Invalid Pepper authentication tag") from exc
    return bytes(a ^ b for a, b in zip(ciphertext[16:], stream[32:]))


def box_key(public_key=SERVER_PUBLIC_KEY, secret_key=CLIENT_SECRET_KEY):
    shared = X25519PrivateKey.from_private_bytes(secret_key).exchange(
        X25519PublicKey.from_public_bytes(public_key)
    )
    return _core(bytes(16), shared, hsalsa=True)


class PepperEncrypter:
    def __init__(self, key, nonce):
        if len(key) != 32 or len(nonce) != 24:
            raise ValueError("Invalid Pepper stream key or nonce")
        self.key = key
        self.nonce = nonce

    def _next_nonce(self):
        value = (int.from_bytes(self.nonce, "little") + 2) % (1 << 192)
        self.nonce = value.to_bytes(24, "little")

    def encrypt(self, payload):
        if not payload:
            return b""
        self._next_nonce()
        return secretbox(payload, self.nonce, self.key)

    def decrypt(self, payload):
        if not payload:
            return b""
        self._next_nonce()
        return secretbox_open(payload, self.nonce, self.key)


class PepperSession:
    def __init__(self):
        self.state = 2
        self.session_token = secrets.token_bytes(24)
        self.secret_key = secrets.token_bytes(32)
        self.send_nonce = secrets.token_bytes(24)
        self.client_pk = None
        self.receive_nonce = None
        self.encrypt_stream = None
        self.decrypt_stream = None
        self._box_key = box_key()

    @staticmethod
    def _hash(data):
        return hashlib.blake2b(data, digest_size=24).digest()

    def receive(self, message_type, payload):
        payload = bytes(payload)
        if self.state == 2:
            if message_type != 10100:
                raise ValueError("Expected ClientHello (10100)")
            self.state = 3
            return None
        if self.state == 3:
            if message_type != 10101 or len(payload) < 32 + 16 + 25:
                raise ValueError("Expected encrypted Login (10101)")
            client_pk = payload[:32]
            nonce = self._hash(client_pk + SERVER_PUBLIC_KEY)
            decrypted = secretbox_open(payload[32:], nonce, self._box_key)
            # Upstream uses a one-byte prefix, then the client's 24-byte nonce.
            if len(decrypted) < 25:
                raise ValueError("Truncated Pepper login")
            self.client_pk = client_pk
            self.receive_nonce = decrypted[1:25]
            self.state = 4
            return decrypted[25:]
        if self.state == 5:
            return self.decrypt_stream.decrypt(payload)
        raise ValueError("Pepper login response has not been sent")

    def send(self, message_type, payload):
        if self.state == 3 and message_type == 20100:
            return payload
        if self.state == 4:
            nonce = self._hash(self.receive_nonce + self.client_pk + SERVER_PUBLIC_KEY)
            encrypted = secretbox(self.send_nonce + self.secret_key + payload, nonce, self._box_key)
            self.decrypt_stream = PepperEncrypter(self.secret_key, self.receive_nonce)
            self.encrypt_stream = PepperEncrypter(self.secret_key, self.send_nonce)
            self.state = 5
            return encrypted
        if self.state == 5:
            return self.encrypt_stream.encrypt(payload)
        raise ValueError("Pepper handshake is incomplete")


class PepperSocket:
    """Keep per-connection crypto available through the existing Socket fields."""

    def __init__(self, socket):
        self.socket = socket
        self.crypto = PepperSession()
        self._send_lock = threading.Lock()

    def recv(self, length):
        return self.socket.recv(length)

    def send(self, packet):
        with self._send_lock:
            message_type = int.from_bytes(packet[:2], "big")
            payload = self.crypto.send(message_type, bytes(packet[7:]))
            encrypted = packet[:2] + len(payload).to_bytes(3, "big") + packet[5:7] + payload
            if hasattr(self.socket, "sendall"):
                self.socket.sendall(encrypted)
            else:
                self.socket.send(encrypted)
            return len(packet)

    def receive(self, message_type, payload):
        decoded = self.crypto.receive(message_type, payload)
        if decoded is None:
            payload = (24).to_bytes(4, "big") + self.crypto.session_token
            self.send((20100).to_bytes(2, "big") + len(payload).to_bytes(3, "big") + bytes(2) + payload)
        return decoded

    def close(self):
        self.socket.close()

    async def aclose(self):
        await self.socket.aclose()
