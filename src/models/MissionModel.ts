import { IMissionAccoladeEntryModel, MissionAccoladeEntryModel } from './MissionAccoladeEntryModel';
import { IMissionBagEntryModel, MissionBagEntryModel } from './MissionBagEntryModel';
import { IMissionTeamModel, MissionTeamModel } from './MissionTeamModel';

export interface IHuntUserEventModel {
  Id: number;
  MissionBagFbeGoldBonus: number;
  MissionBagFbeHunterXpBonus: number;
  MissionBagIsFbeBonusEnabled: boolean;
  MissionBagIsHunterDead: boolean;
  MissionBagIsQuickPlay: boolean;
  MissionBagNumAccolades: number;
  MissionBagNumEntries: number;
  MissionBagNumTeams: number;

  Accolades: IMissionAccoladeEntryModel[];
  Entries: IMissionBagEntryModel[];
  Teams: IMissionTeamModel[];
}

export class HuntUserEventModel implements IHuntUserEventModel {
  public Id: number;
  public MissionBagFbeGoldBonus: number;
  public MissionBagFbeHunterXpBonus: number;
  public MissionBagIsFbeBonusEnabled: boolean;
  public MissionBagIsHunterDead: boolean;
  public MissionBagIsQuickPlay: boolean;
  public MissionBagNumAccolades: number;
  public MissionBagNumEntries: number;
  public MissionBagNumTeams: number;

  public Accolades: MissionAccoladeEntryModel[];
  public Entries: MissionBagEntryModel[];
  public Teams: MissionTeamModel[];

  constructor();
  constructor(obj: IHuntUserEventModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.Id = (obj && obj.id) || -1;
    this.MissionBagFbeGoldBonus = (obj && obj.MissionBagFbeGoldBonus) || 0;

    this.MissionBagFbeHunterXpBonus = (obj && obj.MissionBagFbeHunterXpBonus) || 0;
    this.MissionBagIsFbeBonusEnabled = (obj && obj.MissionBagIsFbeBonusEnabled) || false;
    this.MissionBagIsHunterDead = (obj && obj.MissionBagIsHunterDead) || false;
    this.MissionBagIsQuickPlay = (obj && obj.MissionBagIsQuickPlay) || false;
    this.MissionBagNumAccolades = (obj && obj.MissionBagNumAccolades) || 0;
    this.MissionBagNumEntries = (obj && obj.MissionBagNumEntries) || 0;
    this.MissionBagNumTeams = (obj && obj.MissionBagNumTeams) || 0;

    this.Accolades = [];
    this.Entries = [];
    this.Teams = [];
    if (obj) {
      if (obj.Accolades) {
        obj.Accolades.forEach((acc) => {
          this.Accolades.push(new MissionAccoladeEntryModel(acc));
        });
      }
      if (obj.Entries) {
        obj.Entries.forEach((entry) => {
          this.Entries.push(new MissionBagEntryModel(entry));
        });
      }
      if (obj.Teams) {
        obj.Teams.forEach((team) => {
          this.Teams.push(new MissionTeamModel(team));
        });
      }
    }
  }
}
