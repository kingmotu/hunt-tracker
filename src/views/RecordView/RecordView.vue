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
      <v-tabs v-model="tab" bg-color="" centered>
        <v-tab value="tab-1"> Teams </v-tab>

        <v-tab value="tab-2"> Mission-Log </v-tab>

        <v-tab value="tab-3"> Events </v-tab>

        <v-tab value="tab-4"> Summary </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="tab-1">
          <v-container>
            <div v-if="missionData" class="mission">
              <TeamCard :team="ownTeam" :huntProfileId="huntProfileId" />
              <TeamCard
                v-for="(team, teamIndex) in teams"
                :key="teamIndex"
                :team="team"
                :team-index="teamIndex + 1"
              />
            </div>
          </v-container>
        </v-window-item>
        <v-window-item value="tab-2">
          <v-container>
            <MissonLog :mission-log="dexieMissionData.missionLog" />
          </v-container>
        </v-window-item>
        <v-window-item value="tab-3">
          <v-container> Events </v-container>
        </v-window-item>
        <v-window-item value="tab-4">
          <v-container> Summary </v-container>
        </v-window-item>
      </v-window>
    </v-container>
  </div>
</template>

<script lang="ts" src="./RecordView.ts"></script>
<style lang="scss" src="./RecordView.scss"></style>
