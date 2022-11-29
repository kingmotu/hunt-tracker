<template>
  <v-timeline side="end" class="mission-events">
    <v-timeline-item
      v-for="(item, index) in missionEntries"
      :key="index"
      :dot-color="getColor(item)"
      size="small"
    >
      <div class="d-flex">
        <strong class="mr-4">{{ item.descriptorName }}</strong>
        <div>
          <div class="">{{ getText(item) }}</div>
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts" src="./MissionEvents.ts"></script>
<style lang="scss" src="./MissionEvents.scss"></style>
