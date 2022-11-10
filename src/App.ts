import HelloWorld from '@/components/HelloWorld.vue';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'App',
  components: {
    HelloWorld,
  },
  setup() {},
  data: () => ({
    selectedTheme: ref('light'),
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
