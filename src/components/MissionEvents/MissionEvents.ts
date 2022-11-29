import { defineComponent, PropType } from 'vue';
import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';
import { ProfileService } from '@/services';
import { IMissionBagEntryModel, MissionBagEntryModel } from '@/models/Mission/MissionBagEntryModel';

export default defineComponent({
  name: 'MissionEvents',
  components: {},
  props: {
    missionEntries: { type: Array as PropType<IMissionBagEntryModel[]> },
  },
  data: () => ({}),
  created() {},
  watch: {},
  methods: {
    getColor(inItem: MissionBagEntryModel) {
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
    getText(inItem: MissionBagEntryModel): string {
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
