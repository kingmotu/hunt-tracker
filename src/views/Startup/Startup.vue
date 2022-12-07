<template>
  <v-form v-model="valid">
    <v-container>
      <v-expansion-panels v-model="panel" multiple>
        <v-expansion-panel value="settings">
          <v-expansion-panel-title>Settings</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-form ref="formSteam" v-model="validSteam" lazy-validation>
              <v-row>
                <v-col cols="12">
                  <v-text-field
                    v-model="steamPath"
                    label="Steam installation path"
                    hint="Path to the Steam folder on your hard disc drive"
                    :rules="pathRules"
                    required
                    persistent-hint
                    @change="onSettingsChanged"
                  ></v-text-field>
                </v-col>

                <v-col cols="12">
                  <v-text-field
                    v-model="huntAttributesXmlPath"
                    label="Hunt attributes.xml path"
                    hint="Path to your hunt attributes.xml file"
                    persistent-hint
                    :rules="pathRules"
                    required
                    @change="onSettingsChanged"
                  ></v-text-field>
                </v-col>
                <v-col cols="6"> </v-col>
                <v-col cols="3">
                  <v-btn color="secondary" @click="readSteamInfos()"> Scan </v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn color="secondary" @click="validateSteam"> Save </v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-expansion-panel-text>
        </v-expansion-panel>

        <v-expansion-panel :disabled="profileDisabled" value="profile">
          <v-expansion-panel-title>Profile</v-expansion-panel-title>
          <v-expansion-panel-text>
            <v-form ref="formProfile" v-model="validProfile" lazy-validation>
              <v-row>
                <v-col cols="6">
                  <v-text-field
                    v-model="steamActiveUserId"
                    hint="Optional, only readable if Steam is running"
                    label="Active Steam User Id"
                    persistent-hint
                    @change="onProfileChanged"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <!-- <v-text-field v-model="huntAppsId" label="Hunt App Id" readonly></v-text-field> -->
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="steamUserName"
                    label="Steam user name"
                    hint="Your Steam login name, also used as profile name by default"
                    :rules="nameRules"
                    persistent-hint
                    required
                    @change="onProfileChanged"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="steamLastUsedGameName"
                    label="Last used game name"
                    hint="Steam profile name, used in games. Please use your last Hunt: Showdown ingame here. Otherwise we can't match your Hunt profile id"
                    :rules="nameRules"
                    persistent-hint
                    required
                    @change="onProfileChanged"
                  ></v-text-field>
                </v-col>

                <v-col cols="6">
                  <v-text-field
                    v-model="huntProfileId"
                    label="Hunt Profile Id"
                    hint="Your Hunt profile id to match player from logs"
                    :rules="nameRules"
                    persistent-hint
                    required
                    type="number"
                    @change="onProfileChanged"
                  ></v-text-field>
                </v-col>

                <v-col cols="6"> </v-col>
                <v-col cols="3">
                  <v-btn color="secondary" @click="readHuntInfos()"> Scan </v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn color="secondary" @click="validateProfile"> Save </v-btn>
                </v-col>
                <!-- <v-col cols="3">
                  <v-btn color="secondary" @click="startWatchAttribuesXml()"> Start </v-btn>
                </v-col>
                <v-col cols="3">
                  <v-btn color="secondary" @click="stopWatchAttribuesXml()"> Stop </v-btn>
                </v-col> -->
              </v-row>
            </v-form>
          </v-expansion-panel-text>
        </v-expansion-panel>
      </v-expansion-panels>
    </v-container>
  </v-form>
</template>

<script lang="ts" src="./Startup.ts"></script>
<style scoped lang="scss" src="./Startup.scss"></style>
