export interface ISteamProfileNamesModel {
  /**
   * Used profile name
   */
  profileName: string;
  /**
   * Created in local db
   */
  created: Date;
  /**
   * first seen ingame
   */
  firstSeen?: Date;
  /**
   * last seen ingame
   */
  lastSeen?: Date;
}

export class SteamProfileNamesModel implements ISteamProfileNamesModel {
  public profileName: string;
  public created: Date;
  public firstSeen: Date;
  public lastSeen: Date;

  constructor();
  constructor(obj: ISteamProfileNamesModel);
  constructor(obj?: any) {
    this.created = (obj && obj.dateTime) || new Date();
    this.profileName = (obj && obj.profileName) || '';

    this.firstSeen = obj && obj.firstSeen ? obj.firstSeen : undefined;
    this.lastSeen = obj && obj.lastSeen ? obj.lastSeen : undefined;
  }
}
