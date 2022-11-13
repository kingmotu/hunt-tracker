import { defineComponent } from 'vue';
import { SteamService, LoggerService } from '@/services/index';
import * as fs from 'fs/promises';
import { HuntUserEventModel } from '../../models/MissionPlayerModel';

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
              const accolades: { name: string; value: string | number | boolean }[][] = [[]];
              const entries: { name: string; value: string | number | boolean }[][] = [[]];
              const teams: { name: string; value: string | number | boolean }[][] = [[]];
              const mission: { name: string; value: string | number | boolean }[] = [];
              for (const iterator of xml.Attributes.Attr) {
                const key = iterator.$.name as string;
                const value = iterator.$.value;

                if (key?.search(/MissionBagPlayer_[0-9]+_[0-9]+_/) >= 0 && value) {
                  /**
                   * Parse players from xml
                   */
                  const keyParts = key.split('_');
                  const keyName = keyParts.slice(3, keyParts.length).join('_');
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
                } else if (key?.search(/MissionAccoladeEntry_[0-9]+_/) >= 0 && value) {
                  /**
                   * Parse MissionAccoladeEntries from xml
                   */
                  const keyParts = key.split('_');
                  const keyName = keyParts.slice(2, keyParts.length).join('_');
                  try {
                    if (!accolades[keyParts[1]]) {
                      accolades[keyParts[1]] = [];
                    }
                    accolades[keyParts[1]].push({ name: keyName, value: value });
                  } catch (error) {
                    LoggerService.error(error);
                  }
                } else if (key?.search(/MissionBagEntry_[0-9]+_/) >= 0 && value) {
                  /**
                   * Parse MissionBagEntries from xml
                   */
                  const keyParts = key.split('_');
                  const keyName = keyParts.slice(2, keyParts.length).join('_');
                  try {
                    if (!entries[keyParts[1]]) {
                      entries[keyParts[1]] = [];
                    }
                    entries[keyParts[1]].push({ name: keyName, value: value });
                  } catch (error) {
                    LoggerService.error(error);
                  }
                } else if (key?.search(/MissionBagTeam_[0-9]+_/) >= 0 && value) {
                  /**
                   * Parse teams from xml
                   */
                  const keyParts = key.split('_');
                  const keyName = keyParts.slice(2, keyParts.length).join('_');
                  try {
                    if (!teams[keyParts[1]]) {
                      teams[keyParts[1]] = [];
                    }
                    teams[keyParts[1]].push({ name: keyName, value: value });
                  } catch (error) {
                    LoggerService.error(error);
                  }
                } else if (key?.search(/MissionBag(?!(Entry|Player|Boss|Team))/) >= 0 && value) {
                  /**
                   * Parse mission info from xml
                   */
                  try {
                    mission.push({ name: key, value: value });
                  } catch (error) {
                    LoggerService.error(error);
                  }
                }
              }

              LoggerService.debug(`players: `, players);
              LoggerService.debug(`accolades: `, accolades);
              LoggerService.debug(`entries: `, entries);
              LoggerService.debug(`teams: `, teams);
              LoggerService.debug(`mission: `, mission);
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
