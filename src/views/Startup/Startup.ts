import { defineComponent } from 'vue';
import { SteamService, LoggerService } from '@/services/index';
import * as fs from 'fs/promises';
import { HuntUserEventModel } from '../../models/HuntUserEventModel';

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
    eventPlayersData: new Array<HuntUserEventModel>(),
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
    test() {
      fs.readFile(SteamService.HuntAttributesXmlPath)
        .then((file) => {
          const parser = new xml2js.Parser();
          parser
            .parseStringPromise(file)
            .then((xml) => {
              LoggerService.debug(`parsed xml: `, xml);
              const players: { name: string; value: string | number | boolean }[][][] = [[[]]];
              // const players: Map<
              //   number,
              //   Array<{ name: string; value: string | number | boolean }>
              // > = new Map<number, Array<{ name: string; value: string | number | boolean }>>();
              for (const iterator of xml.Attributes.Attr) {
                const key = iterator.$.name as string;
                const value = iterator.$.value;

                if (key?.search(/MissionBagPlayer_[0-9]+_[0-9]+_/) >= 0 && value) {
                  const keyParts = key.split('_');
                  const keyName = keyParts.slice(3, keyParts.length).join('_');
                  //players[keyParts[1]][keyParts[2]].push({ name: keyName, value: value });
                  try {
                    if (!players[keyParts[1]]) {
                      players[keyParts[1]] = [];
                    }
                    if (!players[keyParts[1]][keyParts[2]]) {
                      players[keyParts[1]][keyParts[2]] = [];
                    }
                    players[keyParts[1]][keyParts[2]].push({ name: keyName, value: value });
                  } catch (error) {
                    LoggerService.error(error);
                  }
                }
              }

              LoggerService.debug(`players: `, players);
            })
            .catch((error) => {
              LoggerService.debug(`xml2js error: `, error);
            });
        })
        .catch((error) => {
          console.error(`error on open file: `, error);
        });
    },
  },
  computed: {},
});
