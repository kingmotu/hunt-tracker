import { defineComponent } from 'vue';
import { SteamService, LoggerService, AttributesXmlService } from '@/services/index';
import * as fs from 'fs/promises';

const chokidar = require('chokidar');
const xml2js = require('xml2js');

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
    SteamService.ReadSteamInfos().then(() => {
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
      fs.readFile(SteamService.HuntAttributesXmlPath)
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
