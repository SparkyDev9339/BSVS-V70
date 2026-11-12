# Adapted from LkPrtctrd/BSL.v68, Apache-2.0 (see THIRD_PARTY_NOTICES.md).
# Native v70 layout and verification: docs/own-home-v70.md.
from Classes.Packets.PiranhaMessage import PiranhaMessage


class OwnHomeDataMessage(PiranhaMessage):
    def __init__(self, messageData):
        super().__init__(messageData)
        self.messageVersion = 0

    def encode(self, fields, player):
        self.messagePayload = b""
        self.offset = 0
        self.bitoffset = 0

        # OwnHomeDataMessage
        self.writeVInt(0)  # Home tick
        self.writeVInt(-1)  # Home version

        # LogicDailyData
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(100000)
        self.writeVInt(100000)
        self.writeVInt(100000)
        self.writeVInt(454)
        self.writeVInt(1488)

        self.writeDataReference(28, 1372)  # Player thumbnail
        self.writeDataReference(43, 0)  # Name color

        self.writeVInt(0)  # Progress entries
        self.writeVInt(0)  # Cosmetic collections
        self.writeVInt(0)  # Cosmetic collections
        self.writeVInt(0)  # Cosmetic collections
        self.writeVInt(0)  # Cosmetic collections
        self.writeVInt(0)  # Cosmetic collections
        self.writeVInt(0)  # Cosmetic collections

        self.writeVInt(0)
        self.writeVInt(100000)
        self.writeVInt(0)
        self.writeVInt(1)
        self.writeBoolean(True)  # Daily +168

        self.writeVInt(19500)
        self.writeVInt(111111)
        self.writeVInt(1375134)
        self.writeVInt(0)
        self.writeVInt(1375134)

        # Daily statistics
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)  # Statistics entries

        self.writeBoolean(True)  # Daily +232
        self.writeVInt(2)
        self.writeVInt(2)
        self.writeVInt(2)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)

        # Shop and selected brawlers
        self.writeVInt(0)  # Shop offers
        self.writeVInt(200)
        self.writeVInt(-1)
        self.writeVInt(0)  # Daily +356: entries
        self.writeVInt(0)
        self.writeVInt(-1)

        self.writeByte(3)
        self.writeDataReference(16, 112)
        self.writeDataReference(16, 113)
        self.writeDataReference(16, 111)

        self.writeString('RU')
        self.writeString('BSVS.v70')

        # Daily settings: (value, setting ID)
        self.writeVInt(8)
        self.writeVLong(1, 9)
        self.writeVLong(1, 22)
        self.writeVLong(3, 25)
        self.writeVLong(1, 24)
        self.writeVLong(2, 15)
        self.writeVLong(32447, 28)
        self.writeVLong(100, 46)
        self.writeVLong(1, 52)

        # Seasons and optional daily data
        self.writeVInt(0)  # Daily +436: season entries

        self.writeVInt(1)  # BrawlPassSeasonData::encode
        for SeasonId in range(1):
            self.writeVInt(55)
            self.writeVInt(0)
            self.writeBoolean(True)
            self.writeVInt(0)

            self.writeBoolean(False)
            self.writeBoolean(False)
            self.writeBoolean(True)
            self.writeInt(0)
            self.writeInt(0)
            self.writeInt(0)
            self.writeInt(0)

            self.writeBoolean(True)
            self.writeInt(0)
            self.writeInt(0)
            self.writeInt(0)
            self.writeInt(0)

            self.writeBoolean(True)
            self.writeBoolean(True)
            self.writeInt(0)
            self.writeInt(0)
            self.writeInt(0)
            self.writeInt(0)

            self.writeDataReference(0)

            self.writeVInt(0)
            self.writeInt(0)

        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)

        self.writeInt(0)
        self.writeVInt(0)
        self.writeDataReference(16, 0)  # Favorite Character
        self.writeBoolean(False)

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)

        self.writeVInt(0)  # Daily +468: entries
        self.writeVInt(0)  # Daily +284: reference list

        self.writeDataReference(2, 0)
        self.writeDataReference(2, 0)
        self.writeDataReference(2, 0)
        self.writeDataReference(2, 0)

        self.writeBoolean(False)  # Daily +528
        self.writeDataReference(2, 0)
        self.writeVInt(770)
        self.writeBoolean(False)  # Daily +536
        self.writeBoolean(False)  # Daily +544

        # LogicConfData
        self.writeVInt(38)
        for i in range(38):
            self.writeVInt(i + 1)

        # Events
        self.writeVInt(1)
        self.writeVInt(-1)
        self.writeVInt(2)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(85926)
        self.writeVInt(5)

        self.writeDataReference(15, 13)
        self.writeDataReference(0, -1)
        self.writeVInt(2)
        self.writeString(None)

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeBoolean(False)
        self.writeBoolean(False)

        self.writeVInt(0)
        self.writeBoolean(False)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)

        self.writeVInt(-1)
        self.writeBoolean(False)
        self.writeDataReference(0)
        self.writeBoolean(False)

        self.writeVInt(-1)
        self.writeVInt(-1)
        self.writeVInt(-1)
        self.writeVInt(-1)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)

        self.writeVInt(0)  # Conf +44: extra events
        self.writeVInt(0)  # Conf +60: additional events

        self.writeVInt(10)
        for upgradeCost in [20, 35, 75, 140, 290, 480, 800, 1250, 1875, 2800]:
            self.writeVInt(upgradeCost)

        self.writeVInt(4)
        for goldCost in [30, 80, 170, 360]:
            self.writeVInt(goldCost)

        self.writeVInt(4)
        for goldAmmount in [300, 880, 2040, 4680]:
            self.writeVInt(goldAmmount)

        self.writeVInt(0)  # Conf +140: entries

        # Configuration settings: (value, setting ID)
        self.writeVInt(21)
        self.writeVLong(501, 10008)
        self.writeVLong(0, 10046)
        self.writeVLong(30, 10050)
        self.writeVLong(0, 10051)
        self.writeVLong(5600, 10060)
        self.writeVLong(200, 117)
        self.writeVLong(1, 128)
        self.writeVLong(0, 65)
        self.writeVLong(41000187, 1)
        self.writeVLong(99999999, 131)
        self.writeVLong(100000, 138)
        self.writeVLong(1, 95)
        self.writeVLong(55598, 47)
        self.writeVLong(1, 123)
        self.writeVLong(200, 124)
        self.writeVLong(55598, 48)
        self.writeVLong(3, 50)
        self.writeVLong(500, 1100)
        self.writeVLong(500, 1101)
        self.writeVLong(1, 1002)
        self.writeVLong(500, 1102)

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)

        # Price tables: Conf +396,+412,+112
        self.writeVInt(6)
        self.writeVInt(0)
        self.writeVInt(29)
        self.writeVInt(79)
        self.writeVInt(169)
        self.writeVInt(349)
        self.writeVInt(699)
        self.writeVInt(6)
        self.writeVInt(0)
        self.writeVInt(160)
        self.writeVInt(450)
        self.writeVInt(500)
        self.writeVInt(1250)
        self.writeVInt(2500)
        self.writeVInt(5)
        self.writeVInt(0)
        self.writeVInt(100)
        self.writeVInt(400)
        self.writeVInt(1000)
        self.writeVInt(3000)

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)

        # LogicClientHome
        self.writeLong(*player.ID)
        self.writeVInt(0)  # Server commands
        self.writeVInt(-1)  # Home +76
        self.writeBoolean(False)  # Home +72

        self.writeVInt(0)  # Notifications
        self.writeVInt(0)  # Reference list
        self.writeVInt(0)  # Reference pairs

        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)

        self.writeVInt(0)  # Home +184: entries
        self.writeBoolean(False)  # Home +192: optional offers
        self.writeVInt(0)  # Home +200: entries

        # Home +208: references and flags
        self.writeDataReference(0)
        self.writeDataReference(0)
        self.writeDataReference(0)
        self.writeDataReference(0)
        self.writeDataReference(0)
        self.writeDataReference(0)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeVInt(0)  # Entries

        # Home +216: inventory and status
        self.writeVInt(0)  # Commodities
        self.writeVInt(0)  # Optional entries
        self.writeInt(0)  # Status
        self.writeBoolean(False)

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeBoolean(False)

        self.writeVInt(0)  # Extra commodities
        self.writeVInt(0)  # Entries
        self.writeVInt(0)  # Trailing commodities

        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeVInt(0)  # Home +264: entries

        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)
        self.writeBoolean(False)

        self.writeVInt(0)  # Home +260: optional-block list
        self.writeVInt(0)  # Home +340: optional-block list
        self.writeBoolean(False)  # Home +344
        self.writeBoolean(False)  # Home +352
        self.writeBoolean(False)  # Home +288

        # LogicClientAvatar
        self.writeVLong(*player.ID)
        self.writeVLong(*player.ID)
        self.writeVLong(*player.ID)

        self.writeStringReference(player.Name)
        self.writeBoolean(player.Registered)  # Name set
        self.writeInt(-1)  # Name change value

        # Commodity categories
        self.writeVInt(35)
        self.writeVInt(0)
        self.writeVInt(1)
        self.writeDataReference(23, 0)
        self.writeVInt(-1)
        self.writeVInt(1)

        for i in range(34):
            self.writeVInt(0)
            self.writeVInt(0)

        # Resources and experience
        self.writeVInt(99999)  # Gems
        self.writeVInt(99999)  # Free gems
        self.writeVInt(0)  # Experience level
        self.writeVInt(100)  # Experience points
        self.writeVInt(0)  # Tier

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(0)

        self.writeVInt(2)  # Avatar +696: tutorial completed
        self.writeVInt(1)  # Avatar +700
        self.writeVInt(0)  # Avatar +704: status
        self.writeVInt(0)  # Avatar +712
        self.writeString(None)  # Avatar +720

        self.writeVInt(0)
        self.writeVInt(0)
        self.writeVInt(2)
        self.writeVInt(0)
        self.writeBoolean(False)  # Avatar +748
        self.writeBoolean(False)  # Avatar +749

        return self.messagePayload

    def decode(self):
        return {}

    def getMessageType(self):
        return 24101

    def getMessageVersion(self):
        return self.messageVersion
