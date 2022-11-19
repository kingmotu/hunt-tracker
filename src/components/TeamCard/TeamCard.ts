import { IMissionTeamModel } from '@/models/Mission/MissionTeamModel';
import { defineComponent, PropType } from 'vue';
import { MissionPlayerModel } from '../../models/Mission/MissionPlayerModel';

export default defineComponent({
  name: 'TeamCard',
  components: {},
  props: {
    team: { type: Object as PropType<IMissionTeamModel> },
    teamIndex: { type: Number, default: undefined },
    huntProfileId: { type: Number, default: undefined },
  },
  data: () => ({}),
  created() {},
  methods: {
    getStarRating(mmr: number) {
      let stars = 1;
      if (mmr >= 2000 && mmr < 2300) {
        stars = 2;
      } else if (mmr >= 2300 && mmr < 2600) {
        stars = 3;
      } else if (mmr >= 2600 && mmr < 2750) {
        stars = 4;
      } else if (mmr >= 2750 && mmr < 3000) {
        stars = 5;
      } else if (mmr > 3000) {
        stars = 6;
      }

      return stars;
    },
    onPlayerClicked(player: MissionPlayerModel) {
      window.open(
        `https://steamcommunity.com/search/users/#text=${player.blood_line_name}`,
        '_blank',
      );
    },
  },
});
