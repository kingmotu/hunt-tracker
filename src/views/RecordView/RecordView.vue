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
              <!-- <div class="team own-team">
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
              </div> -->

              <v-card class="elevation-1 team own-team">
                <template v-slot:title>
                  <div class="name">{{ `Your team` }}</div>
                </template>

                <template v-slot:subtitle>
                  <div class="d-flex align-center">
                    <v-rating
                      :model-value="getStarRating(ownTeam.mmr)"
                      size="small"
                      length="6"
                      density="compact"
                      class="px-2 mt-n1"
                    ></v-rating>
                    <div class="mmr text-body-2">({{ ownTeam.mmr }})</div>
                  </div>
                </template>

                <template v-slot:text>
                  <v-card
                    v-for="(player, playerIndex) in ownTeam.players"
                    :key="playerIndex"
                    class="elevation-0"
                  >
                    <template v-slot:title> </template>

                    <template v-slot:subtitle> </template>

                    <template v-slot:text >
                      <div class="d-flex align-center py-0">
                        <div
                          class="name text-body-1 pr-2"
                          :class="{ 'font-weight-black': player.profileid === huntProfileId }"
                        >
                          {{ player.blood_line_name }}
                        </div>
                        <v-rating
                          :model-value="getStarRating(player.mmr)"
                          size="small"
                          length="6"
                          density="compact"
                          class="px-2 mt-n1"
                        ></v-rating>
                        <div class="mmr text-body-2">({{ player.mmr }})</div>
                      </div>
                    </template>
                  </v-card>
                </template>
              </v-card>

              <v-card v-for="(team, teamIndex) in teams" :key="teamIndex" class="elevation-1 team">
                <template v-slot:title>
                  <div class="name">{{ `Team ${teamIndex + 1}` }}</div>
                </template>

                <template v-slot:subtitle>
                  <div class="d-flex align-center">
                    <v-rating
                      :model-value="getStarRating(team.mmr)"
                      size="small"
                      length="6"
                      density="compact"
                      class="px-2 mt-n1"
                    ></v-rating>
                    <div class="mmr text-body-2">({{ team.mmr }})</div>
                  </div>
                </template>

                <template v-slot:text>
                  <v-card
                    v-for="(player, teamPlayerIndex) in team.players"
                    :key="teamPlayerIndex"
                    class="elevation-0"
                  >
                    <template v-slot:title> </template>

                    <template v-slot:subtitle> </template>

                    <template v-slot:text>
                      <div class="d-flex align-center">
                        <div
                          class="name text-body-1 pr-2"
                          :class="{ 'font-weight-black': player.profileid === huntProfileId }"
                        >
                          {{ player.blood_line_name }}
                        </div>
                        <v-rating
                          :model-value="getStarRating(player.mmr)"
                          size="small"
                          length="6"
                          density="compact"
                          class="px-2 mt-n1"
                        ></v-rating>
                        <div class="mmr text-body-2">({{ player.mmr }})</div>
                      </div>
                    </template>
                  </v-card>
                </template>
              </v-card>

              <!-- <template v-for="(team, teamIndex) in teams" :key="teamIndex">
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
              </template> -->
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

      <v-footer class="footer">
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
    </v-container>
  </div>
</template>

<script lang="ts" src="./RecordView.ts"></script>
<style lang="scss" src="./RecordView.scss"></style>
