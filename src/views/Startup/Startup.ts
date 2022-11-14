import { defineComponent } from 'vue';
import { SteamService, AttributesXmlService, LoggerService } from '@/services/index';
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
  }),
  created() {
    // fetch on init
    SteamService.ReadSteamInfos()
      .catch((error) => LoggerService.error(error))
      .finally(() => {
        this.steamPath = SteamService.SteamPath;
        this.steamActiveUserId = SteamService.SteamActiveUserId;
        this.steamLastUsedGameName = SteamService.SteamLastUsedGameName;
        this.huntAppsId = SteamService.HuntAppIdHash;
        this.huntInstallPath = SteamService.HuntInstallPath;
      });
  },
  watch: {},
  methods: {
    startWatchAttribuesXml() {
      AttributesXmlService.StartWatchAttributesXml(SteamService.HuntAttributesXmlPath);
    },
    stopWatchAttribuesXml() {
      AttributesXmlService.StopWatchAttributesXml();
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
