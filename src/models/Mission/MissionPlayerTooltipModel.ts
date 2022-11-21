import { MissionLogTypeEnum } from '../../enums/MissionLogTypeEnum';
export interface IMissionPlayerTooltipModel {
  /**
   * Text of the tooltip
   */
  text: string;
  /**
   * Additional text
   */
  additionalText: string;
  /**
   * Round time for tooltip as string
   */
  time: string;
  /**
   * Round time for tooltip as date
   */
  dateTime?: Date;
  /**
   * Event was for teammate
   */
  wasTeammate: boolean;
  /**
   * Type of the mission event
   */
  type: MissionLogTypeEnum;
}

export class MissionPlayerTooltipModel implements IMissionPlayerTooltipModel {
  public text: string;
  public additionalText: string;
  public time: string;
  public dateTime?: Date;
  public wasTeammate: boolean;
  public type: MissionLogTypeEnum;

  constructor();
  constructor(obj: IMissionPlayerTooltipModel);
  constructor(obj?: any) {
    this.text = (obj && obj.text) || '';
    this.additionalText = (obj && obj.additionalText) || '';
    this.time = (obj && obj.time) || '';
    this.dateTime = obj && obj.dateTime ? obj.dateTime : undefined;
    this.wasTeammate = (obj && obj.wasTeammate) || false;
    this.type = (obj && obj.type) || MissionLogTypeEnum.Unknown;
  }
}
