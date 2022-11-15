<template>
  <v-app :theme="selectedTheme">
    <!-- <v-app-bar color="grey-lighten-2">
      <RouterLink to="/">Startup</RouterLink>
      <RouterLink to="/home">Home</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <v-spacer></v-spacer>
      <v-btn
        :prepend-icon="selectedTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="toggleTheme()"
        >Toggle Theme</v-btn
      >
    </v-app-bar> -->

    <v-navigation-drawer v-model="drawer" :rail="rail" permanent @click="rail = false">
      <v-list>
        <v-list-item prepend-avatar="test" title="username" subtitle="last nick name" nav>
          <template v-slot:append>
            <v-btn
              variant="text"
              :icon="!rail ? 'mdi-chevron-left' : 'mdi-chevron-right'"
              @click.stop="rail = !rail"
            ></v-btn>
          </template>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-list density="compact" nav>
        <v-list-item prepend-icon="mdi-cog" title="Setup" value="setup"> </v-list-item>
        <v-list-item prepend-icon="mdi-play-circle-outline" title="Tracking" value="tracking">
        </v-list-item>
        <v-list-item prepend-icon="mdi-chart-line" title="Statistics" value="statistics">
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
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./App.ts"></script>
<style scoped lang="scss" src="./App.scss"></style>
