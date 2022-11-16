<template>
  <div class="statistic-view">
    <v-row>
      <v-col cols="3">
        <v-btn color="secondary" @click="startWatchAttribuesXml()"> Start </v-btn>
      </v-col>
      <v-col cols="3">
        <v-btn color="secondary" @click="stopWatchAttribuesXml()"> Stop </v-btn>
      </v-col>
    </v-row>

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
      <template v-for="(tteam, teamIndex) in teams" :key="teamIndex">
        <div class="team">
          <div class="team__details">
            <div class="name">{{ `Team ${teamIndex + 1}` }}</div>
            <div class="mmr">{{ tteam.mmr }}</div>
          </div>
          <div
            v-for="(player, teamPlayerIndex) in tteam.players"
            :key="teamPlayerIndex"
            class="team__player"
          >
            <div class="name">{{ player.blood_line_name }}</div>
            <div class="mmr">{{ player.mmr }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts" src="./StatisticView.ts"></script>
<style lang="scss" src="./StatisticView.scss"></style>
