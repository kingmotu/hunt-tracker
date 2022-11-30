<template>
  <v-app :theme="selectedTheme">
    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list>
        <v-list-item prepend-avatar="test" title="username" subtitle="last nick name" nav>
          <template v-slot:append>
            <v-btn variant="text" :icon="'mdi-chevron-left'" @click.stop="rail = !rail"></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-cog" title="Setup" value="setup" to="/"> </v-list-item>
        <v-list-item
          prepend-icon="mdi-play-circle-outline"
          title="Tracking"
          value="tracking"
          to="/record"
        >
        </v-list-item>
        <v-list-group value="History" prepend-icon="mdi-script-text-outline">
          <template v-slot:activator="{ props }">
            <v-list-item v-bind="props" title="History"></v-list-item>
          </template>

          <v-list-item
            prepend-icon="mdi-bow-arrow"
            title="Missions"
            value="missions"
            to="/missions"
          >
          </v-list-item>
          <v-list-item
            prepend-icon="mdi-account-multiple-outline"
            title="Players"
            value="players"
            to="/players"
          >
          </v-list-item>
        </v-list-group>
        <v-list-item
          prepend-icon="mdi-chart-line"
          title="Statistics"
          value="statistics"
          to="/statistic"
        >
        </v-list-item>
        <v-list-item
          prepend-icon="mdi-file-arrow-left-right-outline"
          title="Import/Export"
          value="imexport"
          to="/imexport"
        >
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <div v-if="!rail" class="pa-2">
          <v-btn
            :prepend-icon="selectedTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            @click.stop="toggleTheme()"
            ><div>Toggle Theme</div></v-btn
          >
        </div>
        <div v-else class="pa-2">
          <v-btn
            size="small"
            :icon="selectedTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
            @click.stop="toggleTheme()"
          ></v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <RouterView />
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./App.ts"></script>
<style scoped lang="scss" src="./App.scss"></style>
