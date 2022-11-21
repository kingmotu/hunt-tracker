<template>
  <v-timeline side="end" class="mission-log">
    <v-timeline-item dot-color="secondary" size="small">
      <div class="d-flex">
        <strong class="mr-4">00:00</strong>
        <div>
          <div class="">The hunt match started</div>
        </div>
      </div>
    </v-timeline-item>
    <v-timeline-item
      v-for="(item, index) in missionLog"
      :key="index"
      :dot-color="getColor(item.type)"
      size="small"
    >
      <div class="d-flex">
        <strong class="mr-4">{{ item.eventTimeString }}</strong>
        <div>
          <div class="">{{ getText(item) }}</div>
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts" src="./MissionLog.ts"></script>
<style lang="scss" src="./MissionLog.scss"></style>
