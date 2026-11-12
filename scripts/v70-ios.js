'use strict';

// Crypto adapted from the BSL.v68 port; see THIRD_PARTY_NOTICES.md (Apache-2.0).
// iOS ARM64 laser v70: 8537bea717182189fe8bbb29760250cd071e34ecc69c79c19b4010ac47ff9cea.
// Load at process spawn. Server: Configuration.py -> UsePepperCrypto: True.
const CONFIG = {
    host: '192.168.0.21',
    port: 9339,
    sourcePorts: [9339],
    moduleName: 'laser',
    maxPayload: 1024 * 1024,
    transport: 'lan',
    diagnostics: false,
    ...globalThis.BSVS_V70_OPTIONS,
};

// Same dialect and key configuration as Classes/Crypto.py, not standard NaCl.
const PEPPER = {
    clientPublicKey: 'dff7aa80295d10ab5dff467e14cf217dff422529973da8aba2f76dda4562980e',
    serverPublicKey: '46cb575cd747a84045647b8f59473ffafbcd302093c73fd5f8233d779bea886b',
    boxKey: 'b59d68ccba93e5c792301f2beea3486f972a317987ccd9efd0405dc0230da032',
};

const PROFILE = {
    keypair: { rva: 0x5231b4, signature: 'fc6fbaa9fa6701a9f85f02a9f65703a9' },
    loginPrefix: { rva: 0xe81bcc, signature: 'f657bda9f44f01a9fd7b02a9fd830091' },
    boxEncrypt: { rva: 0xe726fc, signature: 'fa67bba9f85f01a9f65702a9f44f03a9' },
    boxDecrypt: { rva: 0xe727ac, signature: 'f85fbca9f65701a9f44f02a9fd7b03a9' },
    streamEncrypt: { rva: 0xe72848, signature: 'fa67bba9f85f01a9f65702a9f44f03a9' },
    streamDecrypt: { rva: 0xe72900, signature: 'fc6fbaa9fa6701a9f85f02a9f65703a9' },
};

