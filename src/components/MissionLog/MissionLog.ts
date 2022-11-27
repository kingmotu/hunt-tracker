import { defineComponent, PropType } from 'vue';
import { IMissionLogModel, MissionLogModel } from '@/models/Mission/MissionLogModel';
import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';
import { ProfileService } from '@/services';

export default defineComponent({
  name: 'MissionLog',
  components: {},
  props: {
    missionLog: { type: Array as PropType<IMissionLogModel[]> },
  },
  data: () => ({}),
  created() {},
  watch: {},
  methods: {
    getColor(inType: MissionLogTypeEnum) {
      let color = 'secondary';
      switch (inType) {
        case MissionLogTypeEnum.BountyExtracted:
        case MissionLogTypeEnum.BountyPickedUp:
          color = 'primary';
          break;
        case MissionLogTypeEnum.DownedByMe:
        case MissionLogTypeEnum.DownedByTeammate:
        case MissionLogTypeEnum.KilledByMe:
        case MissionLogTypeEnum.KilledByTeammate:
          color = 'success';
          break;
        case MissionLogTypeEnum.DownedMe:
        case MissionLogTypeEnum.DownedTeammate:
        case MissionLogTypeEnum.KilledMe:
        case MissionLogTypeEnum.KilledTeammate:
          color = 'error';
          break;
        default:
          break;
      }
      return color;
    },
    getTypeString(inType: MissionLogTypeEnum): string {
      return MissionLogTypeEnum[inType].toString();
    },
    getText(inItem: MissionLogModel): string {
      let text = '';
      switch (inItem.type) {
        case MissionLogTypeEnum.BountyExtracted:
          text = `${inItem.playerProfileName} (${this.getTeamString(
            inItem.playerTeamId,
          )}) extracted with Bounty`;
          break;
        case MissionLogTypeEnum.BountyPickedUp:
          text = `${inItem.playerProfileName} (${this.getTeamString(
            inItem.playerTeamId,
          )}) picked up Bounty`;
          break;

        case MissionLogTypeEnum.DownedByMe:
          text = `${ProfileService.UserProfile.steamProfileName} downed ${
            inItem.playerProfileName
          } (${this.getTeamString(inItem.playerTeamId)})`;
          break;
        case MissionLogTypeEnum.DownedMe:
          text = `${inItem.playerProfileName} (${this.getTeamString(inItem.playerTeamId)}) downed ${
            ProfileService.UserProfile.steamProfileName
          }`;
          break;
        case MissionLogTypeEnum.KilledByMe:
          text = `${ProfileService.UserProfile.steamProfileName} killed ${
            inItem.playerProfileName
          } (${this.getTeamString(inItem.playerTeamId)})`;
          break;
        case MissionLogTypeEnum.KilledMe:
          text = `${inItem.playerProfileName} (${this.getTeamString(inItem.playerTeamId)}) killed ${
            ProfileService.UserProfile.steamProfileName
          }`;
          break;

        case MissionLogTypeEnum.DownedByTeammate:
          text = `A teammate downed ${inItem.playerProfileName} (${this.getTeamString(
            inItem.playerTeamId,
          )})`;
          break;
        case MissionLogTypeEnum.DownedTeammate:
          text = `${inItem.playerProfileName} (${this.getTeamString(
            inItem.playerTeamId,
          )}) downed a teammate`;
          break;
        case MissionLogTypeEnum.KilledByTeammate:
          text = `A teammate killed ${inItem.playerProfileName} (${this.getTeamString(
            inItem.playerTeamId,
          )})`;
          break;
        case MissionLogTypeEnum.KilledTeammate:
          text = `${inItem.playerProfileName} (${this.getTeamString(
            inItem.playerTeamId,
          )}) killed a teammate`;
          break;

        default:
          break;
      }
      return text;
    },
    getTeamString(inTeamId: number): string {
      return inTeamId === 0 ? `Your team` : `Team#${inTeamId}`;
    },
  },
});
