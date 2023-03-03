<template>
  <div class="record-view h-100">
    <v-container class="content">
      <v-app-bar :elevation="0">
        <v-row>
          <v-col cols="4">
            <v-btn v-if="first" color="secondary" @click="processFirstMission()">
              Initialize
            </v-btn>
            <v-btn v-else-if="!isWatching" color="green" @click="startWatchAttribuesXml()">
              Start watching
            </v-btn>
            <v-btn v-else color="red" @click="stopWatchAttribuesXml()"> Stop watching </v-btn>
          </v-col>
          <v-col cols="4"></v-col>
          <v-col cols="2">
            <v-btn v-if="develop" color="secondary" @click="test2()"> test </v-btn>
          </v-col>
          <v-col cols="2">
            <v-chip prepend-icon="mdi-record-rec" :color="isWatching ? 'green' : ''">
              watching
            </v-chip>
          </v-col>
        </v-row>
      </v-app-bar>

      <MissonOverview :data="dexieMissionData" />
    </v-container>
  </div>
</template>

<script lang="ts" src="./RecordView.ts"></script>
<style lang="scss" src="./RecordView.scss"></style>
