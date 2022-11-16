import { AttributesXmlService } from '@/services';
import { defineComponent, ref } from 'vue';
import { ProfileService, LoggerService, SettingsService } from '@/services/index';
import { MissionModel } from '@/models/Mission/MissionModel';
import { MissionTeamModel } from '@/models/Mission/MissionTeamModel';

export default defineComponent({
  name: 'StatisticView',
  components: {},
  data: () => ({
    settings: undefined,
    profile: undefined,
    missionData: null,
    ownTeam: new MissionTeamModel(),
    teams: new MissionTeamModel(),
  }),
  created() {
    SettingsService.FetchSettings(SettingsService.LastUsedSettingsUuid)
      .then((settings) => {
        this.settings = settings;
      })
      .catch((error) => {
        LoggerService.error(error);
      });
    ProfileService.FetchUserProfile(ProfileService.LastUsedProfileUuid)
      .then((profile) => {
        this.profile = profile;
      })
      .catch((error) => {
        LoggerService.error(error);
      });
  },
  methods: {
    startWatchAttribuesXml() {
      if (this.settings) {
        AttributesXmlService.OnAttributesXmlChanged.on(this.setMissionData);
        AttributesXmlService.StartWatchAttributesXml(this.settings.huntAttriburesXmlPath);
        this.setMissionData();
      }
    },
    stopWatchAttribuesXml() {
      AttributesXmlService.StopWatchAttributesXml();
      AttributesXmlService.OnAttributesXmlChanged.off(this.setMissionData);
    },
    setMissionData(inMissionModel?: MissionModel) {
      if (inMissionModel == null) {
        inMissionModel = AttributesXmlService.LastMissionLog;
      }
      if (inMissionModel == null) {
        AttributesXmlService.ReadXmlFile(this.settings.huntAttriburesXmlPath)
          .then(() => {
            inMissionModel = AttributesXmlService.LastMissionLog;
            this.missionData = inMissionModel;
            this.ownTeam = inMissionModel.Teams.find((team) => team.ownteam);
            this.teams = inMissionModel.Teams.filter((team) => !team.ownteam);
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      } else {
        this.missionData = inMissionModel;
        this.ownTeam = inMissionModel.Teams.find((team) => team.ownteam);
        this.teams = inMissionModel.Teams.filter((team) => !team.ownteam);
      }
    },
  },
});
