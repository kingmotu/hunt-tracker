import { defineComponent } from 'vue';
import * as fs from 'fs/promises';
const regedit = require('regedit').promisified;

export default defineComponent({
  name: 'Startup',
  components: {},
  data: () => ({
    valid: true,
    steamPath: '',
    steamActiveUserId: '',
    libraryfoldersFilePath: '',
  }),
  created() {
    // fetch on init
    this.getHuntPath();
  },
  watch: {
    steamPath(newPath, oldPath) {
      if (newPath !== oldPath) {
        this.libraryfoldersFilePath = newPath + '\\steamapps\\libraryfolders.vdf';

        fs.readFile(this.libraryfoldersFilePath, { encoding: 'utf8' })
          .then((file) => {
            const t = file;
          })
          .catch((error) => {
            console.error(`error on open file: `, error);
          });
      }
    },
  },
  methods: {
    async getHuntPath() {
      const keyPathSteam = `HKLM\\SOFTWARE\\Wow6432Node\\Valve\\Steam`;
      const keyPathSteamActiveUser = `HKCU\\SOFTWARE\\Valve\\Steam\\ActiveProcess`;
      const reg64 = await regedit.list(keyPathSteam);
      const reg64b = await regedit.list(keyPathSteamActiveUser);
      if (reg64[keyPathSteam]) {
        this.steamPath = reg64[keyPathSteam].values.InstallPath.value;
        this.libraryfoldersFilePath = this.steamPath + this.libraryfoldersFilePath;
      }
      if (reg64b[keyPathSteamActiveUser]) {
        console.log(`ActiveUser: ${reg64b[keyPathSteamActiveUser].values.ActiveUser.value}`);
        this.steamActiveUserId = reg64b[keyPathSteamActiveUser].values.ActiveUser.value;
      }
    },
  },
});
