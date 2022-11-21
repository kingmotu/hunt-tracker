<template>
  <v-timeline side="end" class="mission-log">
    <v-timeline-item
      v-for="(item, index) in missionLog"
      :key="index"
      :dot-color="getColor(item.type)"
      size="small"
    >
      <div class="d-flex">
        <strong class="mr-4">{{ item.eventTimeString }}</strong>
        <div>
          <div class="">{{ item.playerProfileName }}</div>
          <div class="">{{ getTypeString(item.type) }}</div>
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts" src="./MissionLog.ts"></script>
<style lang="scss" src="./MissionLog.scss"></style>
