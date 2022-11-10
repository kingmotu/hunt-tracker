<template>
  <v-form v-model="valid">
    <v-container>
      <v-row>
        <v-col cols="12">
          <v-text-field v-model="steamPath" label="Steam path" required></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="steamActiveUserId"
            hint="Only readable if Steam is open"
            label="Active Steam User Id"
            required
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-text-field
            v-model="libraryfoldersFilePath"
            hint="Only readable, generated automatic"
            label="Path to Steam libraryfolders file"
            readonly
          ></v-text-field>
        </v-col>

        <v-col cols="12">
          <v-textarea label="Text" v-model="libraryfoldersFileText"> </v-textarea>
        </v-col>
        <v-col cols="12" md="4">
          <v-text-field v-model="huntAppsId" label="Hunt App Id" readonly></v-text-field>
        </v-col>
      </v-row>
    </v-container>
  </v-form>
</template>

<script lang="ts" src="./Startup.ts"></script>
<style scoped lang="scss" src="./Startup.scss"></style>
