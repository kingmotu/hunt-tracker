<template>
  <v-form v-model="valid">
    <v-container>
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel>
          <v-expansion-panel-title>Settings</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="steamPath" label="Steam path" required></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field
                  v-model="steamActiveUserId"
                  hint="Only readable if Steam is running"
                  label="Active Steam User Id"
                  required
                  persistent-hint
                ></v-text-field>
              </v-col>

              <v-col cols="6">
                <v-text-field v-model="huntAppsId" label="Hunt App Id" readonly></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="steamLastUsedGameName"
                  label="Last used game name"
                  required
                ></v-text-field>
              </v-col>

              <v-col cols="12">
                <v-text-field
                  v-model="huntInstallPath"
                  label="Hunt install path"
                  readonly
                  persistent-hint
                ></v-text-field>
              </v-col>
              <v-col cols="3">
                <v-btn color="secondary" @click="test()"> TEST </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn color="secondary" @click="readSteamInfos()"> Steam </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn color="secondary" @click="startWatchAttribuesXml()"> Start </v-btn>
              </v-col>
              <v-col cols="3">
                <v-btn color="secondary" @click="stopWatchAttribuesXml()"> Stop </v-btn>
              </v-col>
            </v-row>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel :disabled="profileDisabled">
          <v-expansion-panel-title>Profile</v-expansion-panel-title>
          <v-expansion-panel-text> Some content </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-form>
</template>

<script lang="ts" src="./Startup.ts"></script>
<style scoped lang="scss" src="./Startup.scss"></style>
