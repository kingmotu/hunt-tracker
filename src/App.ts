import HelloWorld from '@/components/HelloWorld.vue';
import { defineComponent, ref } from 'vue';
import { LoggerService } from '@/services';
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
  data: () => ({
    selectedTheme: ref('light'),
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
