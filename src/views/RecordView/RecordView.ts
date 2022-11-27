import { AttributesXmlService, MissionService } from '@/services';
import { defineComponent, ref } from 'vue';
import { ProfileService, LoggerService, SettingsService } from '@/services/index';
import { MissionModel } from '@/models/Mission/MissionModel';
import { MissionTeamModel } from '@/models/Mission/MissionTeamModel';
import { DexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { DexieMissionModel } from '@/models/Dexie/DexieMissionModel';

import TeamCard from '@/components/TeamCard/TeamCard.vue';
import MissonLog from '@/components/MissionLog/MissionLog.vue';

export default defineComponent({
  name: 'RecordView',
  components: {
    TeamCard,
    MissonLog,
  },
  data: () => ({
    settings: ref<DexieSettingsModel>(),
    profile: ref<DexieProfileModel>(),
    missionData: ref<MissionModel>(),
    dexieMissionData: ref<DexieMissionModel>(),
    ownTeam: ref<MissionTeamModel>(),
    teams: ref<MissionTeamModel[]>(),
    first: ref(true),
    isWatching: ref(false),
    isProcessing: ref(false),
    tab: null,
    huntProfileId: 0,
    develop: import.meta.env.DEV,
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
  beforeMount() {
    this.setSettings(SettingsService.Settings);
    SettingsService.OnSettingsChanged.on(this.setSettings);
    this.setProfile(ProfileService.UserProfile);
    ProfileService.OnProfileChanged.on(this.setProfile);
    this.fetchLastMission();
    if (AttributesXmlService.GetIsWatching === true) {
      LoggerService.debug('already watching file');
      AttributesXmlService.OnAttributesXmlChanged.off(this.processMissionData);
      AttributesXmlService.OnAttributesXmlChanged.on(this.processMissionData);
      this.isWatching = true;
    }
  },
  mounted() {},
  beforeUnmount() {
    AttributesXmlService.OnAttributesXmlChanged.off(this.processMissionData);
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
    startWatchAttribuesXml() {
      if (this.settings) {
        AttributesXmlService.OnAttributesXmlChanged.off(this.processMissionData);
        AttributesXmlService.OnAttributesXmlChanged.on(this.processMissionData);
        AttributesXmlService.StartWatchAttributesXml(this.settings.huntAttriburesXmlPath);
        this.isWatching = true;
        // AttributesXmlService.test(this.settings.huntAttriburesXmlPath);
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
      if (this.missionData && inMissionModel.compare(this.missionData) === true) {
        LoggerService.warn(`Mission data seems to be the same: `, this.missionData, inMissionModel);
      } else {
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
      }
    },
    test() {
      if (import.meta.env.DEV) {
        // AttributesXmlService.ReadXmlFile(`./src/mock/attributes_BH_Solo.xml`)
        AttributesXmlService.ReadXmlFile(this.settings.huntAttriburesXmlPath)
          .then(() => {
            const missionModel = AttributesXmlService.LastMissionLog;
            MissionService.ProcessNewMission(missionModel).then((dexieMissionData) => {
              LoggerService.debug(`test mission processed: ${dexieMissionData}`);
              this.missionData = dexieMissionData;
              this.dexieMissionData = dexieMissionData;
              this.ownTeam = dexieMissionData.Teams.find((team) => team.ownteam);
              this.teams = dexieMissionData.Teams.filter((team) => !team.ownteam);
            });
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      }
    },
    test2() {
      if (import.meta.env.DEV) {
        // AttributesXmlService.ReadXmlFile(`./src/mock/attributes_BH_Solo.xml`) 3743e407-8d68-4aea-bd64-c5acffa9b80c
        MissionService.FetchMissionByUuid('ddd76e88-4af4-4e20-b1ba-0a5211a08a54')
          .then((missionModel) => {
            const testinfo = missionModel.Teams.map((t) => t.players.map((p) => p.killedbyme));
            LoggerService.debug(`testinofo: `, testinfo);
            MissionService.ProcessNewMission(missionModel).then((dexieMissionData) => {
              LoggerService.debug(`test mission processed: ${dexieMissionData}`);
              this.missionData = dexieMissionData;
              this.dexieMissionData = dexieMissionData;
              this.ownTeam = dexieMissionData.Teams.find((team) => team.ownteam);
              this.teams = dexieMissionData.Teams.filter((team) => !team.ownteam);
            });
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      }
    },
  },
});
