import { IMissionModel, MissionModel } from '@/models/Mission/MissionModel';
import { MissionLogModel } from '../Mission/MissionLogModel';
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
    this.missionKills = (obj && obj.missionKills) || new MissionPlayerKillsModel();
    this.missionLog = (obj && obj.missionLog) || [];
  }
}
