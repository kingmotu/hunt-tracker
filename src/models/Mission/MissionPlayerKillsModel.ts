export interface IMissionPlayerKillsModel {
  ownKills: number;
  teamKills: number;
  ownDeaths: number;
  teamDeaths: number;
  assists?: number;
}

export class MissionPlayerKillsModel implements IMissionPlayerKillsModel {
  public ownKills: number;
  public teamKills: number;
  public ownDeaths: number;
  public teamDeaths: number;
  public assists?: number;

  constructor();
  constructor(obj: IMissionPlayerKillsModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.ownKills = (obj && obj.ownKills) || 0;
    this.teamKills = (obj && obj.teamKills) || 0;
    this.ownDeaths = (obj && obj.ownDeaths) || 0;
    this.teamDeaths = (obj && obj.teamDeaths) || 0;
    this.assists = (obj && obj.assists) || 0;
  }

  public append(obj?: MissionPlayerKillsModel): void {
    if (obj) {
      this.ownDeaths += obj.ownDeaths;
      this.ownKills += obj.ownKills;
      this.teamDeaths += obj.teamDeaths;
      this.teamKills += obj.teamKills;
      this.assists += obj.assists;
    }
  }
}
