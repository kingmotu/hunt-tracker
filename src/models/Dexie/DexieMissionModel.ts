import { IMissionModel, MissionModel } from '../Mission/MissionModel';
export interface IDexieMissionModel extends IMissionModel {
  id?: number;
}

export class DexieMissionModel extends MissionModel implements IDexieMissionModel {
  public id?: number;

  constructor();
  constructor(obj: IDexieMissionModel);
  constructor(obj?: any) {
    super(obj);
    this.id = obj && obj.id != null ? obj.id : undefined;
  }
}
