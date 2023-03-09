import { DexieMissionModel } from '@/models/Dexie/DexieMissionModel';
import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { ProfileService, MissionService, LoggerService } from '@/services';
import { defineComponent, ref } from 'vue';
import { RouteLocationNormalizedLoaded, useRoute } from 'vue-router';

import MissonOverview from '@/components/MissionOverview/MissionOverview.vue';
import { MissionFilterEnum } from '@/enums/MissionFilterEnum';

export default defineComponent({
  name: 'MissionsView',
  components: {
    MissonOverview,
  },
  data: () => ({
    missions: ref<DexieMissionModel[]>(),
    selectedMissions: ref<DexieMissionModel[]>(),
    profile: ref<DexieProfileModel>(),
    route: useRoute(),
    missionUuid: '',
    missionData: ref<DexieMissionModel>(),
    showMission: false,
    missionFilter: ref<MissionFilterEnum>(),
    missionFilterEnum: MissionFilterEnum,
  }),
  created() {
    this.missionData = new DexieMissionModel();
    this.missionFilter = MissionFilterEnum.Week;
  },
  beforeMount() {
    this.setProfile(ProfileService.UserProfile);
    ProfileService.OnProfileChanged.on(this.setProfile);
    MissionService.FetchMissions()
      .then((missions) => {
        this.missions = missions.reverse();
        this.getFilteredMissions();
      })
      .catch((error) => {
        LoggerService.error(error);
      });
  },
  watch: {
    route: {
      handler(newValue) {
        if (
          newValue &&
          (newValue as RouteLocationNormalizedLoaded).params.missionUuid !== this.missionUuid
        ) {
          LoggerService.debug(`route:`, newValue.params.missionUuid, this.missionUuid);
          this.missionUuid = (newValue as RouteLocationNormalizedLoaded).params.missionUuid;
          this.loadMissionData(this.missionUuid);
        }
      },
      deep: true,
    },
  },
  methods: {
    setProfile(profile?: DexieProfileModel) {
      if (profile) {
        this.profile = profile;
        this.huntProfileId = profile.huntProfileId;
      }
    },
    getFilteredMissions(inFilter: MissionFilterEnum = MissionFilterEnum.All): void {
      const today = new Date();
      this.missionFilter = inFilter;
      switch (inFilter) {
        case MissionFilterEnum.Today:
          this.selectedMissions = this.missions.filter(
            (m: DexieMissionModel) =>
              m.MissionFinishedDateTime.getFullYear() === today.getFullYear() &&
              m.MissionFinishedDateTime.getMonth() === today.getMonth() &&
              m.MissionFinishedDateTime.getDate() === today.getDate(),
          );
          break;
        case MissionFilterEnum.Week:
          this.selectedMissions = this.missions.filter(
            (m: DexieMissionModel) =>
              m.MissionFinishedDateTime.getFullYear() === today.getFullYear() &&
              m.MissionFinishedDateTime.getMonth() === today.getMonth() &&
              m.MissionFinishedDateTime.getDate() >= today.getDate() - 6 &&
              m.MissionFinishedDateTime.getDate() <= today.getDate(),
          );
          break;
        case MissionFilterEnum.Month:
          this.selectedMissions = this.missions.filter(
            (m: DexieMissionModel) =>
              m.MissionFinishedDateTime.getFullYear() === today.getFullYear() &&
              m.MissionFinishedDateTime.getMonth() === today.getMonth(),
          );
          break;

        default:
          this.selectedMissions = this.missions;
          break;
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
    onMissionClicked(inItem: DexieMissionModel): void {
      if (inItem.uuid === this.missionData.uuid) {
        this.showMission = true;
      } else {
        this.$router.replace({ path: `/missions/${inItem.uuid}` });
      }
    },
    onCloseMissionOverview(): void {
      this.showMission = false;
    },
    loadMissionData(inMissionUuid: string): void {
      if (inMissionUuid == null || inMissionUuid === '') {
        return;
      }

      const mission = this.missions.find((m) => m.uuid === inMissionUuid);
      if (mission) {
        this.missionData = mission;
        this.showMission = true;
        LoggerService.debug(`mission data: `, this.missionData);
      } else {
        MissionService.FetchMissionByUuid(inMissionUuid)
          .then((missionData) => {
            this.missionData = missionData;
            this.showMission = true;
            LoggerService.debug(`mission data: `, this.missionData);
          })
          .catch((error) => {
            LoggerService.error(`inMissionUuid: ${inMissionUuid}`, error);
            this.showMission = false;
          });
      }
    },
  },
});
