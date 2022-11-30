<template>
  <div class="imexport-view">
    <v-container>
      <v-row>
        <v-col cols="12" class="text-h5">Export</v-col>
        <v-col cols="12" class="body-1">Export all saved data/settings into a json file</v-col>
        <v-col cols="12">
          <v-btn color="secondary" size="large" @click="onExport()"> Export Db into file </v-btn>
        </v-col>
        <v-col cols="12"></v-col>
        <v-col cols="12" class="text-h5">Import</v-col>
        <v-col cols="12" class="body-1">Import only works on empty DB yet...</v-col>
        <v-col cols="6">
          <v-file-input
            v-model="files"
            show-size
            accept="application/json"
            label="File input"
          ></v-file-input>
        </v-col>
        <v-col cols="6"
          ><v-btn color="secondary" size="large" :disabled="disableImport" @click="onImport()">
            Import from file
          </v-btn></v-col
        >
        <v-col cols="12"></v-col>
        <v-col cols="12"></v-col>
        <v-col cols="12" class="text-h5">Delete all Data</v-col>
        <v-col cols="12" class="body-1">Delete all saved data/settings from DB</v-col>
        <v-col cols="12">
          <v-btn color="error" size="large" @click="deleteDialog = true">Delete all data </v-btn>
        </v-col>
      </v-row>

      <v-overlay v-model="progressOverlay" contained class="align-center justify-center">
        <v-progress-circular :rotate="360" :size="100" :width="15" indeterminate color="teal">
        </v-progress-circular>
      </v-overlay>

      <v-dialog v-model="deleteDialog" width="350">
        <v-card>
          <v-card-text> All saved data will be deleted from DB. </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" @click="deleteDialog = false">Cancel</v-btn>
            <v-btn color="warning" @click="onDeleteAll()">DELETE</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </div>
</template>

<script lang="ts" src="./ImExportView.ts"></script>
<style lang="scss" src="./ImExportView.scss"></style>
