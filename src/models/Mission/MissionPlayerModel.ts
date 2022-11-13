export interface IMissionPlayerModel {
  /**
   * Internal team player id for mission
   */
  teamPlayerId: number;
  /**
   * Ingame player name used in this mission
   */
  blood_line_name: string;
  /**
   * Number of bounties extraced with
   */
  bountyextracted: number;
  /**
   * Number of bounties picked up
   */
  bountypickedup: number;
  /**
   * Hunter was downed by the tracked player
   */
  downedbyme: number;
  /**
   * Hunter was downed by a teammate of the tracked player
   */
  downedbyteammate: number;
  /**
   * Hunter whas downed the tracked player
   */
  downedme: number;
  /**
   * Hunter downed a teammate of the tracked player
   */
  downedteammate: number;
  /**
   * Hunter had owned the wellspring
   */
  hadWellspring: boolean;
  /**
   * Hunter had a bounty
   */
  hadbounty: boolean;
  /**
   * Is a teammate of the tracked player
   */
  ispartner: boolean;
  /**
   * Hunter is the soul survivor of a QuickPlay
   */
  issoulsurvivor: boolean;
  /**
   * Hunter was killed by the tracked player
   */
  killedbyme: number;
  /**
   * Hunter was killed by a teammate of the tracked player
   */
  killedbyteammate: number;
  /**
   * Hunter had killed the tracked player
   */
  killedme: number;
  /**
   * Hunter had killed a teammate of the tracked player
   */
  killedteammate: number;
  /**
   * MMR of the Hunter
   */
  mmr: number;
  /**
   * Crytek profile id of the Hunter?
   */
  profileid: number;
  /**
   * not known yet
   * TODO: check what this entrie is for
   */
  proximity: boolean;
  /**
   * not known yet
   * TODO: check what this entrie is for
   */
  proximitytome: boolean;
  /**
   * not known yet
   * TODO: check what this entrie is for
   */
  proximitytoteammate: boolean;
  /**
   * Hunter had skillbased matchmaking enabled
   */
  skillbased: boolean;
  /**
   * Team of Hunter extracted together
   */
  teamextraction: boolean;
  /**
   * ?
   */
  tooltip_downedbyteammate: string;
  tooltipbountyextracted: string;
  tooltipbountypickedup: string;
  tooltipdownedbyme: string;
  tooltipdownedme: string;
  tooltipdownedteammate: string;
  tooltipkilledbyme: string;
  tooltipkilledbyteammate: string;
  tooltipkilledme: string;
  tooltipkilledteammate: string;
}

export class MissionPlayerModel implements IMissionPlayerModel {
  public teamPlayerId: number;
  public blood_line_name: string;
  public bountyextracted: number;
  public bountypickedup: number;
  public downedbyme: number;
  public downedbyteammate: number;
  public downedme: number;
  public downedteammate: number;
  public hadWellspring: boolean;
  public hadbounty: boolean;
  public ispartner: boolean;
  public issoulsurvivor: boolean;
  public killedbyme: number;
  public killedbyteammate: number;
  public killedme: number;
  public killedteammate: number;
  public mmr: number;
  public profileid: number;
  public proximity: boolean;
  public proximitytome: boolean;
  public proximitytoteammate: boolean;
  public skillbased: boolean;
  public teamextraction: boolean;
  public tooltip_downedbyteammate: string;
  public tooltipbountyextracted: string;
  public tooltipbountypickedup: string;
  public tooltipdownedbyme: string;
  public tooltipdownedme: string;
  public tooltipdownedteammate: string;
  public tooltipkilledbyme: string;
  public tooltipkilledbyteammate: string;
  public tooltipkilledme: string;
  public tooltipkilledteammate: string;

  constructor();
  constructor(obj: IMissionPlayerModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.teamPlayerId = (obj && obj.subId) || -1;

    this.blood_line_name = (obj && obj.blood_line_name) || '';
    this.bountyextracted = (obj && obj.bountyextracted) || 0;
    this.bountypickedup = (obj && obj.bountypickedup) || 0;
    this.downedbyme = (obj && obj.downedbyme) || 0;
    this.downedbyteammate = (obj && obj.downedbyteammate) || 0;
    this.downedme = (obj && obj.downedme) || 0;
    this.downedteammate = (obj && obj.downedteammate) || 0;
    this.hadWellspring = (obj && obj.hadWellspring) || false;
    this.hadbounty = (obj && obj.hadbounty) || false;
    this.ispartner = (obj && obj.ispartner) || false;
    this.issoulsurvivor = (obj && obj.issoulsurvivor) || false;
    this.killedbyme = (obj && obj.killedbyme) || 0;
    this.killedbyteammate = (obj && obj.killedbyteammate) || 0;
    this.killedme = (obj && obj.killedme) || 0;
    this.killedteammate = (obj && obj.killedteammate) || 0;
    this.mmr = (obj && obj.mmr) || 0;
    this.profileid = (obj && obj.profileid) || 0;
    this.proximitytome = (obj && obj.proximitytome) || false;
    this.proximitytoteammate = (obj && obj.proximitytoteammate) || false;
    this.skillbased = (obj && obj.skillbased) || false;
    this.teamextraction = (obj && obj.teamextraction) || false;
    this.tooltip_downedbyteammate = (obj && obj.tooltip_downedbyteammate) || '';
    this.tooltipbountyextracted = (obj && obj.tooltipbountyextracted) || '';
    this.tooltipbountypickedup = (obj && obj.tooltipbountypickedup) || '';
    this.tooltipdownedbyme = (obj && obj.tooltipdownedbyme) || '';
    this.tooltipdownedme = (obj && obj.tooltipdownedme) || '';
    this.tooltipdownedteammate = (obj && obj.tooltipdownedteammate) || '';
    this.tooltipkilledbyme = (obj && obj.tooltipkilledbyme) || '';
    this.tooltipkilledbyteammate = (obj && obj.tooltipkilledbyteammate) || '';
    this.tooltipkilledme = (obj && obj.tooltipkilledme) || '';
    this.tooltipkilledteammate = (obj && obj.tooltipkilledteammate) || '';
  }
}
