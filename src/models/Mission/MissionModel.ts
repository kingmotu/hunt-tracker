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
   * Profile id of palyer who played the mission
   */
  playerProfileId: number;

  /**
   * Datetime when mission was parsed from attribuites xml
   */
  MissionFinishedDateTime: Date;

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

  /**
   * Checksum of the parsed xml file.
   */
  xmlChecksum: string;
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

  public playerProfileId: number;

  public Bosses: MissionBagBossesModel;
  public MissionBagTeamDetailsVersion: number;
  public PVEModeLastSelected: MapTypeEnum;

  public MissionFinishedDateTime: Date;

  public Accolades: MissionAccoladeEntryModel[];
  public Entries: MissionBagEntryModel[];
  public Teams: MissionTeamModel[];

  public xmlChecksum: string = '';

  constructor();
  constructor(obj: IMissionModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.uuid = (obj && obj.uuid) || '';
    this.MissionBagFbeGoldBonus = (obj && obj.MissionBagFbeGoldBonus) || 0;

    this.MissionBagFbeHunterXpBonus = (obj && obj.MissionBagFbeHunterXpBonus) || 0;
    this.MissionBagIsFbeBonusEnabled = (obj && obj.MissionBagIsFbeBonusEnabled) || false;
    this.MissionBagIsHunterDead = (obj && obj.MissionBagIsHunterDead) || false;
    this.MissionBagIsQuickPlay = (obj && obj.MissionBagIsQuickPlay) || false;
    this.MissionBagNumAccolades = (obj && obj.MissionBagNumAccolades) || 0;
    this.MissionBagNumEntries = (obj && obj.MissionBagNumEntries) || 0;
    this.MissionBagNumTeams = (obj && obj.MissionBagNumTeams) || 0;

    this.MissionFinishedDateTime = (obj && obj.MissionFinishedDateTime) || new Date();
    this.playerProfileId = (obj && obj.playerProfileId) || 0;

    this.Bosses =
      obj && obj.Bosses ? new MissionBagBossesModel(obj.Bosses) : new MissionBagBossesModel();
    this.MissionBagTeamDetailsVersion = (obj && obj.MissionBagTeamDetailsVersion) || 0;
    this.PVEModeLastSelected = (obj && obj.PVEModeLastSelected) || MapTypeEnum.Unknown;

    this.xmlChecksum = (obj && obj.xmlChecksum) || '';

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

  /**
   * Compare for some properties besides the checksum
   * @param obj
   * @returns
   */
  compare(obj: MissionModel): boolean {
    return (
      this.MissionBagFbeGoldBonus === obj.MissionBagFbeGoldBonus &&
      this.MissionBagFbeHunterXpBonus === obj.MissionBagFbeHunterXpBonus &&
      this.MissionBagIsFbeBonusEnabled === obj.MissionBagIsFbeBonusEnabled &&
      this.MissionBagIsHunterDead === obj.MissionBagIsHunterDead &&
      this.MissionBagIsQuickPlay === obj.MissionBagIsQuickPlay &&
      this.MissionBagNumAccolades === obj.MissionBagNumAccolades &&
      this.MissionBagNumEntries === obj.MissionBagNumEntries &&
      this.MissionBagNumTeams === obj.MissionBagNumTeams &&
      this.MissionBagTeamDetailsVersion === obj.MissionBagTeamDetailsVersion
    );
  }
}
