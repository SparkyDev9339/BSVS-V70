# iOS v70: Pepper and redirect

## Connect over USB

For the connected iPhone and `com.supercell.laser.R283WFH23U`, run the Python
server, then leave this command running in a second terminal:

```sh
python3 scripts/run_v70_usb.py
```

This restarts that application, installs the script before resuming it, and
relays game TCP traffic over the Frida USB connection to `127.0.0.1:9339` on the
computer. The iPhone does not need a Wi-Fi route to the computer. No SSH or
iproxy setup is needed. Closing the launcher closes its USB TCP channels.

The launcher requires the Python `frida` package and a compatible Frida service
on the iPhone. The tested setup uses Frida 17.25.0 and iOS 16.7.16 ARM64.
Optional arguments: `--bundle APP_ID`, `--host SERVER_IP`, `--port PORT`,
`--device USB_DEVICE_ID`, and `--diagnostics` for native decoder traces.

The regular `frida -U ... -l ...` command below only injects the LAN script.
USB injection alone does not tunnel game TCP traffic.

## Connect over LAN

`v70-ios.js` is a standalone Frida script for the iOS ARM64 `laser` build opened
in IDA, SHA-256:

```
8537bea717182189fe8bbb29760250cd071e34ecc69c79c19b4010ac47ff9cea
```

Edit the configuration at the top of the script:

```js
const CONFIG = {
    host: '192.168.0.21', // This computer's LAN IP when the script was created.
    port: 9339,
    sourcePorts: [9339],
    moduleName: 'laser',
    maxPayload: 1024 * 1024,
};
```

Use the server computer's reachable IPv4 address. `127.0.0.1` refers to the
iPhone itself when the script runs on an iPhone. The script redirects only TCP
connections whose original port is listed in `sourcePorts`; it supports Darwin
IPv4 and IPv4-mapped IPv6 destinations. It does not redirect HTTPS asset traffic.

Start the Python server with its existing settings:

```python
"UsePepperCrypto": True,
"ClientMajor": 70,
```

Load the script at app spawn, before the first connection. With a working Frida
installation, list application identifiers with `frida-ps -Uai`, then replace
`YOUR_BUNDLE_ID` below with the identifier of your v70 client:

```sh
frida -U -f YOUR_BUNDLE_ID -l scripts/v70-ios.js
```

For an existing Frida Gadget setup, load this same JS file as its startup script.
Do not inject after login has already started; restart the app with the script.

The expected startup line is:

```
[BSVS] v70 Pepper XSalsa19 ready; redirect 192.168.0.21:9339
```

`Unsupported build` means a native function prologue differs from the IDA build.
All six prologues are checked before any replacements are installed. Another
v70 build or Android needs its own verified addresses.

## Native hooks

Offsets are relative to the loaded `laser` module base, so ASLR is accounted for.

| RVA | Purpose |
| --- | --- |
| `0x5231B4` | Supply the public-key buffers expected by this server's login hash |
| `0xE81BCC` | Return an empty login prefix vector through ARM64 register X8 |
| `0xE726FC` / `0xE727AC` | Login Box encrypt/decrypt |
| `0xE72848` / `0xE72900` | Session SecretBox encrypt/decrypt |

The original login code at `0xE66718` hashes 64 contiguous bytes at Messaging
`+568`. The script supplies `clientPublicKey || serverPublicKey` there. Box
callbacks use the derived key from `Classes/Crypto.py`; session callbacks use
the random session key supplied by the server. The empty prefix makes the login
envelope `0x00 || clientNonce[24] || LoginMessage`, matching the server.

Live-device testing found that the native v70 login digest differs from the
server's BLAKE2b-24 even with the matching key buffers. The JS Box callbacks
therefore recompute BLAKE2b-24 for `pk || serverPk` and
`clientNonce || pk || serverPk`. Session-key handling and nonce generation remain
native. `0xCA4454` increments the 24-byte nonce by two, matching the server.
JS replaces the crypto boundaries with XSalsa19-Poly1305, so changing only a
public key or using standard XSalsa20 is insufficient for this server.

The keys match the current `Classes/Crypto.py`. If those constants change,
regenerate the `PEPPER` constants in the script as well. No plaintext-server
mode is needed for this script.

## Checks

```sh
node --check scripts/v70-ios.js
node tests/test_v70_script.js
python3 -m py_compile scripts/run_v70_usb.py
python3 -m unittest discover -s tests -v
```

Crypto outputs are checked against the upstream C# vectors. Redirect tests check
the full Darwin sockaddr bytes and leave other ports untouched. On the connected
iPhone, the USB launcher successfully exchanged ClientHello/ServerHello, passed
encrypted login authentication, and delivered LoginOk and OwnHomeData. Native
decoder traces returned successfully for LoginOk, DailyData, ConfData, Home,
Avatar and OwnHomeData. After correcting the nested DailyData/Home layouts,
the native decoder read tutorial state 2 and the user confirmed the main menu.

`tests/test_script_crypto.py` also exchanges a login, a server home response and
two client requests between the JS crypto code and Python `PepperSession`.

Frida API reference: https://frida.re/docs/javascript-api/
