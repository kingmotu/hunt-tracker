export interface IMissionAccoladeEntryModel {
  accoladeId: number;
  value: number;
  bloodlineXp: number;
  bounty: number;
  category: string;
  eventPoints: number;
  gems: number;
  generatedGems: number;
  gold: number;
  header: string;
  hits: number;
  hunterPoints: number;
  hunterXp: number;
  iconPath: string;
  weighting: number;
  xp: number;
}

export class MissionAccoladeEntryModel implements IMissionAccoladeEntryModel {
  public accoladeId: number;
  public value: number;
  public bloodlineXp: number;
  public bounty: number;
  public category: string;
  public eventPoints: number;
  public gems: number;
  public generatedGems: number;
  public gold: number;
  public header: string;
  public hits: number;
  public hunterPoints: number;
  public hunterXp: number;
  public iconPath: string;
  public weighting: number;
  public xp: number;

  constructor();
  constructor(obj: IMissionAccoladeEntryModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.accoladeId = (obj && obj.accoladeId) || -1;
    this.value = (obj && obj.value) || -1;

    this.bloodlineXp = (obj && obj.bloodlineXp) || 0;
    this.bounty = (obj && obj.bounty) || 0;
    this.category = (obj && obj.category) || '';
    this.eventPoints = (obj && obj.eventPoints) || 0;
    this.gems = (obj && obj.gems) || 0;
    this.generatedGems = (obj && obj.generatedGems) || 0;
    this.gold = (obj && obj.gold) || 0;
    this.header = (obj && obj.header) || '';
    this.hits = (obj && obj.hits) || 0;
    this.hunterPoints = (obj && obj.hunterPoints) || 0;
    this.hunterXp = (obj && obj.hunterXp) || 0;
    this.iconPath = (obj && obj.iconPath) || '';
    this.weighting = (obj && obj.weighting) || 0;
    this.xp = (obj && obj.xp) || 0;
  }
}
