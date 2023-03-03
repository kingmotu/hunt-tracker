import { IMissionPlayerTooltipModel, MissionPlayerTooltipModel } from './MissionPlayerTooltipModel';

export interface IMissionPlayerTooltipsModel {
  downedbyteammate?: IMissionPlayerTooltipModel[];
  tooltipbountyextracted?: IMissionPlayerTooltipModel[];
  tooltipbountypickedup?: IMissionPlayerTooltipModel[];
  tooltipdownedbyme?: IMissionPlayerTooltipModel[];
  tooltipdownedme?: IMissionPlayerTooltipModel[];
  tooltipdownedteammate?: IMissionPlayerTooltipModel[];
  tooltipkilledbyme?: IMissionPlayerTooltipModel[];
  tooltipkilledbyteammate?: IMissionPlayerTooltipModel[];
  tooltipkilledme?: IMissionPlayerTooltipModel[];
  tooltipkilledteammate?: IMissionPlayerTooltipModel[];
}

export class MissionPlayerTooltipsModel implements IMissionPlayerTooltipsModel {
  public downedbyteammate?: MissionPlayerTooltipModel[];
  public tooltipbountyextracted?: MissionPlayerTooltipModel[];
  public tooltipbountypickedup?: MissionPlayerTooltipModel[];
  public tooltipdownedbyme?: MissionPlayerTooltipModel[];
  public tooltipdownedme?: MissionPlayerTooltipModel[];
  public tooltipdownedteammate?: MissionPlayerTooltipModel[];
  public tooltipkilledbyme?: MissionPlayerTooltipModel[];
  public tooltipkilledbyteammate?: MissionPlayerTooltipModel[];
  public tooltipkilledme?: MissionPlayerTooltipModel[];
  public tooltipkilledteammate?: MissionPlayerTooltipModel[];

  constructor();
  constructor(obj: IMissionPlayerTooltipsModel);
  constructor(obj?: any) {
    if (obj) {
      if (obj.downedbyteammate) {
        this.downedbyteammate = [];
        obj.downedbyteammate.forEach((item) => {
          this.downedbyteammate.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipbountyextracted) {
        this.tooltipbountyextracted = [];
        obj.tooltipbountyextracted.forEach((item) => {
          this.tooltipbountyextracted.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipbountypickedup) {
        this.tooltipbountypickedup = [];
        obj.tooltipbountypickedup.forEach((item) => {
          this.tooltipbountypickedup.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipdownedbyme) {
        this.tooltipdownedbyme = [];
        obj.tooltipdownedbyme.forEach((item) => {
          this.tooltipdownedbyme.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipdownedme) {
        this.tooltipdownedme = [];
        obj.tooltipdownedme.forEach((item) => {
          this.tooltipdownedme.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipdownedteammate) {
        this.tooltipdownedteammate = [];
        obj.tooltipdownedteammate.forEach((item) => {
          this.tooltipdownedteammate.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipkilledbyme) {
        this.tooltipkilledbyme = [];
        obj.tooltipkilledbyme.forEach((item) => {
          this.tooltipkilledbyme.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipkilledbyteammate) {
        this.tooltipkilledbyteammate = [];
        obj.tooltipkilledbyteammate.forEach((item) => {
          this.tooltipkilledbyteammate.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipkilledme) {
        this.tooltipkilledme = [];
        obj.tooltipkilledme.forEach((item) => {
          this.tooltipkilledme.push(new MissionPlayerTooltipModel(item));
        });
      }
      if (obj.tooltipkilledteammate) {
        this.tooltipkilledteammate = [];
        obj.tooltipkilledteammate.forEach((item) => {
          this.tooltipkilledteammate.push(new MissionPlayerTooltipModel(item));
        });
      }
    }
  }
}
