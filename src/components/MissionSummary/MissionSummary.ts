import { defineComponent, PropType } from 'vue';
import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';
import { ProfileService } from '@/services';
import {
  IMissionAccoladeEntryModel,
  MissionAccoladeEntryModel,
} from '@/models/Mission/MissionAccoladeEntryModel';

export default defineComponent({
  name: 'MissionSummary',
  components: {},
  props: {
    missionAccolades: { type: Array as PropType<IMissionAccoladeEntryModel[]> },
  },
  data: () => ({}),
  created() {},
  watch: {},
  methods: {
    getColor(inItem: MissionAccoladeEntryModel) {
      let color = 'secondary';
      if (inItem.category.includes('players_killed')) {
        color = 'error';
      } else if (inItem.category.includes('monsters_killed')) {
        color = 'primary';
      } else if (
        inItem.category.includes('banished') ||
        inItem.category.includes('clues_found') ||
        inItem.category.includes('extraction')
      ) {
        color = 'success';
      } else if (
        inItem.category.includes('reviver') ||
        inItem.category.includes('hunter_points') ||
        inItem.category.includes('found_gems') ||
        inItem.category.includes('extract')
      ) {
        color = 'warning';
      }
      return color;
    },
    getTypeString(inType: MissionLogTypeEnum): string {
      return MissionLogTypeEnum[inType].toString();
    },
    getText(inItem: MissionAccoladeEntryModel): string {
      let text = '';
      switch (inItem) {
        // case MissionLogTypeEnum.BountyExtracted:
        //   text = `${inItem.playerProfileName} (${this.getTeamString(
        //     inItem.playerTeamId,
        //   )}) extracted with Bounty`;
        //   break;

        default:
          text = '';
          break;
      }
      return text;
    },
  },
});
