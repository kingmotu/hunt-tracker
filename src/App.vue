<template>
  <v-app :theme="selectedTheme">
    <v-app-bar color="grey-lighten-2">
      <RouterLink to="/">Startup</RouterLink>
      <RouterLink to="/home">Ho<v-icon icon="mdi-home" />me</RouterLink>
      <RouterLink to="/about">About</RouterLink>
      <v-spacer></v-spacer>
      <v-btn
        :prepend-icon="selectedTheme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'"
        @click="toggleTheme()"
        >Toggle Theme</v-btn
      >
    </v-app-bar>
    <!-- <v-navigation-drawer color="grey-darken-2" permanent> </v-navigation-drawer> -->
    <v-main>
      <v-container>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<script lang="ts" src="./App.ts"></script>
<style scoped lang="scss" src="./App.scss"></style>
