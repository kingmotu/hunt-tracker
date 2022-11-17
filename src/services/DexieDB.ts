import Dexie from 'dexie';

import { DexieTableMap } from '@/config/DexieTableMap';
import { LoggerService } from '@/services/index';
import { IDexieMissionModel } from '@/models/Dexie/DexieMissionModel';
import { IDexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import { IDexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import { IDexieSteamPlayerProfileModel } from '@/models/Dexie/DexieSteamPlayerProfileModel';

class DexieDB extends Dexie {
  // Declare implicit table properties.
  // (just to inform Typescript. Instanciated by Dexie in stores() method)
  private profiles: Dexie.Table<IDexieProfileModel, number>; // number = type of the primkey
  private missions: Dexie.Table<IDexieMissionModel, number>; // number = type of the primkey
  private settings: Dexie.Table<IDexieSettingsModel, number>; // number = type of the primkey
  private players: Dexie.Table<IDexieSteamPlayerProfileModel, number>; // number = type of the primkey

  private dexieTableMap: DexieTableMap = new DexieTableMap();

  constructor(dbName: string) {
    super(dbName);

    /**
     * WARNING!
     * If you want to add/remove/change tables, you have to add
     * a new version, otherwise you may cause exceptions on
     * dev/prod servers!
     */

    this.version(1).stores({
      profiles: '++id,uuid',
      missions: '++id,uuid',
      settings: '++id,uuid',
      players: '++id,uuid',
    });

    // The following line is needed if your typescript
    // is compiled using babel instead of tsc:
    this.profiles = this.table(this.dexieTableMap.profiles);
    this.missions = this.table(this.dexieTableMap.missions);
    this.settings = this.table(this.dexieTableMap.settings);
    this.players = this.table(this.dexieTableMap.players);
  }

  public getTables(): DexieTableMap {
    return this.dexieTableMap;
  }

  /**
   * Add a new data object into a table
   * @param tableName     Name of the table
   * @param data          The json ojbject with the data to store
   */
  public async add<T>(tableName: string, data: T): Promise<number> {
    const tableRef = this.getTableRef<T>(tableName);

    return new Promise((resolve, reject) => {
      if (tableRef !== undefined) {
        tableRef
          .add(data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(`Cant find table ${tableName} in DexieDB to put data`);
      }
    });
  }

  /**
   * Put/Update a data object into a table
   * @param tableName     Name of the table
   * @param data          The json ojbject with the data to store.
   *                      The id of the object must match to an existing on,
   *                      otherwise put will create a new entry!
   */
  public async put<T>(tableName: string, data: T): Promise<number> {
    const tableRef = this.getTableRef<T>(tableName);

    return new Promise((resolve, reject) => {
      if (tableRef !== undefined) {
        tableRef
          .put(data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(`Cant find table ${tableName} in DexieDB to put data`);
      }
    });
  }

  /**
   * BulkPut an array of data objects into a table
   * @param tableName     Name of the table
   * @param data          The json array with the data objects to store.
   */
  public async bulkPut<T>(tableName: string, data: T[]): Promise<number> {
    const tableRef = this.getTableRef<T>(tableName);

    return new Promise((resolve, reject) => {
      if (Array.isArray(data) === false) {
        reject(`data must be an array`);
      }
      if (tableRef !== undefined) {
        tableRef
          .bulkPut(data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(`Cant find table ${tableName} in DexieDB to put data`);
      }
    });
  }

  /**
   * Delete an entry
   * @param tableName     Name of the Table
   * @param key           The id of the entry
   */
  public async del<T>(tableName: string, key?: number): Promise<void> {
    const tableRef = this.getTableRef<T>(tableName);

    return new Promise((resolve, reject) => {
      if (tableRef !== undefined && key != null) {
        tableRef
          .delete(key)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(`Cant find table ${tableName} in DexieDB to delete data with id: ${key}`);
      }
    });
  }

  /**
   * Clear all records from a table
   * @param tableName     Name of the table
   */
  public async clear<T>(tableName: string): Promise<void> {
    const tableRef = this.getTableRef<T>(tableName);

    return new Promise((resolve, reject) => {
      if (tableRef !== undefined) {
        tableRef
          .clear()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(`Cant find table ${tableName} in DexieDB to clear data`);
      }
    });
  }

  /**
   * Update a data object into a table
   * @param tableName     Name of the table
   * @param key           Key of the entrie
   * @param data          The json ojbject with the data to store
   */
  public update<T>(tableName: string, key: number, data: object): Promise<number> {
    const tableRef = this.getTableRef<T>(tableName);

    return new Promise<number>((resolve, reject) => {
      if (tableRef !== undefined) {
        tableRef
          .update(key, data)
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            reject(error);
          });
      } else {
        reject(`Cant find table ${tableName} in DexieDB to update data`);
      }
    });
  }

  /**
   * Get the dexie table object from the dexie object.
   *
   * @typeparam T Type of the table
   * @param tableName name of the table
   */
  public getTable<T>(tableName: string) {
    const descriptor = Object.getOwnPropertyDescriptor(this, tableName);
    let result: Dexie.Table<T, number> = {} as any;
    if (descriptor !== undefined) {
      if (descriptor.value) {
        result = descriptor.value as Dexie.Table<T, number>;
      } else if (descriptor.get) {
        result = descriptor.get() as Dexie.Table<T, number>;
      } else {
        LoggerService.LogError(`Something went wrong on getting table ${tableName}`);
      }
    } else {
      LoggerService.LogError(`Couldn't find table ${tableName}`);
    }

    return result;
  }

  private getTableRef<T>(tableName: string): Dexie.Table<T, number> {
    const descriptor = Object.getOwnPropertyDescriptor(this, tableName);
    let result!: Dexie.Table<T, number>;
    if (descriptor !== undefined) {
      if (descriptor.value) {
        result = descriptor.value;
      } else if (descriptor.get) {
        result = descriptor.get();
      } else {
        LoggerService.LogError(`Something went wrong on getting tableRef ${tableName}`);
      }
    } else {
      LoggerService.LogError(`Couldn't find tableRef ${tableName}`);
    }

    return result as Dexie.Table<T, number>;
  }
}

export default DexieDB;
