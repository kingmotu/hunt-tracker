import { defineComponent } from 'vue';
import {
  SteamService,
  AttributesXmlService,
  LoggerService,
  ProfileService,
} from '@/services/index';
import * as fs from 'fs/promises';

export default defineComponent({
  name: 'Startup',
  components: {},
  data: () => ({
    valid: true,
    steamPath: '',
    steamActiveUserId: '',
    steamLastUsedGameName: '',
    huntAppsId: '',
    huntInstallPath: '',
    fileWatcher: null,
    panel: [0],
    profileDisabled: true,
  }),
  created() {},
  mounted() {
    if (ProfileService.LastUsedProfileUuid != null) {
      ProfileService.FetchUserProfile(ProfileService.LastUsedProfileUuid)
        .then((profile) => {
          LoggerService.debug(`profile fetched: `, profile);
        })
        .catch((error) => {
          LoggerService.error(error);
        });
    } else {
      LoggerService.debug(`no profile uuid found, create new profile`);
    }
  },
  watch: {},
  methods: {
    startWatchAttribuesXml() {
      AttributesXmlService.StartWatchAttributesXml(SteamService.HuntAttributesXmlPath);
    },
    stopWatchAttribuesXml() {
      AttributesXmlService.StopWatchAttributesXml();
    },
    readSteamInfos() {
      SteamService.ReadSteamInfos()
        .catch((error) => {
          LoggerService.error(`Error on fetching Steaminfos: `, error);
        })
        .finally(() => {
          this.steamPath = SteamService.SteamPath;
          this.steamActiveUserId = SteamService.SteamActiveUserId;
          this.steamLastUsedGameName = SteamService.SteamLastUsedGameName;
          this.huntAppsId = SteamService.HuntAppIdHash;
          this.huntInstallPath = SteamService.HuntInstallPath;
        });
    },
    test() {
      // fs.readFile('src/mock/attributes_BH_Solo.xml')
      SteamService.SetLibPath();
      fs.readFile(
        'C:\\Users\\sko\\Documents\\git\\privat\\hunt-tracker\\src\\mock\\attributes_QP.xml',
      )
        .then((file) => {
          AttributesXmlService.parseXmlValues(file);
        })
        .catch((error) => {
          console.error(`error on open file: `, error);
        });
    },
  },
  computed: {},
});
