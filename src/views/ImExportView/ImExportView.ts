import { defineComponent } from 'vue';
import { DexieDBPService, LoggerService } from '@/services/index';
import download from 'downloadjs';

export default defineComponent({
  name: 'ImExportView',
  components: {},
  data: () => ({
    panel: [],
    progressOverlay: false,
    progressValue: 0,
    files: [],
    disableImport: true,
    deleteDialog: false,
  }),
  created() {},
  watch: {
    files() {
      if (this.files.length === 0) {
        this.disableImport = true;
      } else {
        this.disableImport = false;
      }
    },
  },
  methods: {
    onExport() {
      this.progressValue = 0;
      this.progressOverlay = true;
      DexieDBPService.ExportDataBase(this.onProgress)
        .then((response) => {
          download(response, 'dexie-export.json', 'application/json');
        })
        .catch((error) => {
          LoggerService.error(error);
        })
        .finally(() => {
          this.progressOverlay = false;
        });
    },
    onImport() {
      this.progressValue = 0;
      this.progressOverlay = true;
      DexieDBPService.ImportDataBase(this.files[0], this.onProgress)
        .then(() => {})
        .catch((error) => {
          LoggerService.error(error);
        })
        .finally(() => {
          this.progressOverlay = false;
        });
    },
    onProgress(progress: any): boolean {
      LoggerService.debug(`progress: `, progress);

      return progress.done || false;
    },
    onDeleteAll(): void {
      DexieDBPService.DeleteDataBase();
    },
  },
});
