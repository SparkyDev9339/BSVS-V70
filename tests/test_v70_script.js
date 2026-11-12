'use strict';

const assert = require('node:assert/strict');
const { Crypto19: crypto, redirectAddress, PEPPER } = require('../scripts/v70-ios.js');
const vectors = require('./fixtures/bsl_v68_vectors.json');
const hashes = require('./fixtures/blake2b24_vectors.json');
const key = Uint8Array.from({ length: 32 }, (_, i) => i);
const nonce = Uint8Array.from({ length: 24 }, (_, i) => i);

for (const [length, expected] of Object.entries(vectors.secretbox)) {
    const message = Uint8Array.from({ length: Number(length) }, (_, i) => i % 256);
    const ciphertext = crypto.secretbox(message, nonce, key);
    assert.equal(crypto.toHex(ciphertext), expected, `C# vector length ${length}`);
    assert.deepEqual(crypto.open(ciphertext, nonce, key), message);
    const modified = ciphertext.slice();
    modified[0] ^= 1;
    assert.throws(() => crypto.open(modified, nonce, key), /authentication/);
}
assert.equal(PEPPER.boxKey, vectors.boxkey);
for (const [length, expected] of Object.entries(hashes)) {
    const input = Uint8Array.from({ length: Number(length) }, (_, i) => i % 256);
    assert.equal(crypto.toHex(crypto.blake2b24(input)), expected, `BLAKE2b-24 length ${length}`);
}
assert.throws(() => crypto.open(new Uint8Array(15), nonce, key), /Truncated/);
assert.throws(() => crypto.secretbox(new Uint8Array(0), nonce.subarray(1), key), /size/);

// Complete expected Darwin IPv4 sockaddr_in, including network byte order.
const ipv4 = crypto.fromHex('1002247b080808080000000000000000');
assert.equal(crypto.toHex(redirectAddress(ipv4, '192.168.0.21', 9339, [9339])),
    '1002247bc0a800150000000000000000');
assert.equal(crypto.toHex(redirectAddress(ipv4, '10.20.30.40', 12345, [9339])),
    '100230390a141e280000000000000000');

// sockaddr_in6 remains IPv6: ::ffff:192.168.0.21, port 9339.
const ipv6 = crypto.fromHex('1c1e247b000000002001486048600000000000000000888800000000');
assert.equal(crypto.toHex(redirectAddress(ipv6, '192.168.0.21', 9339, [9339])),
    '1c1e247b0000000000000000000000000000ffffc0a8001500000000');
const https = ipv4.slice();
https[2] = 1;
https[3] = 187;
assert.equal(redirectAddress(https, '192.168.0.21', 9339, [9339]), null);
assert.equal(redirectAddress(ipv4.subarray(0, 8), '192.168.0.21', 9339, [9339]), null);
assert.throws(() => redirectAddress(ipv4, '192.168.0.999', 9339, [9339]), /IPv4/);
assert.throws(() => redirectAddress(ipv4, '192.168.0.21', 65536, [9339]), /port/);
console.log('v70 script: 10 C# crypto vectors, 9 BLAKE2b-24 vectors, tag rejection, and Darwin redirect checks passed');
