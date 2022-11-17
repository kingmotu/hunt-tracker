import DexieDB from './DexieDB';
import DexieDBProvider from './DexieDBProvider';
import { DexieMissionModel } from '@/models/Dexie/DexieMissionModel';
import { MissionModel } from '@/models/Mission/MissionModel';
import { MissionPlayerModel } from '@/models/Mission/MissionPlayerModel';
import { PlayerService, ProfileService, LoggerService } from './index';
import { DexieSteamPlayerProfileModel } from '@/models/Dexie/DexieSteamPlayerProfileModel';
import { SteamProfileNamesModel } from '../models/Dexie/SteamProfileNamesModel';
import { MissionPlayerKillsModel } from '@/models/Mission/MissionPlayerKillsModel';

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
            resolve(mission);
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

      inMission.Teams.forEach((missionTeam) =>
        missionTeam.players.forEach(async (missionTeamPlayer) => {
          await this.processPlayers(missionTeamPlayer, inMission.MissionFinishedDateTime)
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
      LoggerService.debug(`saved players: `, savedPlayers);
      LoggerService.debug(`not saved players: `, notSavedPlayers);
      resolve(dexieMission);
    });
  }

  private async processPlayers(
    inMissionPlayer: MissionPlayerModel,
    missionDate: Date,
  ): Promise<MissionPlayerKillsModel> {
    return new Promise<MissionPlayerKillsModel>((resolve, reject) => {
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
           * If user profile was not founf, create a new one
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
}

export default MissionProvider;
