import { IMissionAccoladeEntryModel, MissionAccoladeEntryModel } from './MissionAccoladeEntryModel';
import { IMissionBagEntryModel, MissionBagEntryModel } from './MissionBagEntryModel';
import { IMissionTeamModel, MissionTeamModel } from './MissionTeamModel';
import { MissionBagBossesModel } from './MissionBagBossesModel';
import { MapTypeEnum } from '@/enums/MapTypeEnum';

export interface IMissionModel {
  uuid: string;
  MissionBagFbeGoldBonus: number;
  MissionBagFbeHunterXpBonus: number;
  MissionBagIsFbeBonusEnabled: boolean;
  MissionBagIsHunterDead: boolean;
  MissionBagIsQuickPlay: boolean;
  MissionBagNumAccolades: number;
  MissionBagNumEntries: number;
  MissionBagNumTeams: number;

  /**
   * Model with infos which boss(es) are in
   * the mission
   */
  Bosses: MissionBagBossesModel;
  /**
   * Version of team details?
   */
  MissionBagTeamDetailsVersion: number;
  /**
   * Map type name as enum
   */
  PVEModeLastSelected: MapTypeEnum;

  Accolades: IMissionAccoladeEntryModel[];
  Entries: IMissionBagEntryModel[];
  Teams: IMissionTeamModel[];
}

export class MissionModel implements IMissionModel {
  public uuid: string;
  public MissionBagFbeGoldBonus: number;
  public MissionBagFbeHunterXpBonus: number;
  public MissionBagIsFbeBonusEnabled: boolean;
  public MissionBagIsHunterDead: boolean;
  public MissionBagIsQuickPlay: boolean;
  public MissionBagNumAccolades: number;
  public MissionBagNumEntries: number;
  public MissionBagNumTeams: number;

  public Bosses: MissionBagBossesModel;
  public MissionBagTeamDetailsVersion: number;
  public PVEModeLastSelected: MapTypeEnum;

  public Accolades: MissionAccoladeEntryModel[];
  public Entries: MissionBagEntryModel[];
  public Teams: MissionTeamModel[];

  constructor();
  constructor(obj: IMissionModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.uuid = (obj && obj.id) || '';
    this.MissionBagFbeGoldBonus = (obj && obj.MissionBagFbeGoldBonus) || 0;

    this.MissionBagFbeHunterXpBonus = (obj && obj.MissionBagFbeHunterXpBonus) || 0;
    this.MissionBagIsFbeBonusEnabled = (obj && obj.MissionBagIsFbeBonusEnabled) || false;
    this.MissionBagIsHunterDead = (obj && obj.MissionBagIsHunterDead) || false;
    this.MissionBagIsQuickPlay = (obj && obj.MissionBagIsQuickPlay) || false;
    this.MissionBagNumAccolades = (obj && obj.MissionBagNumAccolades) || 0;
    this.MissionBagNumEntries = (obj && obj.MissionBagNumEntries) || 0;
    this.MissionBagNumTeams = (obj && obj.MissionBagNumTeams) || 0;

    this.Bosses =
      obj && obj.Bosses ? new MissionBagBossesModel(obj.Bosses) : new MissionBagBossesModel();
    this.MissionBagTeamDetailsVersion = (obj && obj.MissionBagTeamDetailsVersion) || 0;
    this.PVEModeLastSelected = (obj && obj.PVEModeLastSelected) || MapTypeEnum.Unknown;

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
