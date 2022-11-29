import DexieDB from './DexieDB';
import DexieDBProvider from './DexieDBProvider';
import { DexieMissionModel } from '@/models/Dexie/DexieMissionModel';
import { MissionModel } from '@/models/Mission/MissionModel';
import { MissionPlayerModel } from '@/models/Mission/MissionPlayerModel';
import { PlayerService, ProfileService, LoggerService } from './index';
import { DexieSteamPlayerProfileModel } from '@/models/Dexie/DexieSteamPlayerProfileModel';
import { SteamProfileNamesModel } from '@/models/Dexie/SteamProfileNamesModel';
import { MissionPlayerKillsModel } from '@/models/Mission/MissionPlayerKillsModel';
import { MissionPlayerTooltipsModel } from '@/models/Mission/MissionPlayerTooltipsModel';
import { MissionLogModel } from '@/models/Mission/MissionLogModel';
import { MissionPlayerTooltipModel } from '@/models/Mission/MissionPlayerTooltipModel';
import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';

const missionKey: string = 'ht_mission_uuid';

class MissionProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: MissionProvider;

  private lastUsedMissionUuid: string | undefined = undefined;
  private lastMission: DexieMissionModel | undefined = undefined;

  private dexieDB: DexieDB = DexieDBProvider.getInstance().dexieDB;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    if (localStorage) {
      this.lastUsedMissionUuid = localStorage.getItem(missionKey);
    }
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  // tslint:disable-next-line: member-ordering
  public static getInstance(): MissionProvider {
    if (!MissionProvider.instance || MissionProvider.instance === undefined) {
      MissionProvider.instance = new MissionProvider();
    }
    return MissionProvider.instance;
  }

  /**
   * Get all missions from dexie db
   */
  public async GetAllMissionsFromDexieDB(): Promise<DexieMissionModel[]> {
    return this.dexieDB.getTable<DexieMissionModel>(this.dexieDB!.getTables().missions).toArray();
  }

  /**
   * Add a new Mission
   * @param mission Mission
   */
  public async AddMission(mission: DexieMissionModel): Promise<number> {
    return this.dexieDB.add<DexieMissionModel>(this.dexieDB!.getTables().missions, mission);
  }

  /**
   * Put/Update a Mission
   * @param mission Mission
   */
  public async PutMission(mission: DexieMissionModel): Promise<number> {
    return this.dexieDB.put<DexieMissionModel>(this.dexieDB!.getTables().missions, mission);
  }

  /**
   * Put/Update a Mission
   * @param dataSet Mission
   */
  public async bulkPutMission(missions: DexieMissionModel[]): Promise<number> {
    return this.dexieDB.bulkPut<DexieMissionModel>(this.dexieDB!.getTables().missions, missions);
  }

  /**
   * Delete an Mission
   * @param mission Mission
   */
  public async DeleteMission(mission: DexieMissionModel): Promise<void> {
    return this.dexieDB.del<DexieMissionModel>(this.dexieDB!.getTables().missions, mission.id);
  }

  /**
   * Delete an Mission
   * @param mission Mission
   */
  public async UpdateMission(mission: DexieMissionModel): Promise<number> {
    return this.dexieDB.update<DexieMissionModel>(
      this.dexieDB!.getTables().missions,
      mission.id,
      mission,
    );
  }

  public get LastUsedMissionUuid(): string {
    return this.lastUsedMissionUuid;
  }

  public set LastUsedMissionUuid(missionUuid: string) {
    if (localStorage) {
      localStorage.setItem(missionKey, missionUuid);
      this.lastUsedMissionUuid = missionUuid;
    }
  }

  public FetchMissions(): Promise<DexieMissionModel[]> {
    return new Promise<DexieMissionModel[]>((resolve, reject) => {
      this.GetAllMissionsFromDexieDB()
        .then((missions) => {
          resolve(missions);
        })
        .catch((error) => reject(error));
    });
  }

  public FetchMissionByUuid(missionUuid: string): Promise<DexieMissionModel> {
    return new Promise<DexieMissionModel>((resolve, reject) => {
      this.GetAllMissionsFromDexieDB()
        .then((missions) => {
          const mission = missions.find((p) => p.uuid === missionUuid);
          if (mission) {
            resolve(new DexieMissionModel(mission));
          } else {
            reject(`could not find mission with uuid: ${missionUuid}`);
          }
        })
        .catch((error) => reject(error));
    });
  }

  public AddNewMission(inMission: MissionModel): Promise<DexieMissionModel> {
    return new Promise<DexieMissionModel>((resolve, reject) => {
      this.ProcessNewMission(inMission)
        .then((dexieMission) => {
          this.PutMission(dexieMission)
            .then(() => {
              this.LastUsedMissionUuid = dexieMission.uuid;
              resolve(dexieMission);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch((error) => reject(error));
    });
  }

  public AddUpdateMissionData(inMission: MissionModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.GetAllMissionsFromDexieDB()
        .then((missions) => {
          const oldMission = missions.find((p) => p.uuid === inMission.uuid);
          const newMissionData = new DexieMissionModel(inMission);
          if (oldMission) {
            newMissionData.id = oldMission.id;
            this.UpdateMission(newMissionData)
              .then((response) => {
                this.LastUsedMissionUuid = newMissionData.uuid;
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            this.PutMission(newMissionData)
              .then((response) => {
                this.LastUsedMissionUuid = newMissionData.uuid;
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public ProcessNewMission(inMission: MissionModel): Promise<DexieMissionModel> {
    return new Promise<DexieMissionModel>((resolve, reject) => {
      const savedPlayers: MissionPlayerModel[] = [];
      const notSavedPlayers: MissionPlayerModel[] = [];
      const dexieMission = new DexieMissionModel(inMission);
      dexieMission.uuid = crypto.randomUUID();
      dexieMission.playerProfileId = ProfileService.UserProfile.huntProfileId || 0;

      const missionLog: MissionLogModel[] = [];

      /**
       * Reorder teams that own team has index 0.
       * So we have the same team index as ingame overview
       */
      const orderedTeams = [
        ...inMission.Teams.filter((t) => t.ownteam),
        ...inMission.Teams.filter((t) => !t.ownteam),
      ];
      orderedTeams.forEach((team, index) => {
        team.teamId = index;
      });
      dexieMission.Teams = orderedTeams;

      dexieMission.Teams.forEach((missionTeam, teamIndex) =>
        missionTeam.players.forEach(async (missionTeamPlayer) => {
          await this.processPlayer(
            missionTeamPlayer,
            inMission.MissionFinishedDateTime,
            missionLog,
            teamIndex,
          )
            .then((response) => {
              savedPlayers.push(missionTeamPlayer);
              dexieMission.missionKills.append(response);
            })
            .catch((error) => {
              LoggerService.debug(error);
              notSavedPlayers.push(missionTeamPlayer);
            });
        }),
      );

      missionLog.sort((lhs, rhs) => {
        if (lhs.eventTime.getTime() < rhs.eventTime.getTime()) {
          return -1;
        } else if (lhs.eventTime.getTime() > rhs.eventTime.getTime()) {
          return 1;
        } else {
          return 0;
        }
      });

      dexieMission.missionLog = missionLog;

      dexieMission.Entries.forEach((entry) => {
        if (entry.category === 'accolade_players_killed_assist') {
          if (dexieMission.missionKills.assists == null) {
            dexieMission.missionKills.assists = 1;
          } else {
            dexieMission.missionKills.assists += 1;
          }
        }
      });

      LoggerService.debug(`missionLog: `, missionLog);
      LoggerService.debug(`missionKills: `, dexieMission.missionKills);

      resolve(dexieMission);

      if (dexieMission == null) {
        reject();
      }
    });
  }

  private async processPlayer(
    inMissionPlayer: MissionPlayerModel,
    missionDate: Date,
    inMissionLog: MissionLogModel[],
    inTeamIndex: number,
  ): Promise<MissionPlayerKillsModel> {
    return new Promise<MissionPlayerKillsModel>((resolve, reject) => {
      const playerTooltips = this.processPlayerTooltips(inMissionPlayer, missionDate);
      for (const key in playerTooltips) {
        if (Object.prototype.hasOwnProperty.call(playerTooltips, key)) {
          const tooltips = playerTooltips[key] as MissionPlayerTooltipModel[] | undefined;
          if (tooltips) {
            tooltips.forEach((tooltip) => {
              inMissionLog.push(
                new MissionLogModel({
                  playerTeamId: inTeamIndex,
                  playerProfileId: inMissionPlayer.profileid,
                  playerProfileName: inMissionPlayer.blood_line_name,
                  text: tooltip.text,
                  additionalText: tooltip.additionalText,
                  eventTime: tooltip.dateTime,
                  eventTimeString: tooltip.time.length <= 4 ? `0${tooltip.time}` : tooltip.time,
                  type: tooltip.type,
                  wasTeammate: tooltip.wasTeammate,
                }),
              );
            });
          }
        }
      }

      PlayerService.FetchPlayerByProfileId(inMissionPlayer.profileid)
        .then((dexiePlayer) => {
          /**
           * First check if player uses new profile name.
           * If not, just update last seen date,
           * else add new tracked profilename
           */
          if (dexiePlayer.profileName === inMissionPlayer.blood_line_name) {
            const name = dexiePlayer.otherProfileNames.find(
              (n) => n.profileName === inMissionPlayer.blood_line_name,
            );
            if (name) {
              name.lastSeen = missionDate;
            }
          } else {
            dexiePlayer.profileName = inMissionPlayer.blood_line_name;
            dexiePlayer.otherProfileNames.push(
              new SteamProfileNamesModel({
                created: missionDate,
                profileName: inMissionPlayer.blood_line_name,
                firstSeen: missionDate,
              }),
            );
          }
          /**
           * Update downed/killed counts
           */
          dexiePlayer.downedByTrackingPlayer += inMissionPlayer.downedbyme;
          dexiePlayer.downedByTrackingPlayerTeam += inMissionPlayer.downedbyteammate;
          dexiePlayer.downedTrackingPlayer += inMissionPlayer.downedme;
          dexiePlayer.downedTrackingPlayerTeam += inMissionPlayer.downedteammate;
          dexiePlayer.killedByTrackingPlayer += inMissionPlayer.killedbyme;
          dexiePlayer.killedByTrackingPlayerTeam += inMissionPlayer.killedbyteammate;
          dexiePlayer.killedTrackingPlayer += inMissionPlayer.killedme;
          dexiePlayer.killedTrackingPlayerTeam += inMissionPlayer.killedteammate;

          const kills = new MissionPlayerKillsModel({
            ownKills: inMissionPlayer.downedbyme + inMissionPlayer.killedbyme,
            teamKills: inMissionPlayer.downedbyteammate + inMissionPlayer.killedbyteammate,
            ownDeaths: inMissionPlayer.downedme + inMissionPlayer.killedme,
            teamDeaths: inMissionPlayer.downedteammate + inMissionPlayer.killedteammate,
          });

          PlayerService.AddUpdatePlayerData(dexiePlayer)
            .then(() => {
              resolve(kills);
            })
            .catch((error) => {
              reject(error);
            });
        })
        .catch(() => {
          /**
           * If user profile was not found, create a new one
           */
          const dexiePlayer = new DexieSteamPlayerProfileModel({
            firstSeen: missionDate,
            otherProfileNames: [
              new SteamProfileNamesModel({
                created: missionDate,
                profileName: inMissionPlayer.blood_line_name,
                firstSeen: missionDate,
              }),
            ],
            profileId: inMissionPlayer.profileid,
            profileName: inMissionPlayer.blood_line_name,
            uuid: crypto.randomUUID(),
            alreadyPlayedInTeam: inMissionPlayer.ispartner,
            isTrackingPlayer:
              inMissionPlayer.profileid === ProfileService.UserProfile.huntProfileId,
            downedByTrackingPlayer: inMissionPlayer.downedbyme,
            downedByTrackingPlayerTeam: inMissionPlayer.downedbyteammate,
            downedTrackingPlayer: inMissionPlayer.downedme,
            downedTrackingPlayerTeam: inMissionPlayer.downedteammate,
            killedByTrackingPlayer: inMissionPlayer.killedbyme,
            killedByTrackingPlayerTeam: inMissionPlayer.killedbyteammate,
            killedTrackingPlayer: inMissionPlayer.killedme,
            killedTrackingPlayerTeam: inMissionPlayer.killedteammate,
          });

          const kills = new MissionPlayerKillsModel({
            ownKills: inMissionPlayer.downedbyme + inMissionPlayer.killedbyme,
            teamKills: inMissionPlayer.downedbyteammate + inMissionPlayer.killedbyteammate,
            ownDeaths: inMissionPlayer.downedme + inMissionPlayer.killedme,
            teamDeaths: inMissionPlayer.downedteammate + inMissionPlayer.killedteammate,
          });

          PlayerService.AddUpdatePlayerData(dexiePlayer)
            .then(() => {
              resolve(kills);
            })
            .catch((error) => {
              reject(error);
            });
        });
    });
  }

  private processPlayerTooltips(
    inPlayer: MissionPlayerModel,
    inMissionDate: Date,
  ): MissionPlayerTooltipsModel {
    const tooltips = new MissionPlayerTooltipsModel();
    const missionDate = new Date(inMissionDate);
    missionDate.setMilliseconds(0);
    missionDate.setSeconds(0);

    for (const key in inPlayer) {
      if (Object.prototype.hasOwnProperty.call(inPlayer, key) && key.includes('tooltip')) {
        const tooltipToParse = inPlayer[key] as string;
        if (tooltipToParse.length > 0) {
          const tooltipsParsed = this.processPlayerTooltip(tooltipToParse, missionDate, key);
          if (tooltipsParsed.length > 0) {
            tooltips[key] = tooltipsParsed;
          }
        }
      }
    }

    return tooltips;
  }

  private processPlayerTooltip(
    inTooltip: string,
    inMissionDate: Date,
    key: string,
  ): MissionPlayerTooltipModel[] {
    const tooltips: MissionPlayerTooltipModel[] = [];
    const parts = inTooltip.split('~');

    const getTimes = (inTime: string): Date => {
      const dateTime = new Date(inMissionDate);
      const timeParts = inTime.split(':');
      dateTime.setMinutes(dateTime.getMinutes() + parseInt(timeParts[0], 10));
      dateTime.setSeconds(dateTime.getSeconds() + parseInt(timeParts[1], 10));

      return dateTime;
    };
    try {
      if (key === 'tooltipbountyextracted') {
        for (let index = 0; index < parts.length; index += 2) {
          if (parts[index].includes('extracted')) {
            tooltips.push(
              new MissionPlayerTooltipModel({
                additionalText: '',
                text: parts[index],
                time: parts[index + 1],
                dateTime: getTimes(parts[index + 1]),
                wasTeammate: key.includes('team'),
                type: this.getTooltipType(key),
              }),
            );
          }
        }
      } else if (key === 'tooltipbountypickedup') {
        for (let index = 0; index < parts.length; index += 2) {
          tooltips.push(
            new MissionPlayerTooltipModel({
              additionalText: '',
              text: parts[index],
              time: parts[index + 1],
              dateTime: getTimes(parts[index + 1]),
              wasTeammate: key.includes('team'),
              type: this.getTooltipType(key),
            }),
          );
        }
      } else {
        for (let index = 0; index < parts.length; index += 4) {
          tooltips.push(
            new MissionPlayerTooltipModel({
              additionalText: parts[index],
              text: parts[index + 2],
              time: parts[index + 3],
              dateTime: getTimes(parts[index + 3]),
              wasTeammate: key.includes('team'),
              type: this.getTooltipType(key),
            }),
          );
        }
      }
    } catch (error) {
      LoggerService.error(`Error on parse tooltip: `, error);
    }
    return tooltips;
  }

  private getTooltipType(inKey: string): MissionLogTypeEnum {
    let tooltipType = MissionLogTypeEnum.Unknown;
    switch (inKey) {
      case 'tooltipbountyextracted':
        tooltipType = MissionLogTypeEnum.BountyExtracted;
        break;
      case 'tooltipbountypickedup':
        tooltipType = MissionLogTypeEnum.BountyPickedUp;
        break;
      case 'tooltip_downedbyteammate':
        tooltipType = MissionLogTypeEnum.DownedByTeammate;
        break;
      case 'tooltipdownedbyme':
        tooltipType = MissionLogTypeEnum.DownedByMe;
        break;
      case 'tooltipdownedme':
        tooltipType = MissionLogTypeEnum.DownedMe;
        break;
      case 'tooltipdownedteammate':
        tooltipType = MissionLogTypeEnum.DownedTeammate;
        break;
      case 'tooltipkilledbyme':
        tooltipType = MissionLogTypeEnum.KilledByMe;
        break;
      case 'tooltipkilledbyteammate':
        tooltipType = MissionLogTypeEnum.KilledByTeammate;
        break;
      case 'tooltipkilledme':
        tooltipType = MissionLogTypeEnum.KilledMe;
        break;
      case 'tooltipkilledteammate':
        tooltipType = MissionLogTypeEnum.KilledTeammate;
        break;

      default:
        break;
    }

    return tooltipType;
  }
}

export default MissionProvider;
