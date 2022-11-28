import { defineComponent, PropType, ref } from 'vue';
import { ProfileService, SettingsService } from '@/services';
import { DexieMissionModel, IDexieMissionModel } from '@/models/Dexie/DexieMissionModel';
import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { DexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import { MissionTeamModel } from '@/models/Mission/MissionTeamModel';

import MissionLog from '@/components/MissionLog/MissionLog.vue';
import TeamCard from '@/components/TeamCard/TeamCard.vue';

export default defineComponent({
  name: 'MissionOverview',
  components: {
    MissionLog,
    TeamCard,
  },
  props: {
    data: { type: Object as PropType<IDexieMissionModel> },
  },
  data: () => ({
    settings: ref<DexieSettingsModel>(),
    profile: ref<DexieProfileModel>(),
    missionData: ref<DexieMissionModel>(),
    ownTeam: ref<MissionTeamModel>(),
    teams: ref<MissionTeamModel[]>(),
    tab: null,
    huntProfileId: 0,
  }),
  beforeCreate() {
    this.missionData = new DexieMissionModel();
    this.ownTeam = new MissionTeamModel();
    this.teams = [];
  },
  created() {},
  beforeMount() {
    this.setSettings(SettingsService.Settings);
    SettingsService.OnSettingsChanged.on(this.setSettings);
    this.setProfile(ProfileService.UserProfile);
    ProfileService.OnProfileChanged.on(this.setProfile);
  },
  watch: {
    data: {
      handler(newValue) {
        if (newValue) {
          this.missionData = newValue;
          this.ownTeam = newValue.Teams.find((team) => team.ownteam);
          this.teams = newValue.Teams.filter((team) => !team.ownteam);
        }
      },
      deep: true,
    },
  },
  methods: {
    setSettings(settings?: DexieSettingsModel) {
      if (settings) {
        this.settings = settings;
      }
    },
    setProfile(profile?: DexieProfileModel) {
      if (profile) {
        this.profile = profile;
        this.huntProfileId = profile.huntProfileId;
      }
    },
  },
});
