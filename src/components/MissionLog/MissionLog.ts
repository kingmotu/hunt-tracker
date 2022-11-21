import { defineComponent, PropType, ref } from 'vue';
import { IMissionLogModel } from '@/models/Mission/MissionLogModel';
import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';
// import { LoggerService } from '../../services/index';

export default defineComponent({
  name: 'MissionLog',
  components: {},
  props: {
    missionLog: { type: Array as PropType<IMissionLogModel[]> },
  },
  data: () => ({}),
  created() {},
  watch: {
    // missionLog(newM, oldM) {
    //   LoggerService.debug(`Misson log changed: `, newM, oldM);
    // },
  },
  methods: {
    getColor(inType: MissionLogTypeEnum) {
      let color = 'success';
      switch (inType) {
        case MissionLogTypeEnum.Bounty:
          color = 'primary';
          break;
        case MissionLogTypeEnum.Kill:
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
  },
});
