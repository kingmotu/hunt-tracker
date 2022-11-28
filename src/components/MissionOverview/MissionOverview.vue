<template>
  <div class="mission-overview">
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
          <MissionLog :mission-log="missionData.missionLog" />
        </v-container>
      </v-window-item>
      <v-window-item value="tab-3">
        <v-container> Events </v-container>
      </v-window-item>
      <v-window-item value="tab-4">
        <v-container> Summary </v-container>
      </v-window-item>
    </v-window>
  </div>
</template>

<script lang="ts" src="./MissionOverview.ts"></script>
<style lang="scss" src="./MissionOverview.scss"></style>
