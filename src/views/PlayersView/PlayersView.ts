import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { DexieSteamPlayerProfileModel } from '@/models/Dexie/DexieSteamPlayerProfileModel';
import { PlayerService, ProfileService } from '@/services';
import { defineComponent, ref } from 'vue';

export default defineComponent({
  name: 'PlayersView',
  components: {},
  data: () => ({
    players: ref<DexieSteamPlayerProfileModel[]>(),
    profile: ref<DexieProfileModel>(),
  }),
  created() {},
  beforeMount() {
    this.setProfile(ProfileService.UserProfile);
    ProfileService.OnProfileChanged.on(this.setProfile);
    PlayerService.FetchPlayers().then((players) => {
      this.players = players.sort((lhs, rhs) => lhs.profileName.localeCompare(rhs.profileName));
    });
  },
  methods: {
    setProfile(profile?: DexieProfileModel) {
      if (profile) {
        this.profile = profile;
        this.huntProfileId = profile.huntProfileId;
      }
    },
  },
});
