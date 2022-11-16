import { DexieBaseModel, IDexieBaseModel } from './DexieBaseModel';

export interface IDexieSettingsModel extends IDexieBaseModel {
  uuid: string;
  steamPath: string;
  steamUserName: string;
  steamProfileName: string;
  steamUserId?: number;
  huntPath: string;
  huntAttriburesXmlPath: string;
  huntAppsId: number;
}

export class DexieSettingsModel extends DexieBaseModel implements IDexieSettingsModel {
  public uuid: string;
  public steamPath: string;
  public steamUserName: string;
  public steamProfileName: string;
  public steamUserId?: number;
  public huntPath: string;
  public huntAttriburesXmlPath: string;
  public huntAppsId: number;

  constructor();
  constructor(obj: IDexieSettingsModel);
  constructor(obj?: any) {
    super(obj);
    this.uuid = (obj && obj.uuid) || '';
    this.steamPath = (obj && obj.steamPath) || '';
    this.steamUserName = (obj && obj.steamUserName) || '';
    this.steamProfileName = (obj && obj.steamProfileName) || '';
    this.huntPath = (obj && obj.huntPath) || '';
    this.huntAttriburesXmlPath = (obj && obj.huntAttriburesXmlPath) || '';
    this.huntAppsId = (obj && obj.huntAppsId) || 0;
    this.steamUserId = obj && obj.steamUserId ? obj.steamUserId : undefined;
  }
}
