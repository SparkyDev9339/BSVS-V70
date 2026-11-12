# BSVS v70 protocol

Install dependencies before starting the server:

```sh
python3 -m pip install -r requirements.txt
python3 Core.py
```

`Configuration.py` selects `ClientMajor: 70` and `UsePepperCrypto: True`.
The home packet derives from BSL.v68 and includes the v70 layout changes
identified in the open iOS IDA databases, with the current player's ID and name.
See [native comparison notes](docs/own-home-v70.md) for addresses and field order.
The corrected packet was decoded by the connected iOS v70 client, and the user
confirmed that the main menu opened with the tutorial completed. Other packet
handlers still come from this project's CN v69 implementation.

The encryption matches the upstream dialect exactly:

- ClientHello 10100, plaintext ServerHello 20100 with a 24-byte session token.
- Login 10101: 32-byte public-key prefix, BLAKE2b-24 nonce, upstream fixed
  client secret/server public keys, and XSalsa19-Poly1305 authenticated encryption.
- The decrypted login envelope starts with one byte followed by a 24-byte
  receive nonce. This follows the upstream code, including its unusual prefix.
- The first login response contains the server nonce and random session key.
- Subsequent packets use separate receive/send nonces, incremented by two
  as little-endian 192-bit integers before each nonempty packet.

Standard XSalsa20/NaCl SecretBox is incompatible with this 19-round variant.
A client must implement the same dialect and key configuration. The server does
not silently fall back to plaintext; for a client with encryption disabled, set
`UsePepperCrypto` to `False` explicitly. That setting does not change the v70
home packet layout.

Run protocol regression checks with:

```sh
python3 -m unittest discover -s tests -v
```
