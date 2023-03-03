import { AttributesXmlService, MissionService } from '@/services';
import { defineComponent, ref } from 'vue';
import { ProfileService, LoggerService, SettingsService } from '@/services/index';
import { MissionModel } from '@/models/Mission/MissionModel';
import { DexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { DexieMissionModel } from '@/models/Dexie/DexieMissionModel';

import MissonOverview from '@/components/MissionOverview/MissionOverview.vue';

export default defineComponent({
  name: 'RecordView',
  components: {
    MissonOverview,
  },
  data: () => ({
    settings: ref<DexieSettingsModel>(),
    profile: ref<DexieProfileModel>(),
    dexieMissionData: ref<DexieMissionModel>(),
    first: ref(true),
    isWatching: ref(false),
    isProcessing: ref(false),
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
    this.dexieMissionData = new DexieMissionModel();
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
            this.dexieMissionData = missionData;
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
      if (
        this.dexieMissionData &&
        inMissionModel.compare(this.dexieMissionData as MissionModel) === true
      ) {
        LoggerService.warn(
          `Mission data seems to be the same: `,
          this.dexieMissionData,
          inMissionModel,
        );
      } else {
        MissionService.AddNewMission(inMissionModel)
          .then((dexieMissionData) => {
            LoggerService.debug(`new mission processed and saved: ${dexieMissionData}`);
            this.dexieMissionData = dexieMissionData;
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
        AttributesXmlService.ReadXmlFile(`./src/mock/attributes_QP.xml`)
          // AttributesXmlService.ReadXmlFile(this.settings.huntAttriburesXmlPath)
          .then(() => {
            const missionModel = AttributesXmlService.LastMissionLog;
            this.saveMissionDataToDB(missionModel);
            // MissionService.ProcessNewMission(missionModel).then((dexieMissionData) => {
            //   LoggerService.debug(`test mission processed: ${dexieMissionData}`);
            //   this.dexieMissionData = dexieMissionData;
            //   this.saveMissionDataToDB(dexieMissionData)
            // });
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      }
    },
    test2() {
      if (import.meta.env.DEV) {
        // AttributesXmlService.ReadXmlFile(`./src/mock/attributes_BH_Solo.xml`) 3743e407-8d68-4aea-bd64-c5acffa9b80c
        MissionService.FetchMissionByUuid('d4c17b6d-d262-4785-99d5-695e760fc128')
          .then((missionModel) => {
            const testinfo = missionModel.Teams.map((t) => t.players.map((p) => p.killedbyme));
            LoggerService.debug(`testinofo: `, testinfo);
            MissionService.ProcessNewMission(missionModel).then((dexieMissionData) => {
              LoggerService.debug(`test mission processed: ${dexieMissionData}`);
              this.dexieMissionData = dexieMissionData;
            });
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      }
    },
    timeDiffInMinutes(lhs: Date, rhs: Date): number {
      const diffMs = rhs.getTime() - lhs.getTime(); // milliseconds between rhs and lhs
      const diffMins = diffMs / 1000 / 60;
      LoggerService.debug(`timeDiffInMinutes: ${diffMins}`);
      return diffMins;
    },
  },
});
