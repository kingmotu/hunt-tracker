<template>
  <v-timeline side="end" class="mission-summary">
    <v-timeline-item
      v-for="(item, index) in missionAccolades"
      :key="index"
      :dot-color="getColor(item)"
      size="small"
    >
      <div class="d-flex">
        <strong class="mr-4">{{ item.category }}</strong>
        <div>
          <div class="">{{ getText(item) }}</div>
        </div>
      </div>
    </v-timeline-item>
  </v-timeline>
</template>

<script lang="ts" src="./MissionSummary.ts"></script>
<style lang="scss" src="./MissionSummary.scss"></style>
