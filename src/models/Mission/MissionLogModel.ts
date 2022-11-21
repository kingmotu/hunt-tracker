import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';

export interface IMissionLogModel {
  playerTeamId: number;
  playerProfileId: number;
  playerProfileName: string;
  eventTime: Date;
  eventTimeString: string;
  text: string;
  additionalText: string;
  type: MissionLogTypeEnum;
  wasTeammate: boolean;
}

export class MissionLogModel implements IMissionLogModel {
  public playerTeamId: number;
  public playerProfileId: number;
  public playerProfileName: string;
  public eventTime: Date;
  public eventTimeString: string;
  public text: string;
  public additionalText: string;
  public type: MissionLogTypeEnum;
  public wasTeammate: boolean;

  constructor();
  constructor(obj: IMissionLogModel);
  constructor(obj?: any) {
    this.playerTeamId = (obj && obj.playerTeamId) || 0;
    this.playerProfileId = (obj && obj.playerProfileId) || 0;
    this.playerProfileName = (obj && obj.playerProfileName) || '';
    this.eventTime = (obj && obj.eventTime) || new Date();
    this.eventTimeString = (obj && obj.eventTimeString) || '';
    this.text = (obj && obj.text) || '';
    this.additionalText = (obj && obj.additionalText) || '';
    this.type = (obj && obj.type) || MissionLogTypeEnum.Unknown;
    this.wasTeammate = (obj && obj.wasTeammate) || false;
  }
}
