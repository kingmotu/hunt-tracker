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
      const tooltipsparts = [
        ...(player.tooltipdownedbyme !== '' ? player.tooltipdownedbyme.split('~') : []),
        ...(player.tooltip_downedbyteammate !== ''
          ? player.tooltip_downedbyteammate.split('~')
          : []),
      ];
      return this.getTooltipAsString(tooltipsparts);
    },
    getPlayerKilledTooltip(player: MissionPlayerModel): string {
      const tooltipsparts = [
        ...(player.tooltipkilledbyme !== '' ? player.tooltipkilledbyme.split('~') : []),
        ...(player.tooltipkilledbyteammate !== '' ? player.tooltipkilledbyteammate.split('~') : []),
      ];
      return this.getTooltipAsString(tooltipsparts);
    },

    getTooltipAsString(tooltipsparts: any[]): string {
      const tooltips: MissionPlayerTooltipModel[] = [];
      const now = new Date();

      const getTimes = (inTime: string): Date => {
        if (inTime == null) {
          return;
        }
        const dateTime = new Date(now);
        const timeParts = inTime.split(':');
        dateTime.setMinutes(dateTime.getMinutes() + parseInt(timeParts[0], 10));
        dateTime.setSeconds(dateTime.getSeconds() + parseInt(timeParts[1], 10));

        return dateTime;
      };

      for (let index = 0; index < tooltipsparts.length; index += index < 4 ? 4 : 2) {
        tooltips.push(
          new MissionPlayerTooltipModel({
            additionalText: tooltipsparts[index],
            text: tooltipsparts[index],
            time: tooltipsparts[index + (index < 4 ? 3 : 1)],
            dateTime: getTimes(tooltipsparts[index + (index < 4 ? 3 : 1)]),
            wasTeammate: false,
            type: MissionLogTypeEnum.Unknown,
          }),
        );
      }

      tooltips.sort((lhs, rhs) => {
        if (lhs.dateTime?.getTime() < rhs.dateTime?.getTime()) {
          return -1;
        } else if (lhs.dateTime?.getTime() > rhs.dateTime?.getTime()) {
          return 1;
        } else {
          return 0;
        }
      });

      return tooltips
        .map((t) => `${t.time} by ${t.text.includes('you') ? 'you' : 'teammate'}`)
        .join('<br />');
    },
  },
});