const Crypto19 = (() => {
    function fromHex(value) {
        if (value.length % 2 || !/^[0-9a-f]*$/i.test(value)) throw new Error('Invalid hex');
        return Uint8Array.from(value.match(/../g) || [], x => parseInt(x, 16));
    }

    function toHex(value) {
        return Array.from(value, x => x.toString(16).padStart(2, '0')).join('');
    }

    function rotate(value, bits) {
        return ((value << bits) | (value >>> (32 - bits))) >>> 0;
    }

    function words(bytes) {
        const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
        return Array.from({ length: bytes.length / 4 }, (_, i) => view.getUint32(i * 4, true));
    }

    function core(input, key, hsalsa = false) {
        const constants = [0x61707865, 0x3320646e, 0x79622d32, 0x6b206574];
        const keys = words(key);
        const inputs = words(input);
        let x = new Uint32Array(16);
        for (let i = 0; i < 4; i++) {
            x[5 * i] = constants[i];
            x[1 + i] = keys[i];
            x[6 + i] = inputs[i];
            x[11 + i] = keys[4 + i];
        }
        const initial = x.slice();
        for (let round = 0; round < 19; round++) {
            const next = new Uint32Array(16);
            for (let j = 0; j < 4; j++) {
                const t = Array.from({ length: 4 }, (_, m) => x[(5 * j + 4 * m) % 16]);
                t[1] ^= rotate(t[0] + t[3], 7);
                t[2] ^= rotate(t[1] + t[0], 9);
                t[3] ^= rotate(t[2] + t[1], 13);
                t[0] ^= rotate(t[3] + t[2], 18);
                for (let m = 0; m < 4; m++) next[4 * j + (j + m) % 4] = t[m];
            }
            x = next;
        }
        const indices = hsalsa ? [0, 5, 10, 15, 6, 7, 8, 9] : Array.from({ length: 16 }, (_, i) => i);
        const output = new Uint8Array(indices.length * 4);
        const view = new DataView(output.buffer);
        indices.forEach((i, j) => view.setUint32(j * 4, hsalsa ? x[i] : (x[i] + initial[i]) >>> 0, true));
        return output;
    }

    function stream(length, nonce, key) {
        if (nonce.length !== 24 || key.length !== 32) throw new Error('Invalid nonce/key size');
        const subkey = core(nonce.subarray(0, 16), key, true);
        const input = new Uint8Array(16);
        input.set(nonce.subarray(16));
        const counter = new DataView(input.buffer);
        const output = new Uint8Array(length);
        for (let offset = 0; offset < length; offset += 64) {
            counter.setUint32(8, offset / 64, true);
            output.set(core(input, subkey).subarray(0, Math.min(64, length - offset)), offset);
        }
        return output;
    }

    function littleInteger(bytes) {
        let value = 0n;
        for (let i = bytes.length - 1; i >= 0; i--) value = (value << 8n) | BigInt(bytes[i]);
        return value;
    }

    function poly1305(message, key) {
        const r = littleInteger(key.subarray(0, 16)) & 0x0ffffffc0ffffffc0ffffffc0fffffffn;
        const s = littleInteger(key.subarray(16, 32));
        const prime = (1n << 130n) - 5n;
        let accumulator = 0n;
        for (let offset = 0; offset < message.length; offset += 16) {
            const block = message.subarray(offset, offset + 16);
            const value = littleInteger(block) + (1n << BigInt(8 * block.length));
            accumulator = ((accumulator + value) * r) % prime;
        }
        let value = (accumulator + s) & ((1n << 128n) - 1n);
        return Uint8Array.from({ length: 16 }, () => {
            const byte = Number(value & 255n);
            value >>= 8n;
            return byte;
        });
    }

    function secretbox(message, nonce, key) {
        const keystream = stream(message.length + 32, nonce, key);
        const output = new Uint8Array(message.length + 16);
        for (let i = 0; i < message.length; i++) output[i + 16] = message[i] ^ keystream[i + 32];
        output.set(poly1305(output.subarray(16), keystream.subarray(0, 32)));
        return output;
    }

    function open(ciphertext, nonce, key) {
        if (ciphertext.length < 16) throw new Error('Truncated ciphertext');
        const keystream = stream(ciphertext.length + 16, nonce, key);
        const tag = poly1305(ciphertext.subarray(16), keystream.subarray(0, 32));
        let difference = 0;
        for (let i = 0; i < 16; i++) difference |= tag[i] ^ ciphertext[i];
        if (difference !== 0) throw new Error('Invalid authentication tag');
        const output = new Uint8Array(ciphertext.length - 16);
        for (let i = 0; i < output.length; i++) output[i] = ciphertext[i + 16] ^ keystream[i + 32];
        return output;
    }

    function blake2b24(input) {
        const mask = (1n << 64n) - 1n;
        const iv = [0x6a09e667f3bcc908n, 0xbb67ae8584caa73bn, 0x3c6ef372fe94f82bn, 0xa54ff53a5f1d36f1n,
            0x510e527fade682d1n, 0x9b05688c2b3e6c1fn, 0x1f83d9abfb41bd6bn, 0x5be0cd19137e2179n];
        const sigma = [
            [0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15],
            [14,10,4,8,9,15,13,6,1,12,0,2,11,7,5,3],
            [11,8,12,0,5,2,15,13,10,14,3,6,7,1,9,4],
            [7,9,3,1,13,12,11,14,2,6,5,10,4,0,15,8],
            [9,0,5,7,2,4,10,15,14,1,11,12,6,8,3,13],
            [2,12,6,10,0,11,8,3,4,13,7,5,15,14,1,9],
            [12,5,1,15,14,13,4,10,0,7,6,3,9,2,8,11],
            [13,11,7,14,12,1,3,9,5,0,15,4,8,6,2,10],
            [6,15,14,9,11,3,0,8,12,2,13,7,1,4,10,5],
            [10,2,8,4,7,6,1,5,15,11,9,14,3,12,13,0],
        ];
        const h = iv.slice();
        h[0] ^= 0x01010018n;
        const rotate64 = (value, bits) => ((value >> bits) | (value << (64n - bits))) & mask;
        const blocks = Math.max(1, Math.ceil(input.length / 128));
        for (let blockIndex = 0; blockIndex < blocks; blockIndex++) {
            const block = new Uint8Array(128);
            const offset = blockIndex * 128;
            block.set(input.subarray(offset, offset + 128));
            const m = Array.from({ length: 16 }, (_, i) => littleInteger(block.subarray(i * 8, i * 8 + 8)));
            const v = h.concat(iv);
            v[12] ^= BigInt(Math.min(input.length, offset + 128));
            if (blockIndex === blocks - 1) v[14] ^= mask;
            function mix(a, b, c, d, x, y) {
                v[a] = (v[a] + v[b] + x) & mask;
                v[d] = rotate64(v[d] ^ v[a], 32n);
                v[c] = (v[c] + v[d]) & mask;
                v[b] = rotate64(v[b] ^ v[c], 24n);
                v[a] = (v[a] + v[b] + y) & mask;
                v[d] = rotate64(v[d] ^ v[a], 16n);
                v[c] = (v[c] + v[d]) & mask;
                v[b] = rotate64(v[b] ^ v[c], 63n);
            }
            for (let round = 0; round < 12; round++) {
                const s = sigma[round % 10];
                mix(0,4,8,12,m[s[0]],m[s[1]]); mix(1,5,9,13,m[s[2]],m[s[3]]);
                mix(2,6,10,14,m[s[4]],m[s[5]]); mix(3,7,11,15,m[s[6]],m[s[7]]);
                mix(0,5,10,15,m[s[8]],m[s[9]]); mix(1,6,11,12,m[s[10]],m[s[11]]);
                mix(2,7,8,13,m[s[12]],m[s[13]]); mix(3,4,9,14,m[s[14]],m[s[15]]);
            }
            for (let i = 0; i < 8; i++) h[i] ^= v[i] ^ v[i + 8];
        }
        return Uint8Array.from({ length: 24 }, (_, i) => Number((h[Math.floor(i / 8)] >> BigInt(8 * (i % 8))) & 255n));
    }

    return { fromHex, toHex, secretbox, open, blake2b24 };
})();

