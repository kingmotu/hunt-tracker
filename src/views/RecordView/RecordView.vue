<template>
  <div class="record-view">
    <v-container class="content">
      <v-tabs v-model="tab" bg-color="" centered>
        <v-tab value="tab-1"> Teams </v-tab>

        <v-tab value="tab-2"> Events </v-tab>

        <v-tab value="tab-3"> Summary </v-tab>
      </v-tabs>

      <v-window v-model="tab">
        <v-window-item value="tab-1">
          <v-container>
            <div v-if="missionData" class="mission">
              <div class="team own-team">
                <div class="team__details">
                  <div class="name">{{ `Your team` }}</div>
                  <div class="mmr">{{ ownTeam.mmr }}</div>
                </div>
                <div
                  v-for="(player, playerIndex) in ownTeam.players"
                  :key="playerIndex"
                  class="team__player"
                >
                  <div class="name">{{ player.blood_line_name }}</div>
                  <div class="mmr">{{ player.mmr }}</div>
                </div>
              </div>
              <template v-for="(team, teamIndex) in teams" :key="teamIndex">
                <div class="team">
                  <div class="team__details">
                    <div class="name">{{ `Team ${teamIndex + 1}` }}</div>
                    <div class="mmr">{{ team.mmr }}</div>
                  </div>
                  <div
                    v-for="(player, teamPlayerIndex) in team.players"
                    :key="teamPlayerIndex"
                    class="team__player"
                  >
                    <div class="name">{{ player.blood_line_name }}</div>
                    <div class="mmr">{{ player.mmr }}</div>
                  </div>
                </div>
              </template>
            </div>
          </v-container>
        </v-window-item>
        <v-window-item value="tab-2">
          <v-container> Events </v-container>
        </v-window-item>
        <v-window-item value="tab-3">
          <v-container> Summary </v-container>
        </v-window-item>
      </v-window>
    </v-container>

    <v-footer class="footer">
      <v-row>
        <v-col cols="4">
          <v-btn v-if="first" color="secondary" @click="processFirstMission()"> Initialize </v-btn>
          <v-btn v-else-if="!isWatching" color="green" @click="startWatchAttribuesXml()">
            Start watching
          </v-btn>
          <v-btn v-else color="red" @click="stopWatchAttribuesXml()"> Stop watching </v-btn>
        </v-col>
        <v-col cols="4"></v-col>
        <v-col cols="2">
          <!-- <v-chip prepend-icon="mdi-alert-decagram-outline" :color="isProcessing ? 'green' : ''">
          processing
        </v-chip> -->
        </v-col>
        <v-col cols="2">
          <v-chip prepend-icon="mdi-record-rec" :color="isWatching ? 'green' : ''">
            watching
          </v-chip>
        </v-col>
      </v-row>
    </v-footer>
  </div>
</template>

<script lang="ts" src="./RecordView.ts"></script>
<style lang="scss" src="./RecordView.scss"></style>
