# OwnHomeDataMessage: v68 to v70

Compared the user's two open iOS ARM64 databases through their local IDA MCP
servers. Addresses below include the image base `0x100000000`.

| Function | v68 | v70 |
| --- | --- | --- |
| Message type getter (24101) | `0x100AEB264` | `0x100BD1B74` |
| OwnHomeDataMessage encode | `0x100AEB19C` | `0x100BD1AAC` |
| OwnHomeDataMessage decode | `0x100AEB1F0` | `0x100BD1B00` |
| LogicClientHome encode | `0x100AB2378` | `0x100B95F50` |
| LogicClientHome decode | `0x100AB2900` | `0x100B96544` |
| LogicDailyData encode | `0x100AE3F4C` | `0x100BCA7AC` |
| LogicConfData encode | `0x100AE18A4` | `0x100BC80A8` |
| LogicClientAvatar encode | `0x100991C9C` | `0x100A59E70` |
| LogicClientAvatar decode | — | `0x100A5A25C` |

The v70 input is `libgDumps/v70.x/laser`, SHA-256
`8537bea717182189fe8bbb29760250cd071e34ecc69c79c19b4010ac47ff9cea`.
The v68 input is `libgDumps/v68.x ios/laser`.

## Changes used by the current packet

The top-level message still writes two VInts, then the home and avatar.
DailyData and ConfData have the same direct serialization order after mapping
function addresses between versions. Live testing additionally required
correcting the populated DailyData and Home structures inherited from the C#
sample; static comparison of the top-level functions alone did not validate them.

The tail of Home now writes:

1. Presence flags for pointers at `+296`, `+304` and `+312`.
2. A new presence flag for `+280`. When present, `0x100A6902C` writes two
   VInts, from offsets `+4` and `+0` of that object. The server sends absent.
3. The presence flag for `+320`, then list counts at `+260` and `+340`, both zero.
4. The existing optional object flag at `+344`, then the flag at `+352`.
5. A new presence flag for `+288`. When present, `0x100A97718` writes Boolean
   `+4`, VInt `+8`, Boolean `+12`, VInt `+0`. The server sends absent.

Avatar keeps its field order and adds a second trailing Boolean at `+749`,
after the existing flag at `+748`. Both native encode and decode confirm it.

All three added flags are false. Boolean packing means these additions fit
inside existing flag bytes for the current empty optional blocks. Packet
length alone therefore cannot distinguish these v68/v70 changes. Avatar's
writer now finishes at bit offset 2 instead of 1.

The display label was changed to `BSVS.v70`; account and home IDs still use
the current player. Configuration and login version reporting now use 70.

## Empty branches with additional v70 fields

The comparison also found changes inside these structures, which the current
packet does not populate:

- Shop offers: `0x100C11BC8` adds a VInt from `+284` before the VInt at `+280`.
- DailyData's list at `+452`: `0x100BC1088` adds an Int from `+72`.
- DailyData's optional object at `+488`: `0x100C13CD4` adds a VInt from `+80`.

Their counts/presence flags remain zero/false. Implement their v70 contents
before enabling those branches.

## Verification

`tests/fixtures/own_home_v70.hex` records the current packet with player ID
`[0, 1]` and name `LkPrtctrd`, after validation with the live native decoder.
It is a regression fixture for the corrected server encoder, not an output
of an unchanged upstream C# serializer. Crypto vectors remain the original
v68 vectors.

Live v70 testing confirmed DailyData ends at byte 142, ConfData at 391, Home
at 443, and Avatar at the end of the packet. The previous malformed DailyData
and optional Home offer data caused reads beyond the packet, making the
avatar appear to have tutorial state 0. Daily's season/optional data is now
empty, Home +192 offers are absent, and the mandatory Home +208/+216 layouts
follow the native serializers. The selected brawler is Shelly (`16, 0`).

The tutorial predicate `0x100A5B6EC` checks whether Avatar +696 equals zero.
The corrected packet supplies 2 in that field. On the connected iPhone the
native decoder read tutorial=2 and the user confirmed the main menu opened.
The avatar regression test parses the native field order from byte 443 and
checks tutorial completion and exact packet consumption.

Protocol tests also exercise encrypted login and the home response through
threaded sockets and asyncio. Other game modes and packet types are not
validated by this home-screen check.
