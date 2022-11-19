import { MissionModel } from '@/models/Mission/MissionModel';
import { XmlEntrieModel } from '@/models/Xml/XmlEntrieModel';
import { LoggerService } from '.';
import { MissionTeamModel } from '@/models/Mission/MissionTeamModel';
import { MissionPlayerModel } from '@/models/Mission/MissionPlayerModel';
import { MissionBagEntryModel } from '../models/Mission/MissionBagEntryModel';
import { MissionAccoladeEntryModel } from '../models/Mission/MissionAccoladeEntryModel';

import { FSWatcher } from 'chokidar';
import * as fsPromise from 'fs/promises';
import * as fs from 'fs';
import { MissionBagBossesModel } from '../models/Mission/MissionBagBossesModel';
import { MapTypeEnum } from '@/enums/MapTypeEnum';
import { ILiteEvent, LiteEvent } from '../liteEvent/liteEvent';

const chokidar = require('chokidar');
const xml2js = require('xml2js');
const nodeCrypto = require('crypto');

class AttributesXmlProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: AttributesXmlProvider;

  private readonly attributesXmlVersion: number = 37;

  private readonly onAttributesXmlChanged = new LiteEvent<MissionModel>();

  private fileWatcher: FSWatcher = null;

  private lastMissionLog: MissionModel | undefined = undefined;

  private players: XmlEntrieModel[][][] = [[[]]];
  private accolades: XmlEntrieModel[][] = [[]];
  private entries: XmlEntrieModel[][] = [[]];
  private teams: XmlEntrieModel[][] = [[]];
  private mission: XmlEntrieModel[] = [];
  private bosses: XmlEntrieModel[] = [];
  private MissionBagTeamDetailsVersion: number = 0;
  private PVEModeLastSelected: string = '';
  private lastChecksum: string = '';

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): AttributesXmlProvider {
    if (!AttributesXmlProvider.instance) {
      AttributesXmlProvider.instance = new AttributesXmlProvider();
    }

    return AttributesXmlProvider.instance;
  }

  public get LastMissionLog(): MissionModel | undefined {
    return this.lastMissionLog;
  }

  public get OnAttributesXmlChanged(): ILiteEvent<MissionModel> {
    return this.onAttributesXmlChanged.expose();
  }

  public get GetIsWatching(): boolean {
    return this.fileWatcher != null && Object.keys(this.fileWatcher.getWatched()).length > 0;
  }

  public test(path: string): void {
    LoggerService.debug(`Checksum: `, this.getChecksum(path));
  }

  public StartWatchAttributesXml(inPath: string): void {
    if (this.fileWatcher == null) {
      this.fileWatcher = chokidar.watch(inPath, { interval: 2000 });
      LoggerService.debug(`watcher created for path: ${inPath}`);
    }
    if (Object.keys(this.fileWatcher.getWatched()).length === 0) {
      this.fileWatcher.on('change', (path, stats) => {
        this.getChecksum(path)
          .then((checksum) => {
            if (checksum !== this.lastChecksum) {
              this.lastChecksum = checksum;
              this.ReadXmlFile(path, checksum)
                .then(() => {
                  LoggerService.debug(
                    `xml file opened and parsed, new checksum: ${this.lastChecksum}`,
                  );
                  this.onAttributesXmlChanged.trigger(this.LastMissionLog);
                })
                .catch((error) => {
                  LoggerService.error(`error on open/parse file: `, error);
                });
            }
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      });
      LoggerService.debug(`start listening for file change events`, this.fileWatcher.getWatched());
    } else {
      LoggerService.info(`already watching attributes.xml: `, this.fileWatcher.getWatched());
    }
  }

  public StopWatchAttributesXml(): void {
    if (this.fileWatcher != null) {
      this.fileWatcher
        .close()
        .then(() => LoggerService.info(`watcher closed: `, this.fileWatcher.getWatched()))
        .catch((error) => LoggerService.error(error));
    } else {
      LoggerService.debug(`no open watcher set`);
    }
  }

  public ReadXmlFile(inPath: string, inCheckSum?: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const readFile = (inPath: string, checkSum?: string) => {
        if (this.checkFileAccess(inPath)) {
          fsPromise
            .copyFile(
              inPath,
              `D:\\Eigene Dateien\\Hunt\\dev-logs\\${new Date()
                .toISOString()
                .replaceAll(':', '_')}.xml`,
            )
            .then(() => {
              fsPromise
                .readFile(inPath)
                .then((fileContent) => {
                  this.parseXmlValues(fileContent, checkSum)
                    .then(() => {
                      resolve();
                    })
                    .catch((error) => {
                      reject(error);
                    });
                })
                .catch((error) => {
                  reject(error);
                });
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject('file is not accessible');
        }
      };

      if (inCheckSum) {
        readFile(inPath, inCheckSum);
      }
      this.getChecksum(inPath)
        .then((checksum) => {
          readFile(inPath, checksum);
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private parseXmlValues(inFileContent: Buffer, inCheckSum: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const parser = new xml2js.Parser();
      parser
        .parseStringPromise(inFileContent)
        .then((xml: any) => {
          this.players = [[[]]];
          this.accolades = [[]];
          this.entries = [[]];
          this.teams = [[]];
          this.bosses = [];
          this.mission = [];
          this.MissionBagTeamDetailsVersion = 0;
          this.PVEModeLastSelected = '';

          if (
            xml.Attributes.$.Version &&
            parseInt(xml.Attributes.$.Version, 10) > this.attributesXmlVersion
          ) {
            // TODO: trigger warning for version missmatch
          }

          if (xml.Attributes.Attr) {
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
                  if (!this.players[keyParts[1]]) {
                    this.players[keyParts[1]] = [];
                  }
                  if (!this.players[keyParts[1]][keyParts[2]]) {
                    this.players[keyParts[1]][keyParts[2]] = [];
                  }
                  this.players[keyParts[1]][keyParts[2]].push({ name: keyName, value: value });
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/MissionAccoladeEntry_[0-9]+/) >= 0 && value) {
                /**
                 * Parse MissionAccoladeEntries from xml
                 */
                const keyParts = key.split('_');
                const keyName = keyParts.slice(2, keyParts.length).join('_');
                try {
                  if (!this.accolades[keyParts[1]]) {
                    this.accolades[keyParts[1]] = [];
                  }
                  this.accolades[keyParts[1]].push({
                    name: keyName === '' ? 'value' : keyName,
                    value: value,
                  });
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/MissionBagEntry_[0-9]+/) >= 0 && value) {
                /**
                 * Parse MissionBagEntries from xml
                 */
                const keyParts = key.split('_');
                const keyName = keyParts.slice(2, keyParts.length).join('_');
                try {
                  if (!this.entries[keyParts[1]]) {
                    this.entries[keyParts[1]] = [];
                  }
                  this.entries[keyParts[1]].push({
                    name: keyName === '' ? 'value' : keyName,
                    value: value,
                  });
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/MissionBagTeam_[0-9]+/) >= 0 && value) {
                /**
                 * Parse teams from xml
                 */
                const keyParts = key.split('_');
                const keyName = keyParts.slice(2, keyParts.length).join('_');
                try {
                  if (!this.teams[keyParts[1]]) {
                    this.teams[keyParts[1]] = [];
                  }
                  this.teams[keyParts[1]].push({
                    name: keyName === '' ? 'value' : keyName,
                    value: value,
                  });
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/MissionBagBoss_[0-9]+/) >= 0 && value) {
                /**
                 * Parse bosses from xml
                 */
                const keyParts = key.split('_');
                /**
                 * We need to change this name since
                 */
                //keyParts[1] = keyParts[1] === '-1' ? '4' : keyParts[1];
                const keyName = keyParts.slice(0, keyParts.length).join('_');
                try {
                  this.bosses[keyParts[1]] = {
                    name: keyName === '' ? 'value' : keyName,
                    value: value,
                  };
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/MissionBagTeamDetailsVersion/) >= 0 && value) {
                /**
                 * Parse mission info from xml
                 */
                try {
                  this.MissionBagTeamDetailsVersion = parseInt(value, 10);
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.match(/PVEModeLastSelected(?!(\/))/) != null && value) {
                /**
                 * Parse map info from xml
                 */
                try {
                  const valueParts = (value as string).split('/');
                  this.PVEModeLastSelected = valueParts[0];
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/MissionBag(?!(Entry|Player|Boss|Team))/) >= 0 && value) {
                /**
                 * Parse mission info from xml
                 */
                try {
                  this.mission.push({ name: key, value: value });
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              } else if (key?.search(/TimeMissionUnload/) >= 0 && value) {
                /**
                 * Parse mission info from xml
                 */
                try {
                  // this.mission.push({ name: key, value: value });
                  // just check for  map change?
                  LoggerService.debug(`################# ${key}: ${value}`);
                } catch (error) {
                  LoggerService.error(error);
                  reject(error);
                }
              }
            }
          } else {
            // TODO: trigger warming for empty Attr
            reject(`XML file seems to not contain any events`);
          }

          this.createModelsFromParsedData(inCheckSum)
            .then(() => {
              LoggerService.debug('MissionModel: ', this.lastMissionLog);
              resolve();
            })
            .catch((error) => reject(error));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private createModelsFromParsedData(inCheckSum: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        const now = new Date();
        this.lastMissionLog = new MissionModel();
        this.lastMissionLog.uuid = crypto ? crypto.randomUUID() : now.toISOString();
        this.lastMissionLog.MissionFinishedDateTime = now;
        this.lastMissionLog.xmlChecksum = inCheckSum;
        /**
         * Set mission settings
         */
        for (const key in this.lastMissionLog) {
          if (Object.prototype.hasOwnProperty.call(this.lastMissionLog, key)) {
            const item = this.mission.find((item) => item.name === key);
            // LoggerService.debug(`[${key}]: ${typeof this.lastMissionLog[key]}`);
            if (item && item.value) {
              switch (typeof this.lastMissionLog[key]) {
                case 'boolean':
                  this.lastMissionLog[key] = item.value === 'true' ? true : false;
                  break;
                case 'number':
                  this.lastMissionLog[key] = parseInt(item.value, 10);
                  break;
                default:
                  this.lastMissionLog[key] = item.value;
                  break;
              }
            }
          }
        }

        /**
         * Get bosses
         */
        this.lastMissionLog.Bosses = this.getBosses(this.bosses);

        /**
         * Get team details version
         */
        this.lastMissionLog.MissionBagTeamDetailsVersion = this.MissionBagTeamDetailsVersion;

        /**
         * Get map typ
         */
        this.lastMissionLog.PVEModeLastSelected = this.getMapType(this.PVEModeLastSelected);

        /**
         * Set teams by slice the number of teams
         */
        this.lastMissionLog.Teams = this.getTeams(
          this.teams.slice(0, this.lastMissionLog.MissionBagNumTeams),
        );

        /**
         * Set team players by slicing parsed players by number of teams
         */
        this.setTeamPlayers(
          this.lastMissionLog.Teams,
          this.players.slice(0, this.lastMissionLog.MissionBagNumTeams),
        );

        /**
         * Get entries for mission slicing parsed players by number of entries
         */
        this.lastMissionLog.Entries = this.getEntries(
          this.entries.slice(0, this.lastMissionLog.MissionBagNumEntries),
        );

        /**
         * Get accolades for mission slicing parsed players by number of accolades
         */
        this.lastMissionLog.Accolades = this.getAccolades(
          this.accolades.slice(0, this.lastMissionLog.MissionBagNumAccolades),
        );

        resolve();
      } catch (error) {
        reject(error);
      }
    });
  }

  private getTeams(inTeams: XmlEntrieModel[][]): MissionTeamModel[] {
    const teams: MissionTeamModel[] = [];
    inTeams.forEach((team, index) => {
      const newTeam = new MissionTeamModel();
      newTeam.teamId = index;

      for (const key in newTeam) {
        if (Object.prototype.hasOwnProperty.call(newTeam, key)) {
          const item = team.find((item) => item.name === key);
          if (item && item.value) {
            switch (typeof newTeam[key]) {
              case 'boolean':
                newTeam[key] = item.value === 'true' ? true : false;
                break;
              case 'number':
                newTeam[key] = parseInt(item.value, 10);
                break;
              default:
                newTeam[key] = item.value;
                break;
            }
          }
        }
      }
      teams.push(newTeam);
    });

    return teams;
  }

  private setTeamPlayers(inTeams: MissionTeamModel[], inPlayers: XmlEntrieModel[][][]): void {
    inTeams.forEach((team, teamIndex) => {
      team.players = [];
      for (let playerIndex = 0; playerIndex < team.numplayers; playerIndex++) {
        const playerModel = new MissionPlayerModel();
        const player = inPlayers[teamIndex][playerIndex];
        playerModel.teamPlayerId = playerIndex;
        for (const key in playerModel) {
          if (Object.prototype.hasOwnProperty.call(playerModel, key)) {
            // inPlayers[teamIndex][playerIndex]
            const item = player.find((item) => item.name === key);
            if (item && item.value) {
              switch (typeof playerModel[key]) {
                case 'boolean':
                  playerModel[key] = item.value === 'true' ? true : false;
                  break;
                case 'number':
                  playerModel[key] = parseInt(item.value, 10);
                  break;
                default:
                  playerModel[key] = item.value;
                  break;
              }
            }
          }
        }
        team.players.push(playerModel);
      }
    });
  }

  private getEntries(inEntries: XmlEntrieModel[][]): MissionBagEntryModel[] {
    const entries: MissionBagEntryModel[] = [];
    inEntries.forEach((entry, index) => {
      const newEntry = new MissionBagEntryModel();
      newEntry.entryId = index;

      for (const key in newEntry) {
        if (Object.prototype.hasOwnProperty.call(newEntry, key)) {
          const item = entry.find((item) => item.name === key);
          if (item && item.value) {
            switch (typeof newEntry[key]) {
              case 'boolean':
                newEntry[key] = item.value === 'true' ? true : false;
                break;
              case 'number':
                newEntry[key] = parseInt(item.value, 10);
                break;
              default:
                newEntry[key] = item.value;
                break;
            }
          }
        }
      }
      entries.push(newEntry);
    });

    return entries;
  }

  private getAccolades(inAccolades: XmlEntrieModel[][]): MissionAccoladeEntryModel[] {
    const accolades: MissionAccoladeEntryModel[] = [];
    inAccolades.forEach((entry, index) => {
      const newAccolade = new MissionAccoladeEntryModel();
      newAccolade.accoladeId = index;

      for (const key in newAccolade) {
        if (Object.prototype.hasOwnProperty.call(newAccolade, key)) {
          const item = entry.find((item) => item.name === key);
          if (item && item.value) {
            switch (typeof newAccolade[key]) {
              case 'boolean':
                newAccolade[key] = item.value === 'true' ? true : false;
                break;
              case 'number':
                newAccolade[key] = parseInt(item.value, 10);
                break;
              default:
                newAccolade[key] = item.value;
                break;
            }
          }
        }
      }
      accolades.push(newAccolade);
    });

    return accolades;
  }

  private getBosses(inBosses: XmlEntrieModel[]): MissionBagBossesModel {
    const newBosses = new MissionBagBossesModel();

    for (const key in newBosses) {
      if (Object.prototype.hasOwnProperty.call(newBosses, key)) {
        const item = inBosses.find((item) => item.name === key);
        if (item && item.value) {
          switch (typeof newBosses[key]) {
            case 'boolean':
              newBosses[key] = item.value === 'true' ? true : false;
              break;
            case 'number':
              newBosses[key] = parseInt(item.value, 10);
              break;
            default:
              newBosses[key] = item.value;
              break;
          }
        }
      }
    }

    return newBosses;
  }

  private getMapType(inMapType: string): MapTypeEnum {
    let mapType = MapTypeEnum.Unknown;

    switch (inMapType) {
      case 'civilwar':
        mapType = MapTypeEnum.Lawson_Delta;
        break;
      case 'cemetery':
        mapType = MapTypeEnum.Stillwater_Bayou;
        break;
      case 'creek':
        mapType = MapTypeEnum.DeSalle;
        break;

      default:
        break;
    }

    return mapType;
  }

  private getChecksum(path: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      // if absolutely necessary, use md5
      const hash = nodeCrypto.createHash('sha512');
      hash.on('error', (error) => reject(error)).setEncoding('base64');

      if (this.checkFileAccess(path)) {
        const input = fs.createReadStream(path);
        input.on('error', reject);
        input
          .on('end', () => {
            hash.end();
            const newHash = hash.read();
            resolve(newHash);
          })
          .pipe(hash, {
            end: false,
          });
      } else {
        reject('file is not accessible');
      }
    });
  }

  /**
   * Method to check if file is readable
   * @param filePath
   * @returns
   */
  private checkFileAccess(filePath: string): boolean {
    let isReadable = false;
    try {
      fs.accessSync(filePath, fs.constants.R_OK);
      isReadable = true;
    } catch (error) {
      LoggerService.error(`${filePath} is not accessible!`, error);
    }
    return isReadable;
  }
}
export default AttributesXmlProvider;