function ipv4Bytes(host) {
    const parts = host.split('.');
    if (parts.length !== 4 || parts.some(x => !/^\d{1,3}$/.test(x) || Number(x) > 255)) {
        throw new Error('CONFIG.host must be a numeric IPv4 address');
    }
    return parts.map(Number);
}

// Pure helper also used by the Node regression tests. Darwin sockaddr layout.
function redirectAddress(original, host, port, sourcePorts) {
    const family = original[1];
    const size = family === 2 ? 16 : family === 30 ? 28 : 0;
    if (size === 0 || original.length < size) return null;
    const sourcePort = original[2] * 256 + original[3];
    if (!sourcePorts.includes(sourcePort)) return null;
    if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('Invalid target port');
    const ip = ipv4Bytes(host);
    const output = new Uint8Array(size);
    output[0] = size;
    output[1] = family;
    output[2] = port >>> 8;
    output[3] = port & 255;
    if (family === 2) {
        output.set(ip, 4);
    } else {
        // Preserve an IPv6 socket by using an IPv4-mapped IPv6 destination.
        output[18] = 255;
        output[19] = 255;
        output.set(ip, 20);
    }
    return output;
}

function install(module, destination = { host: CONFIG.host, port: CONFIG.port }) {
    if (Process.platform !== 'darwin' || Process.arch !== 'arm64') throw new Error('Requires iOS ARM64');
    ipv4Bytes(CONFIG.host);
    if (!Number.isInteger(CONFIG.port) || CONFIG.port < 1 || CONFIG.port > 65535) throw new Error('Invalid CONFIG.port');
    const addresses = {};
    // Validate every hook before modifying the process.
    for (const [name, profile] of Object.entries(PROFILE)) {
        const address = module.base.add(profile.rva);
        const actual = Crypto19.toHex(new Uint8Array(address.readByteArray(16)));
        if (actual !== profile.signature) throw new Error(`Unsupported build: ${name} at ${address}`);
        addresses[name] = address;
    }

    const exports = ['connect', 'connect$NOCANCEL'].map(name => {
        const address = typeof Module.findGlobalExportByName === 'function'
            ? Module.findGlobalExportByName(name) : Module.findExportByName(null, name);
        return { name, address };
    }).filter(x => x.address !== null);
    if (exports.length === 0) throw new Error('No connect export found');

    const callbacks = [];
    const replacements = [];
    const listeners = [];
    const boxKey = Crypto19.fromHex(PEPPER.boxKey);
    function replace(address, callback) {
        callbacks.push(callback);
        Interceptor.replace(address, callback);
        replacements.push(address);
    }

    function cipherCallback(decrypt, isBox) {
        return new NativeCallback(function (input, inputLength, output, outputCapacity, nonce, key, overhead) {
            try {
                if (inputLength < 0 || inputLength > CONFIG.maxPayload + 16) throw new Error('Invalid payload size');
                if (!isBox && overhead !== 16) throw new Error('Unsupported encryption overhead');
                const expected = inputLength + (decrypt ? -16 : 16);
                if (expected < 0 || expected > outputCapacity) throw new Error('Invalid output capacity');
                const inputBytes = new Uint8Array(input.readByteArray(inputLength));
                let nonceBytes = new Uint8Array(nonce.readByteArray(24));
                const keyBytes = isBox ? boxKey : new Uint8Array(key.readByteArray(32));
                if (isBox) {
                    // The live v70 client's native digest differs from hashlib.blake2b.
                    // key is Messaging +600; pk is +568; client nonce is +520.
                    const material = new Uint8Array(decrypt ? 88 : 64);
                    let offset = 0;
                    if (decrypt) {
                        material.set(new Uint8Array(key.sub(80).readByteArray(24)));
                        offset = 24;
                    }
                    material.set(new Uint8Array(key.sub(32).readByteArray(32)), offset);
                    material.set(Crypto19.fromHex(PEPPER.serverPublicKey), offset + 32);
                    nonceBytes = Crypto19.blake2b24(material);
                }
                const result = decrypt ? Crypto19.open(inputBytes, nonceBytes, keyBytes)
                    : Crypto19.secretbox(inputBytes, nonceBytes, keyBytes);
                output.writeByteArray(result);
                return 0;
            } catch (error) {
                console.error(`[BSVS] ${decrypt ? 'decrypt' : 'encrypt'} failed: ${error.message}`);
                return 1;
            }
        }, 'int', ['pointer', 'int', 'pointer', 'int', 'pointer', 'pointer', 'int']);
    }

    try {
        if (CONFIG.diagnostics) {
            for (const [name, offset] of [['LoginOk decode', 0xba62cc], ['OwnHome decode', 0xbd1b00],
                ['Home decode', 0xb96544], ['Daily decode', 0xbcb098], ['Conf decode', 0xbc885c], ['Avatar decode', 0xa5a25c]]) {
                listeners.push(Interceptor.attach(module.base.add(offset), {
                    onEnter(args) {
                        this.object = args[0];
                        this.stream = ['Home decode', 'Daily decode', 'Conf decode', 'Avatar decode'].includes(name) ? args[1] : null;
                        console.log(`[BSVS] enter ${name}`);
                        if (this.stream !== null) console.log(`[BSVS] ${name} start=${this.stream.add(20).readS32()}`);
                    },
                    onLeave() {
                        console.log(`[BSVS] leave ${name}`);
                        if (this.stream !== null) console.log(`[BSVS] ${name} end=${this.stream.add(20).readS32()}`);
                        if (name === 'Avatar decode') {
                            console.log(`[BSVS] avatar tutorial=${this.object.add(696).readS32()} tier=${this.object.add(648).readS32()} flags=${this.object.add(700).readS32()}`);
                        }
                    },
                }));
            }
            for (const name of ['abort', 'exit', '_exit', '__assert_rtn', 'objc_exception_throw']) {
                const target = Module.findGlobalExportByName(name);
                if (target === null) continue;
                listeners.push(Interceptor.attach(target, {
                    onEnter() {
                        console.error(`[BSVS] ${name}: ` + Thread.backtrace(this.context, Backtracer.ACCURATE)
                            .slice(0, 16).map(address => DebugSymbol.fromAddress(address).toString()).join(' | '));
                    },
                }));
            }
            Process.setExceptionHandler(details => {
                console.error(`[BSVS] native exception ${details.type} pc=${details.context.pc} lr=${details.context.lr}`);
                return false;
            });
        }
        replace(addresses.keypair, new NativeCallback(function (publicKey, secretKey) {
            publicKey.writeByteArray(Crypto19.fromHex(PEPPER.clientPublicKey));
            // Native login hashes these contiguous buffers as pk || serverPk.
            // The Box callbacks use boxKey instead of treating this as a private key.
            secretKey.writeByteArray(Crypto19.fromHex(PEPPER.serverPublicKey));
            return 0;
        }, 'int', ['pointer', 'pointer']));

        replace(addresses.loginPrefix, new NativeCallback(function () {
            // ARM64 indirect result register: return an empty std::vector<uint8_t>.
            // Native login then writes prefix length 0, nonce[24], login bytes.
            const vector = this.context.x8;
            vector.writePointer(ptr(0));
            vector.add(8).writePointer(ptr(0));
            vector.add(16).writePointer(ptr(0));
            return 0;
        }, 'ulong', ['pointer']));

        replace(addresses.boxEncrypt, cipherCallback(false, true));
        replace(addresses.boxDecrypt, cipherCallback(true, true));
        replace(addresses.streamEncrypt, cipherCallback(false, false));
        replace(addresses.streamDecrypt, cipherCallback(true, false));

        const seen = new Set();
        for (const item of exports) {
            if (seen.has(item.address.toString())) continue;
            seen.add(item.address.toString());
            listeners.push(Interceptor.attach(item.address, {
                onEnter(args) {
                    const length = args[2].toInt32();
                    if (args[1].isNull() || length < 4 || length > 128) return;
                    const original = new Uint8Array(args[1].readByteArray(length));
                    const redirected = redirectAddress(original, destination.host, destination.port, CONFIG.sourcePorts);
                    if (redirected === null) return;
                    this.destination = Memory.alloc(redirected.length);
                    this.destination.writeByteArray(redirected);
                    args[1] = this.destination;
                    args[2] = ptr(redirected.length);
                    console.log(`[BSVS] ${item.name} fd=${args[0].toInt32()} -> ${destination.host}:${destination.port} (${CONFIG.transport})`);
                },
            }));
        }
        Interceptor.flush();
        // Retain callback pointers for the entire script lifetime.
        globalThis.bsvsV70 = { callbacks, replacements, listeners };
        console.log(`[BSVS] v70 Pepper XSalsa19 ready; redirect ${destination.host}:${destination.port} (${CONFIG.transport})`);
        send({ kind: 'bsvs-ready', transport: CONFIG.transport });
    } catch (error) {
        for (const listener of listeners) listener.detach();
        for (const address of replacements.reverse()) Interceptor.revert(address);
        Interceptor.flush();
        throw error;
    }
}

