import DexieDB from './DexieDB';
import { LoggerService } from '@/services/index';
import 'dexie-export-import';

class DexieDBProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: DexieDBProvider;
  public dexieDB: DexieDB;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.dexieDB = new DexieDB('hunt_tracker_tables');
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  // tslint:disable-next-line: member-ordering
  public static getInstance(): DexieDBProvider {
    if (!DexieDBProvider.instance || DexieDBProvider.instance === undefined) {
      DexieDBProvider.instance = new DexieDBProvider();
    }

    return DexieDBProvider.instance;
  }

  public DeleteDataBase() {
    this.dexieDB
      .delete()
      .then(() => {
        LoggerService.LogDebug(`Database successfully deleted`);
      })
      .catch((err) => {
        LoggerService.LogWarn(`Could not delete database: `, err);
      });
  }

  public ExportDataBase(progressCallback?: (progress: any) => boolean): Promise<Blob> {
    return this.dexieDB.export({ progressCallback });
  }

  public ImportDataBase(
    inFile: Blob,
    progressCallback?: (progress: any) => boolean,
  ): Promise<void> {
    return this.dexieDB.import(inFile, { progressCallback });
  }
}

export default DexieDBProvider;
