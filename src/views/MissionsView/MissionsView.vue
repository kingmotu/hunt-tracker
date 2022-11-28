<template>
  <div class="mission-view">
    mission view

    <v-table fixed-header height="85vh" :hover="true">
      <thead>
        <tr>
          <th class="text-left">Date</th>
          <th class="text-left">Mode</th>
          <th class="text-left">Boss</th>
          <th class="text-left">Team size</th>
          <th class="text-left">Survivor</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in missions" :key="item.uuid" @click="onMissionClicked(item)">
          <td>{{ item.MissionFinishedDateTime.toLocaleString() }}</td>
          <td>{{ getMode(item) }}</td>
          <td>
            <v-icon
              icon="mdi-pig"
              title="Butcher"
              :color="item.Bosses.MissionBagBoss_0 ? '' : '#696969'"
            ></v-icon>
            <v-icon
              icon="mdi-spider"
              title="Spider"
              :color="item.Bosses.MissionBagBoss_1 ? '' : '#696969'"
            ></v-icon>
            <v-icon
              icon="mdi-bug"
              title="Assassin"
              :color="item.Bosses.MissionBagBoss_2 ? '' : '#696969'"
            ></v-icon>
            <v-icon
              icon="mdi-owl"
              title="Scrapbeak"
              :color="item.Bosses.MissionBagBoss_3 ? '' : '#696969'"
            ></v-icon>
          </td>
          <td>
            <v-icon
              v-for="(player, index) in item.Teams.find((t) => t.ownteam).players"
              :key="index"
              icon="mdi-account"
            ></v-icon>
          </td>
          <td>
            <v-icon
              icon="mdi-check-circle"
              title="survived"
              :color="item.MissionBagIsHunterDead ? '#696969' : ''"
            ></v-icon>
          </td>
        </tr>
      </tbody>
    </v-table>

    <v-dialog v-model="showMission" contained scrollable transition="dialog-bottom-transition">
      <v-btn
        icon="mdi-close-thick"
        color=""
        size="small"
        variant="text"
        class="align-self-end"
        @click="onCloseMissionOverview()"
      ></v-btn>
      <v-sheet class="pa-2">
        <MissonOverview :data="missionData" />
      </v-sheet>
    </v-dialog>
  </div>
</template>

<script lang="ts" src="./MissionsView.ts"></script>
<style lang="scss" src="./MissionsView.scss"></style>
