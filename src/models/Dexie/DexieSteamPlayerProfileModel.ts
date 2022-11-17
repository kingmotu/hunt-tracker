import { DexieBaseModel, IDexieBaseModel } from './DexieBaseModel';
import { ISteamProfileNamesModel, SteamProfileNamesModel } from './SteamProfileNamesModel';

export interface IDexieSteamPlayerProfileModel extends IDexieBaseModel {
  /**
   * internal uuid
   */
  uuid: string;
  /**
   * Steam profile id (steamID64)
   */
  profileId: number;
  /**
   * Actual used/know profile name
   */
  profileName: string;
  /**
   * List of all known profile names for this profileId
   */
  otherProfileNames: ISteamProfileNamesModel[];
  /**
   * First seen on recording stats
   */
  firstSeen: Date;
  /**
   * Tracking user already played with this player in a team
   */
  alreadyPlayedInTeam: boolean;
  /**
   * Is the tracking player.
   * TODO: Check again when multiple profiles available
   */
  isTrackingPlayer: boolean;

  /**
   * User has downed this palyer x times
   */
  downedByTrackingPlayer: number;
  /**
   * User was downed x times by this player
   */
  downedTrackingPlayer: number;
  /**
   * A team meber of the User has downed this player x times
   */
  downedByTrackingPlayerTeam: number;
  /**
   * A team meber of the User was downed this player x times
   */
  downedTrackingPlayerTeam: number;

  /**
   * User has killed this palyer x times
   */
  killedByTrackingPlayer: number;
  /**
   * User was killed x times by this player
   */
  killedTrackingPlayer: number;
  /**
   * A team meber of the User has killed this player x times
   */
  killedByTrackingPlayerTeam: number;
  /**
   * A team meber of the User was killed this player x times
   */
  killedTrackingPlayerTeam: number;
}

export class DexieSteamPlayerProfileModel
  extends DexieBaseModel
  implements IDexieSteamPlayerProfileModel
{
  public uuid: string;
  public profileId: number;
  public profileName: string;
  public otherProfileNames: SteamProfileNamesModel[];
  public firstSeen: Date;
  public alreadyPlayedInTeam: boolean;
  public isTrackingPlayer: boolean;

  public downedByTrackingPlayer: number;
  public downedTrackingPlayer: number;
  public downedByTrackingPlayerTeam: number;
  public downedTrackingPlayerTeam: number;

  public killedByTrackingPlayer: number;
  public killedTrackingPlayer: number;
  public killedByTrackingPlayerTeam: number;
  public killedTrackingPlayerTeam: number;

  constructor();
  constructor(obj: IDexieSteamPlayerProfileModel);
  constructor(obj?: any) {
    super(obj);
    this.uuid = (obj && obj.uuid) || '';
    this.profileId = (obj && obj.profileId) || 0;
    this.profileName = (obj && obj.profileName) || '';
    this.firstSeen = (obj && obj.firstSeen) || new Date();
    this.alreadyPlayedInTeam = (obj && obj.alreadyPlayedInTeam) || false;
    this.isTrackingPlayer = (obj && obj.isTrackingPlayer) || false;

    this.downedByTrackingPlayer = (obj && obj.downedByTrackingPlayer) || 0;
    this.downedTrackingPlayer = (obj && obj.downedTrackingPlayer) || 0;
    this.downedByTrackingPlayerTeam = (obj && obj.downedByTrackingPlayerTeam) || 0;
    this.downedTrackingPlayerTeam = (obj && obj.downedTrackingPlayerTeam) || 0;

    this.killedByTrackingPlayer = (obj && obj.killedByTrackingPlayer) || 0;
    this.killedTrackingPlayer = (obj && obj.killedTrackingPlayer) || 0;
    this.killedByTrackingPlayerTeam = (obj && obj.killedByTrackingPlayerTeam) || 0;
    this.killedTrackingPlayerTeam = (obj && obj.killedTrackingPlayerTeam) || 0;

    this.otherProfileNames = [];
    if (obj && obj.otherProfileNames) {
      obj.otherProfileNames.forEach((otherName) => {
        this.otherProfileNames.push(new SteamProfileNamesModel(otherName));
      });
    }
  }

  public getSteamProfileLink(): URL {
    return new URL(`https://steamcommunity.com/profiles/${this.profileId}`);
  }
}
