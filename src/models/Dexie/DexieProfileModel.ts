import { DexieBaseModel, IDexieBaseModel } from './DexieBaseModel';

export interface IDexieProfileModel extends IDexieBaseModel {
  uuid: string;
  steamId?: number;
  steamLoginName: string;
  steamLastGameName: string;
  huntProfileId?: number;
  settingsUuid: string;
  avatar?: string;
}

export class DexieProfileModel extends DexieBaseModel implements IDexieProfileModel {
  public uuid: string;
  public steamId?: number;
  public steamLoginName: string;
  public steamLastGameName: string;
  public huntProfileId?: number;
  public settingsUuid: string;
  public avatar?: string;

  constructor();
  constructor(obj: IDexieProfileModel);
  constructor(obj?: any) {
    super(obj);
    this.uuid = (obj && obj.uuid) || '';
    this.steamId = obj && obj.steamId ? obj.steamId : undefined;
    this.steamLoginName = (obj && obj.steamLoginName) || '';
    this.steamLastGameName = (obj && obj.steamLastGameName) || '';
    this.huntProfileId = obj && obj.huntProfileId ? obj.huntProfileId : undefined;
    this.settingsUuid = (obj && obj.settingsUuid) || '';
    this.avatar = obj && obj.avatar ? obj.avatar : 'default';
  }
}
