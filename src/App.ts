import HelloWorld from '@/components/HelloWorld.vue';
import { defineComponent, ref } from 'vue';
import { AttributesXmlService, LoggerService, ProfileService, SettingsService } from '@/services';
import { LoggerTypeEnum } from '@/enums/LoggerTypeEnums';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {},
  created() {
    // if development, use debug logging
    if (import.meta.env.DEV) {
      LoggerService.defaultLogLevel = LoggerTypeEnum.DEBUG;
    }
  },
  mounted() {
    if (SettingsService.LastUsedSettingsUuid != null) {
      SettingsService.FetchSettings(SettingsService.LastUsedSettingsUuid)
        .then((settings) => {
          LoggerService.debug(`settings fetched: `, settings);
        })
        .catch((error) => {
          LoggerService.error(error);
        });
    }
    if (ProfileService.LastUsedProfileUuid != null) {
      ProfileService.FetchUserProfile(ProfileService.LastUsedProfileUuid)
        .then((profile) => {
          LoggerService.debug(`profile fetched: `, profile);
        })
        .catch((error) => {
          LoggerService.error(error);
        });
    }
  },
  beforeUnmount() {
    AttributesXmlService.StopWatchAttributesXml();
  },
  unmounted() {},
  data: () => ({
    selectedTheme: ref('dark'),
    drawer: ref(true),
    rail: ref(false),
  }),
  methods: {
    toggleTheme() {
      this.selectedTheme = this.selectedTheme === 'light' ? 'dark' : 'light';
    },
  },
  computed: {
    getSelectedTheme() {
      return this.selectedTheme;
    },
  },
  watch: {},
});
