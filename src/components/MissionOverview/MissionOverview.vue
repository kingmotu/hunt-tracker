<template>
  <div class="mission-overview">
    <v-tabs v-model="tab" bg-color="" centered>
      <v-tab value="tab-1"> Teams </v-tab>

      <v-tab value="tab-2"> Kills </v-tab>

      <v-tab value="tab-3"> Mission-Log </v-tab>

      <v-tab value="tab-4"> Events </v-tab>

      <v-tab value="tab-5"> Summary </v-tab>
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
          <v-row>
            <v-col cols="2"></v-col>
            <v-col cols="1">Team</v-col>
            <v-col cols="1">Self</v-col>
            <v-col cols="1">Assists</v-col>
            <v-col cols="1">Summ</v-col>
            <v-col cols="6"></v-col>

            <v-col cols="2">Kills </v-col>
            <v-col cols="1">{{ missionData.missionKills.teamKills }}</v-col>
            <v-col cols="1">{{ missionData.missionKills.ownKills }}</v-col>
            <v-col cols="1">{{ missionData.missionKills.assists || 0 }}</v-col>
            <v-col cols="1">{{
              missionData.missionKills.teamKills + missionData.missionKills.ownKills
            }}</v-col>
            <v-col cols="6"></v-col>

            <v-col cols="2">Deaths </v-col>
            <v-col cols="1">{{ missionData.missionKills.teamDeaths }}</v-col>
            <v-col cols="1">{{ missionData.missionKills.ownDeaths }}</v-col>
            <v-col cols="1"></v-col>
            <v-col cols="1">{{
              missionData.missionKills.teamDeaths + missionData.missionKills.ownDeaths
            }}</v-col>
          </v-row>
        </v-container>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-container>
          <MissionLog :mission-log="missionData.missionLog" />
        </v-container>
      </v-window-item>
      <v-window-item value="tab-4">
        <v-container>
          <MissionEvents :mission-entries="missionData.Entries" />
        </v-container>
      </v-window-item>
      <v-window-item value="tab-5">
        <v-container>
          <MissionSummary :mission-accolades="missionData.Accolades" />
        </v-container>
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" src="./MissionOverview.ts"></script>
<style lang="scss" src="./MissionOverview.scss"></style>
