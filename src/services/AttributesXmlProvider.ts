import { MissionModel } from '@/models/Mission/MissionModel';
import { XmlEntrieModel } from '@/models/Xml/XmlEntrieModel';
import { FSWatcher } from 'chokidar';
import * as fs from 'fs/promises';
import { LoggerService } from '.';
import { MissionTeamModel } from '@/models/Mission/MissionTeamModel';
import { MissionPlayerModel } from '@/models/Mission/MissionPlayerModel';
import { MissionBagEntryModel } from '../models/Mission/MissionBagEntryModel';
import { MissionAccoladeEntryModel } from '../models/Mission/MissionAccoladeEntryModel';

const chokidar = require('chokidar');
const xml2js = require('xml2js');

class AttributesXmlProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: AttributesXmlProvider;

  private readonly attributesXmlVersion: number = 37;

  private fileWatcher: FSWatcher = null;

  private lastMissionLog: MissionModel | undefined = undefined;

  private players: XmlEntrieModel[][][] = [[[]]];
  private accolades: XmlEntrieModel[][] = [[]];
  private entries: XmlEntrieModel[][] = [[]];
  private teams: XmlEntrieModel[][] = [[]];
  private mission: XmlEntrieModel[] = [];

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

  // public get SteamPath(): string {
  //   return this.steamPath;
  // }

  public StartWatchAttributesXml(inPath: string): void {
    if (this.fileWatcher == null) {
      this.fileWatcher = chokidar.watch(inPath, { interval: 2000 });
      LoggerService.debug(`watcher created`);
    }
    LoggerService.debug(`start listening for file change events`);
    this.fileWatcher.on('change', (path, stats) => {
      if (stats && stats.size > 0) {
        LoggerService.debug(`read new xml file`);
        fs.readFile(inPath)
          .then((fileContent) => {
            this.parseXmlValues(fileContent);
          })
          .catch((error) => {
            console.error(`error on open file: `, error);
          });
      }
    });
  }

  public StopWatchAttributesXml(): void {
    if (this.fileWatcher != null) {
      this.fileWatcher
        .close()
        .then(() => LoggerService.info(`watcher closed`))
        .catch((error) => LoggerService.error(error));
    } else {
      LoggerService.debug(`no open watcher set`);
    }
  }

  public parseXmlValues(inFileContent: Buffer): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const parser = new xml2js.Parser();
      parser
        .parseStringPromise(inFileContent)
        .then((xml: any) => {
          LoggerService.debug(`parsed xml: `, xml);
          this.players = [[[]]];
          this.accolades = [[]];
          this.entries = [[]];
          this.teams = [[]];
          this.mission = [];

          if (
            xml.Attributes.$.Version &&
            parseInt(xml.Attributes.$.Version) > this.attributesXmlVersion
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
              }
            }
          } else {
            // TODO: trigger warming for empty Attr
            reject(`XML file seems to not contain any events`);
          }

          this.createModelsFromParsedData()
            .then(() => {
              LoggerService.debug('MissionModel: ', this.lastMissionLog);
              resolve();
            })
            .catch((error) => reject(error));
        })
        .catch((error) => {
          LoggerService.debug(`xml2js error: `, error);
          reject(error);
        });
    });
  }

  private createModelsFromParsedData(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      try {
        this.lastMissionLog = new MissionModel();
        this.lastMissionLog.Id = crypto ? crypto.randomUUID() : new Date().toISOString();
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
         * Check for Bounty or QuickPlay
         */
        if (this.lastMissionLog.MissionBagIsQuickPlay === true) {
          // If we have a qucik play game, each team has only one player
        } else {
          // normal bounty game
        }

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
      team.palyers = [];
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
        team.palyers.push(playerModel);
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
}

export default AttributesXmlProvider;
