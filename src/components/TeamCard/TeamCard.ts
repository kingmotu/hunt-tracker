import { IMissionTeamModel, MissionTeamModel } from '@/models/Mission/MissionTeamModel';
import { defineComponent, PropType } from 'vue';
import { MissionPlayerModel } from '@/models/Mission/MissionPlayerModel';
import { MissionPlayerTooltipModel } from '@/models/Mission/MissionPlayerTooltipModel';
import { MissionLogTypeEnum } from '@/enums/MissionLogTypeEnum';

export default defineComponent({
  name: 'TeamCard',
  components: {},
  props: {
    team: { type: Object as PropType<IMissionTeamModel>, default: new MissionTeamModel() },
    teamIndex: { type: Number, default: undefined },
    huntProfileId: { type: Number, default: undefined },
  },
  data: () => ({}),
  created() {},
  methods: {
    getStarRating(mmr?: number) {
      let stars = 1;
      if (mmr) {
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
      }

      return stars;
    },

    onPlayerClicked(player: MissionPlayerModel) {
      window.open(
        `https://steamcommunity.com/search/users/#text=${player.blood_line_name}`,
        '_blank',
      );
    },

    getPlayerDownedCount(player: MissionPlayerModel): string {
      let downed = '-';
      if (player.downedbyme > 0 || player.downedbyteammate > 0) {
        downed = (player.downedbyme + player.downedbyteammate).toString();
      }
      return downed;
    },

    getPlayerKilledCount(player: MissionPlayerModel): string {
      let downed = '-';
      if (player.killedbyme > 0 || player.killedbyteammate > 0) {
        downed = (player.killedbyme + player.killedbyteammate).toString();
      }
      return downed;
    },

    getPlayerDownedTooltip(player: MissionPlayerModel): string {
      const tooltips = [
        ...(player.processedTooltips?.tooltipdownedbyme
          ? player.processedTooltips.tooltipdownedbyme
          : []),
        ...(player.processedTooltips?.downedbyteammate
          ? player.processedTooltips.downedbyteammate
          : []),
      ];

      tooltips.sort(this.sortByDate);

      const tooltipsString = tooltips
        .map((t) => `${t.time} by ${t.text.includes('you') ? 'you' : 'teammate'}`)
        .join('<br />');
      return tooltipsString;
    },

    getPlayerKilledTooltip(player: MissionPlayerModel): string {
      const tooltips = [
        ...(player.processedTooltips?.tooltipkilledbyme
          ? player.processedTooltips.tooltipkilledbyme
          : []),
        ...(player.processedTooltips?.tooltipkilledbyteammate
          ? player.processedTooltips.tooltipkilledbyteammate
          : []),
      ];

      tooltips.sort(this.sortByDate);

      const tooltipsString = tooltips
        .map((t) => `${t.time} by ${t.text.includes('you') ? 'you' : 'teammate'}`)
        .join('<br />');
      return tooltipsString;
    },

    sortByDate(lhs: MissionPlayerTooltipModel, rhs: MissionPlayerTooltipModel): number {
      if (lhs.dateTime.getTime() < rhs.dateTime.getTime()) {
        return -1;
      } else if (lhs.dateTime.getTime() > rhs.dateTime.getTime()) {
        return 1;
      } else {
        return 0;
      }
    },
  },
});
