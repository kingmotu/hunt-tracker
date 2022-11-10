import { defineComponent, ref } from 'vue';
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
    libraryfoldersFile: {},
    libraryfoldersFileText: '',
    huntAppsId: '',
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
            this.libraryfoldersFile = JSON.parse(
              `{${file
                .replaceAll(/"\n(\t)*{/g, '":\n$1{')
                .replaceAll(/^(\t)*"(.*)"(\t)*"(.*)"\n/gm, '$1"$2": "$4",\n')
                .replaceAll(/\t/gm, '')
                .replaceAll(/\n/gm, '')
                .replace(/([,])(?!.*\1)/, '')}}`,
            );
            this.libraryfoldersFileText = this.getFileAsString;
            this.huntAppsId = (this.libraryfoldersFile as any)['libraryfolders']['0']['apps'][
              '594650'
            ];
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
  computed: {
    getFileAsString() {
      return JSON.stringify(this.libraryfoldersFile);
    },
  },
});
