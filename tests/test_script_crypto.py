import json
from pathlib import Path
import shutil
import subprocess
import unittest

from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.asymmetric.x25519 import X25519PrivateKey

from Classes.Crypto import CLIENT_SECRET_KEY, SERVER_PUBLIC_KEY, PepperSession


ROOT = Path(__file__).resolve().parents[1]
NODE_CODE = """
const fs = require('node:fs');
const {Crypto19: c, PEPPER} = require('./scripts/v70-ios.js');
const input = JSON.parse(fs.readFileSync(0, 'utf8'));
const key = c.fromHex(input.key || PEPPER.boxKey);
const nonce = input.hashMaterial ? c.blake2b24(c.fromHex(input.hashMaterial)) : c.fromHex(input.nonce);
const data = c.fromHex(input.data);
const result = input.open ? c.open(data, nonce, key) : c.secretbox(data, nonce, key);
process.stdout.write(JSON.stringify({hex: c.toHex(result), publicKey: PEPPER.clientPublicKey,
    serverPublicKey: PEPPER.serverPublicKey}));
"""


@unittest.skipUnless(shutil.which("node"), "Node.js is needed for script/server interoperability")
class ScriptCryptoTests(unittest.TestCase):
    def js_cipher(self, data, nonce, key=None, decrypt=False, hash_material=None):
        request = {"data": data.hex(), "nonce": nonce.hex(), "open": decrypt}
        if key is not None:
            request["key"] = key.hex()
        if hash_material is not None:
            request["hashMaterial"] = hash_material.hex()
        process = subprocess.run(
            ["node", "-e", NODE_CODE], cwd=ROOT, input=json.dumps(request),
            text=True, capture_output=True, check=True, timeout=10,
        )
        return json.loads(process.stdout)

    def test_javascript_client_handshake_and_bidirectional_session(self):
        session = PepperSession()
        session.receive(10100, b"")
        client_pk = X25519PrivateKey.from_private_bytes(CLIENT_SECRET_KEY).public_key().public_bytes(
            serialization.Encoding.Raw, serialization.PublicFormat.Raw,
        )
        client_nonce = bytes(range(24))
        nonce = session._hash(client_pk + SERVER_PUBLIC_KEY)
        login = b"v70-login-interoperability"
        result = self.js_cipher(b"\x00" + client_nonce + login, nonce,
                                hash_material=client_pk + SERVER_PUBLIC_KEY)
        self.assertEqual(result["publicKey"], client_pk.hex())
        self.assertEqual(result["serverPublicKey"], SERVER_PUBLIC_KEY.hex())
        self.assertEqual(session.receive(10101, client_pk + bytes.fromhex(result["hex"])), login)

        response = session.send(20104, b"login-ok")
        nonce = session._hash(client_nonce + client_pk + SERVER_PUBLIC_KEY)
        result = self.js_cipher(response, nonce, decrypt=True,
                                hash_material=client_nonce + client_pk + SERVER_PUBLIC_KEY)
        plaintext = bytes.fromhex(result["hex"])
        self.assertEqual(plaintext[56:], b"login-ok")
        server_nonce, key = plaintext[:24], plaintext[24:56]
        self.assertEqual(key, session.secret_key)

        # Independent nonce arithmetic, matching the native client increment.
        def advance(value):
            return ((int.from_bytes(value, "little") + 2) % (1 << 192)).to_bytes(24, "little")

        home = bytes.fromhex((ROOT / "tests/fixtures/own_home_v70.hex").read_text())
        server_nonce = advance(server_nonce)
        result = self.js_cipher(session.send(24101, home), server_nonce, key, decrypt=True)
        self.assertEqual(bytes.fromhex(result["hex"]), home)

        for payload in (b"first-client-request", b"second-client-request"):
            client_nonce = advance(client_nonce)
            result = self.js_cipher(payload, client_nonce, key)
            self.assertEqual(session.receive(14600, bytes.fromhex(result["hex"])), payload)
