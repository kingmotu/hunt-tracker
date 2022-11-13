export interface IMissionBagBossesModel {
  /**
   * This on is -1 in xml.
   * No sure yet what it is for.
   * Also the key name is not optimal...
   */
  'MissionBagBoss_-1': boolean;
  /**
   * This should be the Spider
   */
  MissionBagBoss_0: boolean;
  /**
   * This should be the Buther
   */
  MissionBagBoss_1: boolean;
  /**
   * This should be the Assassin
   */
  MissionBagBoss_2: boolean;
  /**
   * This should be Scrappy
   */
  MissionBagBoss_3: boolean;
}

export class MissionBagBossesModel implements IMissionBagBossesModel {
  public 'MissionBagBoss_-1': boolean;
  public MissionBagBoss_0: boolean;
  public MissionBagBoss_1: boolean;
  public MissionBagBoss_2: boolean;
  public MissionBagBoss_3: boolean;

  constructor();
  constructor(obj: IMissionBagBossesModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this['MissionBagBoss_-1'] = (obj && obj['MissionBagBoss_-1']) || false;
    this.MissionBagBoss_0 = (obj && obj.MissionBagBoss_0) || false;
    this.MissionBagBoss_1 = (obj && obj.MissionBagBoss_1) || false;
    this.MissionBagBoss_2 = (obj && obj.MissionBagBoss_2) || false;
    this.MissionBagBoss_3 = (obj && obj.MissionBagBoss_3) || false;
  }
}
