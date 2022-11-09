import TheWelcome from "@/components/TheWelcome.vue";
import { defineComponent } from "vue";

const regedit = require("regedit").promisified;

export default defineComponent({
  name: "HomeView",
  components: {
    TheWelcome,
  },
  created() {
    // fetch on init
    this.getHuntPath();
  },
  methods: {
    getHuntPath: async () => {
      const keyPath = `HKLM\\SOFTWARE\\Wow6432Node\\Valve\\Steam`;
      const reg64 = await regedit.list(keyPath);
      console.log(`regKey: ${reg64[keyPath].values.InstallPath.value}`, reg64);
    },
  },
});
