import { defineComponent } from 'vue';
import {
  SteamService,
  AttributesXmlService,
  LoggerService,
  ProfileService,
  SettingsService,
} from '@/services/index';
import { DexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import { DexieProfileModel } from '../../models/Dexie/DexieProfileModel';

export default defineComponent({
  name: 'Startup',
  components: {},
  data: () => ({
    valid: true,
    steamPath: '',
    steamActiveUserId: '',
    steamUserName: '',
    steamLastUsedGameName: '',
    huntAppsId: '',
    huntAttributesXmlPath: '',
    fileWatcher: null,
    panel: ['settings'],
    profileDisabled: true,
    validSteam: true,
    validProfile: true,
    settingsChanged: false,
    profileChanged: false,
    huntProfileId: '',
    settings: undefined,
    profile: undefined,

    pathRules: [(v) => !!v || 'Path is required'],
    nameRules: [(v) => !!v || 'Name is required'],
  }),
  created() {},
  mounted() {
    if (SettingsService.LastUsedSettingsUuid != null) {
      const setSettings = (settings) => {
        LoggerService.debug(`settings fetched: `, settings);
        this.steamPath = settings.steamPath;
        this.huntAppsId = settings.huntAppsId;
        this.huntAttributesXmlPath = settings.huntAttriburesXmlPath;

        this.settingsChanged = false;
        this.profileDisabled = false;
        this.panel = ['profile'];
      };
      if (SettingsService.Settings != null) {
        setSettings(SettingsService.Settings);
      } else {
        SettingsService.FetchSettings(SettingsService.LastUsedSettingsUuid)
          .then((settings) => {
            setSettings(settings);
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      }
    }

    if (ProfileService.LastUsedProfileUuid != null) {
      const setProfile = (profile) => {
        LoggerService.debug(`profile fetched: `, profile);
        this.steamActiveUserId = profile.steamUserId;
        this.steamUserName = profile.steamUserName;
        this.steamLastUsedGameName = profile.steamProfileName;
        this.huntProfileId = profile.huntProfileId;

        this.profileChanged = false;
      };
      if (ProfileService.UserProfile != null) {
        setProfile(ProfileService.UserProfile);
      } else {
        ProfileService.FetchUserProfile(ProfileService.LastUsedProfileUuid)
          .then((profile) => {
            setProfile(profile);
          })
          .catch((error) => {
            LoggerService.error(error);
          });
      }
    }
  },
  watch: {},
  methods: {
    readSteamInfos() {
      SteamService.ReadSteamInfos()
        .catch((error) => {
          LoggerService.error(`Error on fetching Steaminfos: `, error);
        })
        .finally(() => {
          this.steamPath = SteamService.SteamPath;
          this.steamActiveUserId = SteamService.SteamActiveUserId;
          this.steamUserName = SteamService.SteamUserName;
          this.steamLastUsedGameName = SteamService.SteamLastUsedGameName;
          this.huntAppsId = SteamService.HuntAppIdHash;
          this.huntAttributesXmlPath = SteamService.HuntAttributesXmlPath;
        });
    },
    readHuntInfos() {
      AttributesXmlService.ReadXmlFile(this.huntAttributesXmlPath)
        .then(() => {
          const lastMission = AttributesXmlService.LastMissionLog;
          if (lastMission) {
            for (let index = 0; index < lastMission.Teams.length; index++) {
              const team = lastMission.Teams[index];
              const player = team.players.find(
                (player) => player.blood_line_name === this.steamLastUsedGameName,
              );
              if (player) {
                LoggerService.debug(
                  `player ${this.steamLastUsedGameName} found --> ${player.profileid}`,
                );
                this.huntProfileId = player.profileid;
                break;
              }
            }
          }
        })
        .catch((error) => {
          LoggerService.error(error);
        });
    },
    async validateSteam() {
      const { valid } = await this.$refs.formSteam.validate();
      if (valid) {
        this.validSteam = valid;
        this.settings = new DexieSettingsModel({
          uuid:
            SettingsService.LastUsedSettingsUuid != null
              ? SettingsService.LastUsedSettingsUuid
              : crypto.randomUUID(),
          steamPath: SteamService.SteamPath,
          huntAppsId: parseInt(SteamService.HuntAppId, 10),
          huntPath: SteamService.HuntInstallPath,
          huntAttriburesXmlPath: SteamService.HuntAttributesXmlPath,
        });
        if (
          SettingsService.LastUsedSettingsUuid == null ||
          (SettingsService.LastUsedSettingsUuid != null && this.settignsChanged === true)
        ) {
          SettingsService.SaveSettings(this.settings)
            .then((response) => {
              LoggerService.debug(`Save settings with id: ${response}`);
            })
            .catch((error) => {
              LoggerService.error(error);
              return;
            });
        }
        this.panel = ['profile'];
        this.profileDisabled = false;
      }
    },
    async validateProfile() {
      const { valid } = await this.$refs.formProfile.validate();
      this.validProfile = valid;
      if (valid) {
        this.validProfile = valid;
        this.profile = new DexieProfileModel({
          settingsUuid: SettingsService.LastUsedSettingsUuid,
          steamProfileName: SteamService.SteamLastUsedGameName,
          steamUserName: SteamService.SteamUserName,
          uuid: ProfileService.LastUsedProfileUuid
            ? ProfileService.LastUsedProfileUuid
            : crypto.randomUUID(),
          steamUserId: SteamService.SteamActiveUserId,
          huntProfileId: this.huntProfileId,
          hasMissionInit: false,
        });

        if (
          ProfileService.LastUsedProfileUuid == null ||
          (ProfileService.LastUsedProfileUuid != null && this.profileChanged === true)
        ) {
          ProfileService.SaveProfile(this.profile)
            .then((response) => {
              LoggerService.debug(`Save profile with id: ${response}`);
            })
            .catch((error) => {
              LoggerService.error(error);
              return;
            });
        }
      }
    },
    onSettingsChanged() {
      this.settingsChanged = true;
    },
    onProfileChanged() {
      this.profileChanged = true;
    },
    test() {
      AttributesXmlService.ReadXmlFile(SteamService.HuntAttributesXmlPath).catch((error) => {
        console.error(`error on open file: `, error);
      });
    },
  },
  computed: {},
});
