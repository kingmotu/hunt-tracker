<template>
  <div class="players-view">
    players view

    <v-table fixed-header height="85vh" :hover="true">
      <thead>
        <tr>
          <th class="text-left">Date</th>
          <th class="text-left">Mode</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in players" :key="item.uuid">
          <td>{{ item.profileName }}</td>
          <td>{{ item.firstSeen.toLocaleDateString() }}</td>
        </tr>
      </tbody>
    </v-table>
  </div>
</template>

<script lang="ts" src="./PlayersView.ts"></script>
<style lang="scss" src="./PlayersView.scss"></style>
