export interface IMissionBagEntryModel {
  eventId: number;
  value: number;
  amount: number;
  category: string;
  descriptorName: string;
  descriptorScore: number;
  descriptorType: number;
  iconPath: string;
  iconPath2: string;
  reward: number;
  rewardSize: number;
  uiNam2: string;
  uiName: string;
  uiName2: string;
  //   <Attr name="MissionBagEntry_9" value="1"/>
  //  <Attr name="MissionBagEntry_9_amount" value="1"/>
  //  <Attr name="MissionBagEntry_9_category" value="accolade_monsters_killed"/>
  //  <Attr name="MissionBagEntry_9_descriptorName" value="kill armored"/>
  //  <Attr name="MissionBagEntry_9_descriptorScore" value="1"/>
  //  <Attr name="MissionBagEntry_9_descriptorType" value="2"/>
  //  <Attr name="MissionBagEntry_9_iconPath" value="libs/ui/assets/textures/icons/death_screen/trigger/ai_armored.dds"/>
  //  <Attr name="MissionBagEntry_9_iconPath2" value="libs/ui/assets/textures/icons/accolades/killed_armored.dds"/>
  //  <Attr name="MissionBagEntry_9_reward" value="2"/>
  //  <Attr name="MissionBagEntry_9_rewardSize" value="60"/>
  //  <Attr name="MissionBagEntry_9_uiNam2" value="@ui_reward_accolade_kill_immolator"/>
  //  <Attr name="MissionBagEntry_9_uiName" value="@ui_reward_kill_armored"/>
  //  <Attr name="MissionBagEntry_9_uiName2" value="@ui_reward_accolade_kill_armored"/>
}

export class MissionBagEntryModel implements IMissionBagEntryModel {
  public eventId: number;
  public value: number;
  public amount: number;
  public category: string;
  public descriptorName: string;
  public descriptorScore: number;
  public descriptorType: number;
  public iconPath: string;
  public iconPath2: string;
  public reward: number;
  public rewardSize: number;
  public uiNam2: string;
  public uiName: string;
  public uiName2: string;

  constructor();
  constructor(obj: IMissionBagEntryModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.eventId = (obj && obj.eventId) || -1;
    this.value = (obj && obj.value) || -1;

    this.amount = (obj && obj.bloodlineXp) || 0;
    this.category = (obj && obj.category) || '';
    this.descriptorName = (obj && obj.descriptorName) || '';
    this.descriptorScore = (obj && obj.descriptorScore) || 0;
    this.descriptorType = (obj && obj.descriptorType) || 0;
    this.iconPath = (obj && obj.iconPath) || '';
    this.iconPath2 = (obj && obj.iconPath2) || '';
    this.reward = (obj && obj.reward) || 0;
    this.rewardSize = (obj && obj.rewardSize) || 0;
    this.uiNam2 = (obj && obj.uiNam2) || '';
    this.uiName = (obj && obj.uiName) || '';
    this.uiName2 = (obj && obj.uiName2) || '';
  }
}
