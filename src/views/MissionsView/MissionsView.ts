import { DexieMissionModel } from '@/models/Dexie/DexieMissionModel';
import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { ProfileService, MissionService, LoggerService } from '@/services';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'MissionsView',
  components: {},
  data: () => ({
    missions: ref<DexieMissionModel[]>(),
    profile: ref<DexieProfileModel>(),
  }),
  created() {},
  beforeMount() {
    this.setProfile(ProfileService.UserProfile);
    ProfileService.OnProfileChanged.on(this.setProfile);
    MissionService.FetchMissions()
      .then((missions) => {
        this.missions = missions;
      })
      .catch((error) => {
        LoggerService.error(error);
      });
  },
  methods: {
    setProfile(profile?: DexieProfileModel) {
      if (profile) {
        this.profile = profile;
        this.huntProfileId = profile.huntProfileId;
      }
    },
    getMode(inMission: DexieMissionModel): string {
      let mode = 'BH';

      if (inMission.MissionBagIsQuickPlay) {
        mode = 'QP';
      } else if (inMission.Teams.find((t) => t.ownteam && t.players.length === 1)) {
        mode = 'SH';
      }
      return mode;
    },
  },
});
