# Sources and changes

This project follows [nbs-offline/nbs-offline](https://github.com/nbs-offline/nbs-offline),
revision `c8cb76a82928b18dd3741589d37a15aa006c43df`.
NBS Offline is by Natesworks and Banaanae and is distributed under GPL-3.0-or-later;
the license is reproduced in `LICENSE`.

`src/packets/server/LoginOkMessage.ts` and the initial brawler/card mapping in
`config/config.json` are adapted from that revision. The native message
interception and mode-3 battle launch follow its architecture. Changes include a
v70 iOS profile, Frida 17 APIs, checked native buffers, native ownership handling,
deferred dispatch, new persistence and validation, and revised protocol layouts.

`src/packets/server/OwnHomeDataMessage.ts` and
`tests/fixtures/own_home_v70.hex` derive from the user's local `BSVS-V70`
project. Its home serializer is adapted from [LkPrtctrd/BSL.v68](https://github.com/LkPrtctrd/BSL.v68),
revision `a7374496b27489605c596b640e2831f5def61249`, under Apache-2.0.
The license is reproduced in `licenses/BSL.v68-Apache-2.0.txt`.
Changes here: TypeScript translation; configurable player, inventory, currencies
and cosmetics; the empty season/optional layout and fixture from that project's
previous native v70 validation. The neighbouring project's current serializer
does not match its saved fixture; this port uses the fixture's layout.

Native RVAs and field layouts were checked against the user's local v70 iOS
ARM64 image with IDA. No game binary or game assets are distributed here.