async function usbListener() {
    const listener = await Socket.listen({ family: 'ipv4', host: '127.0.0.1', port: 0 });
    let nextId = 0;
    async function relay(connection) {
        const id = ++nextId;
        let closed = false;
        function close() {
            if (closed) return;
            closed = true;
            connection.close().catch(() => {});
            send({ kind: 'usb-close', id });
        }
        function receive() {
            recv(`usb-down-${id}`, async message => {
                try {
                    if (message.action === 'close') return close();
                    await connection.output.writeAll(Crypto19.fromHex(message.hex).buffer);
                    send({ kind: 'usb-down-ack', id });
                    if (!closed) receive();
                } catch (error) {
                    console.error(`[BSVS] USB receive: ${error}`);
                    close();
                }
            });
        }
        receive();
        send({ kind: 'usb-open', id });
        try {
            while (!closed) {
                const data = await connection.input.read(65536);
                if (data.byteLength === 0) break;
                const acknowledged = new Promise(resolve => recv(`usb-up-ack-${id}`, resolve));
                send({ kind: 'usb-data', id }, data);
                await acknowledged;
            }
        } catch (error) {
            if (!closed) console.error(`[BSVS] USB send: ${error}`);
        } finally {
            close();
        }
    }
    (async () => {
        while (true) {
            try { relay(await listener.accept()); }
            catch (error) { console.error(`[BSVS] USB listener: ${error}`); break; }
        }
    })();
    globalThis.bsvsUsbListener = listener;
    return { host: '127.0.0.1', port: listener.port };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Crypto19, redirectAddress, PEPPER, CONFIG, PROFILE };
} else if (!globalThis.bsvsV70Starting) {
    globalThis.bsvsV70Starting = true;
    setImmediate(async () => {
        let attempts = 0;
        let destination;
        function start() {
            const module = Process.findModuleByName(CONFIG.moduleName);
            if (module === null) return false;
            install(module, destination);
            return true;
        }
        try {
            destination = CONFIG.transport === 'usb' ? await usbListener() : { host: CONFIG.host, port: CONFIG.port };
            if (start()) return;
            const timer = setInterval(() => {
                try {
                    if (start()) clearInterval(timer);
                    else if (++attempts >= 150) {
                        clearInterval(timer);
                        console.error(`[BSVS] Module ${CONFIG.moduleName} was not loaded`);
                    }
                } catch (error) {
                    clearInterval(timer);
                    console.error(`[BSVS] ${error.stack || error}`);
                    send({ kind: 'bsvs-error', error: String(error) });
                }
            }, 200);
        } catch (error) {
            console.error(`[BSVS] ${error.stack || error}`);
            send({ kind: 'bsvs-error', error: String(error) });
        }
    });
}
