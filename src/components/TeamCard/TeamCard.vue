<template>
  <v-card
    density="compact"
    class="team-card elevation-1 team"
    :class="{ 'own-team': teamIndex == null }"
  >
    <template v-slot:title>
      <v-row no-gutters>
        <v-col cols="3">
          <div v-if="teamIndex" class="team-name">{{ `Team ${teamIndex}` }}</div>
          <div v-else class="team-name">{{ `Your team` }}</div>
        </v-col>
        <v-col cols="3">
          <v-rating
            :model-value="getStarRating(team.mmr)"
            size="small"
            length="6"
            density="compact"
            class="px-2 mt-n1"
            readonly
          ></v-rating>
        </v-col>
        <v-col cols="2">
          <div class="mmr text-body-2">({{ team.mmr }})</div>
        </v-col>
        <v-col cols="1" class="ml-n1">
          <div class="mmr text-body-2" title="Downed">D</div>
        </v-col>
        <v-col cols="1" class="ml-n1">
          <div class="mmr text-body-2" title="Killed">K</div>
        </v-col>
      </v-row>
    </template>

    <template v-slot:subtitle>
      <!-- <div class="d-flex align-center">
        <v-rating
          :model-value="getStarRating(team.mmr)"
          size="small"
          length="6"
          density="compact"
          class="px-2 mt-n1"
          readonly
        ></v-rating>
        <div class="mmr text-body-2">({{ team.mmr }})</div>
      </div> -->
    </template>

    <template v-slot:text>
      <v-list density="compact" class="py-0" nav>
        <v-list-item
          v-for="(player, playerIndex) in team.players"
          :key="playerIndex"
          variant="plain"
          min-height="auto"
          @click="onPlayerClicked(player)"
        >
          <v-list-item-title>
            <v-row no-gutters>
              <v-col cols="3">
                <div
                  class="player-name text-body-1 pr-2"
                  :class="{
                    'font-weight-black': huntProfileId && player.profileid === huntProfileId,
                  }"
                  :title="player.blood_line_name"
                >
                  {{ player.blood_line_name }}
                </div>
              </v-col>
              <v-col cols="3">
                <v-rating
                  :model-value="getStarRating(player.mmr)"
                  size="small"
                  length="6"
                  density="compact"
                  class="px-2 mt-n1"
                  readonly
                ></v-rating>
              </v-col>
              <v-col cols="2">
                <div class="mmr text-body-2">({{ player.mmr }})</div>
              </v-col>
              <v-col cols="1">
                <div class="mmr text-body-2">
                  {{ getPlayerDownedCount(player) }}
                  <v-tooltip
                    v-if="getPlayerDownedCount(player) !== '-'"
                    activator="parent"
                    location="top"
                    origin="auto"
                  >
                    <span v-html="getPlayerDownedTooltip(player)"></span>
                  </v-tooltip>
                </div>
              </v-col>
              <v-col cols="1">
                <div class="mmr text-body-2">
                  {{ getPlayerKilledCount(player) }}
                  <v-tooltip
                    v-if="getPlayerKilledCount(player) !== '-'"
                    activator="parent"
                    location="top"
                    origin="auto"
                  >
                    <span v-html="getPlayerKilledTooltip(player)"></span>
                  </v-tooltip>
                </div>
              </v-col>
            </v-row>
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </template>
  </v-card>
</template>

<script lang="ts" src="./TeamCard.ts"></script>
<style lang="scss" src="./TeamCard.scss"></style>
