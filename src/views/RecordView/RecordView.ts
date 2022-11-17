import { AttributesXmlService, MissionService } from '@/services';
import { defineComponent, ref } from 'vue';
import { ProfileService, LoggerService, SettingsService } from '@/services/index';
import { MissionModel } from '@/models/Mission/MissionModel';
import { MissionTeamModel } from '@/models/Mission/MissionTeamModel';
import { DexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';

export default defineComponent({
  name: 'RecordView',
  components: {},
  data: () => ({
    settings: ref<DexieSettingsModel>(),
    profile: ref<DexieProfileModel>(),
    missionData: ref<MissionModel>(),
    ownTeam: ref<MissionTeamModel>(),
    teams: ref<MissionTeamModel[]>(),
    first: ref(true),
    isWatching: ref(false),
    isProcessing: ref(false),
    tab: null,
  }),
  created() {
    // SettingsService.FetchSettings(SettingsService.LastUsedSettingsUuid)
    //   .then((settings) => {
    //     this.settings = settings;
    //   })
    //   .catch((error) => {
    //     LoggerService.error(error);
    //   });
    // ProfileService.FetchUserProfile(ProfileService.LastUsedProfileUuid)
    //   .then((profile) => {
    //     this.profile = profile;
    //   })
    //   .catch((error) => {
    //     LoggerService.error(error);
    //   });
  },
  mounted() {
    this.setSettings(SettingsService.Settings);
    SettingsService.OnSettingsChanged.on(this.setSettings);
    this.setProfile(ProfileService.UserProfile);
    ProfileService.OnProfileChanged.on(this.setProfile);
    this.fetchLastMission();
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
      }
    },
    startWatchAttribuesXml() {
      if (this.settings) {
        AttributesXmlService.OnAttributesXmlChanged.on(this.processMissionData);
        AttributesXmlService.StartWatchAttributesXml(this.settings.huntAttriburesXmlPath);
        this.isWatching = true;
      }
    },
    stopWatchAttribuesXml() {
      AttributesXmlService.StopWatchAttributesXml();
      AttributesXmlService.OnAttributesXmlChanged.off(this.processMissionData);
      this.isWatching = false;
    },
    fetchLastMission() {
      if (MissionService.LastUsedMissionUuid != null) {
        this.isProcessing = true;
        MissionService.FetchMissionByUuid(MissionService.LastUsedMissionUuid)
          .then((missionData) => {
            this.missionData = missionData;
            this.ownTeam = missionData.Teams.find((team) => team.ownteam);
            this.teams = missionData.Teams.filter((team) => !team.ownteam);
            if (this.profile) {
              this.first = (this.profile as DexieProfileModel).hasMissionInit;
            }
          })
          .finally(() => {
            this.isProcessing = false;
          });
      }
    },
    processFirstMission() {
      this.isProcessing = true;
      AttributesXmlService.ReadXmlFile(this.settings.huntAttriburesXmlPath)
        .then(() => {
          const missionModel = AttributesXmlService.LastMissionLog;
          this.saveMissionDataToDB(missionModel, true);
        })
        .catch((error) => {
          LoggerService.error(error);
        });
    },
    async processMissionData(inMissionModel?: MissionModel) {
      this.isProcessing = true;
      if (inMissionModel != null) {
        this.saveMissionDataToDB(inMissionModel);
      }
    },
    saveMissionDataToDB(inMissionModel: MissionModel, wasFirst: boolean = false) {
      MissionService.AddNewMission(inMissionModel)
        .then((dexieMissionData) => {
          LoggerService.debug(`new mission processed and saved: ${dexieMissionData}`);
          this.missionData = dexieMissionData;
          this.ownTeam = dexieMissionData.Teams.find((team) => team.ownteam);
          this.teams = dexieMissionData.Teams.filter((team) => !team.ownteam);
          if (wasFirst) {
            this.first = false;
          }
        })
        .catch((error) => {
          LoggerService.error(error);
        })
        .finally(() => {
          this.isProcessing = false;
        });
    },
  },
});
