import { DexieBaseModel, IDexieBaseModel } from './DexieBaseModel';
import { SteamProfileNamesModel } from './SteamProfileNamesModel';

export interface IDexieProfileModel extends IDexieBaseModel {
  uuid: string;
  steamUserId?: number;
  steamUserName: string;
  steamProfileName: string;
  huntProfileId?: number;
  settingsUuid: string;
  avatar?: string;
  oldSteamProfileNames?: SteamProfileNamesModel[];

  /**
   * Set to true if first mission for profile was parsed
   */
  hasMissionInit: boolean;
}

export class DexieProfileModel extends DexieBaseModel implements IDexieProfileModel {
  public uuid: string;
  public steamUserId?: number;
  public steamUserName: string;
  public steamProfileName: string;
  public huntProfileId?: number;
  public settingsUuid: string;
  public avatar?: string;
  public oldSteamProfileNames?: SteamProfileNamesModel[];
  public hasMissionInit: boolean;

  constructor();
  constructor(obj: IDexieProfileModel);
  constructor(obj?: any) {
    super(obj);
    this.uuid = (obj && obj.uuid) || '';
    this.steamUserId = obj && obj.steamUserId ? obj.steamUserId : undefined;
    this.steamUserName = (obj && obj.steamUserName) || '';
    this.steamProfileName = (obj && obj.steamProfileName) || '';
    this.huntProfileId = obj && obj.huntProfileId ? obj.huntProfileId : undefined;
    this.settingsUuid = (obj && obj.settingsUuid) || '';
    this.avatar = obj && obj.avatar ? obj.avatar : 'default';
    if (obj && obj.oldSteamProfileNames) {
      this.oldSteamProfileNames = [];
      obj.oldSteamProfileNames.forEach((oldName) => {
        this.oldSteamProfileNames.push(new SteamProfileNamesModel(oldName));
      });
    }

    this.hasMissionInit = (obj && obj.hasMissionInit) || false;
  }
}
