import { IMissionModel, MissionModel } from '@/models/Mission/MissionModel';
import { MissionLogModel } from '@/models/Mission/MissionLogModel';
import {
  IMissionPlayerKillsModel,
  MissionPlayerKillsModel,
} from '@/models/Mission/MissionPlayerKillsModel';

export interface IDexieMissionModel extends IMissionModel {
  id?: number;
  missionKills: IMissionPlayerKillsModel;
  missionLog: MissionLogModel[];
}

export class DexieMissionModel extends MissionModel implements IDexieMissionModel {
  public id?: number;
  public missionKills: MissionPlayerKillsModel;
  public missionLog: MissionLogModel[];

  constructor();
  constructor(obj: IDexieMissionModel);
  constructor(obj: MissionModel);
  constructor(obj?: any) {
    super(obj);
    this.id = obj && obj.id != null ? obj.id : undefined;

    this.missionLog = [];
    if (obj) {
      if (obj.missionKills) {
        this.missionKills = new MissionPlayerKillsModel(obj.missionKills);
      } else {
        this.missionKills = new MissionPlayerKillsModel();
      }
      if (obj.missionLog) {
        obj.missionLog.forEach((mlitem) => {
          this.missionLog.push(new MissionLogModel(mlitem));
        });
      }
    }
  }
}
