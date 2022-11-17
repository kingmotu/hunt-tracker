import { IMissionModel, MissionModel } from '@/models/Mission/MissionModel';
import {
  IMissionPlayerKillsModel,
  MissionPlayerKillsModel,
} from '@/models/Mission/MissionPlayerKillsModel';
export interface IDexieMissionModel extends IMissionModel {
  id?: number;
  missionKills: IMissionPlayerKillsModel;
}

export class DexieMissionModel extends MissionModel implements IDexieMissionModel {
  public id?: number;
  public missionKills: MissionPlayerKillsModel;

  constructor();
  constructor(obj: IDexieMissionModel);
  constructor(obj: MissionModel);
  constructor(obj?: any) {
    super(obj);
    this.id = obj && obj.id != null ? obj.id : undefined;
    this.missionKills = (obj && obj.missionKills) || new MissionPlayerKillsModel();
  }
}
