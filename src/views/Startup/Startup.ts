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

      this.fileWatcher = chokidar
        .watch(SteamService.HuntAttributesXmlPath, {
          interval: 2000,
        })
        .on('change', (path, stats) => {
          if (stats && stats.size > 0) {
            LoggerService.debug(`File ${path} changed size to ${stats.size}`);

            fs.readFile(SteamService.HuntAttributesXmlPath, { encoding: 'utf8' })
              .then((file) => {
                const parser = new xml2js.Parser();
                parser
                  .parseStringPromise(file)
                  .then((xml) => {
                    LoggerService.debug(`parsed xml: `, xml);
                  })
                  .catch((error) => {
                    LoggerService.debug(`xml2js error: `, error);
                  });
              })
              .catch((error) => {
                console.error(`error on open file: `, error);
              });
          }
        });
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
