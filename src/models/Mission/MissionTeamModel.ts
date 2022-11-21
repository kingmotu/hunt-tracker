import { IMissionPlayerModel, MissionPlayerModel } from './MissionPlayerModel';

export interface IMissionTeamModel {
  /**
   * Internal team id for mission
   */
  teamId: number;
  /**
   * ???
   */
  value: number;
  /**
   * Modifier for team MMR rating
   */
  handicap: number;
  /**
   * Team was random or invited
   * If true, team was created via invite, else random
   */
  isinvite: boolean;
  /**
   * MMR rating of the team
   */
  mmr: number;
  /**
   * Players in the team
   */
  numplayers: number;
  /**
   * Own team
   */
  ownteam: boolean;

  /**
   * A list of players for this team.
   * In QuickPlay each team has one player
   */
  players: IMissionPlayerModel[];
}

export class MissionTeamModel implements IMissionTeamModel {
  public teamId: number;

  public value: number;
  public handicap: number;
  public isinvite: boolean;
  public mmr: number;
  public numplayers: number;
  public ownteam: boolean;

  public players: MissionPlayerModel[];

  constructor();
  constructor(obj: IMissionTeamModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.teamId = (obj && obj.teamId) || -1;
    this.value = (obj && obj.value) || 0;
    this.handicap = (obj && obj.handicap) || 0;
    this.isinvite = (obj && obj.isinvite) || false;
    this.mmr = (obj && obj.mmr) || 0;
    this.numplayers = (obj && obj.numplayers) || 0;
    this.ownteam = (obj && obj.ownteam) || false;

    this.players = [];

    if (obj && obj.players) {
      obj.players.forEach((player) => {
        this.players.push(new MissionPlayerModel(player));
      });
    }
  }
}
