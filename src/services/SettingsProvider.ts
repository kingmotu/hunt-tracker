import { DexieSettingsModel } from '@/models/Dexie/DexieSettingsModel';
import DexieDB from './DexieDB';
import DexieDBProvider from './DexieDBProvider';

const settingsKey: string = 'ht_settings_uuid';

class SettingsProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: SettingsProvider;

  private lastUsedSettingsUuid: string | undefined = undefined;
  private settings: DexieSettingsModel | undefined = undefined;

  private dexieDB: DexieDB = DexieDBProvider.getInstance().dexieDB;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    if (localStorage) {
      this.lastUsedSettingsUuid = localStorage.getItem(settingsKey);
    }
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  // tslint:disable-next-line: member-ordering
  public static getInstance(): SettingsProvider {
    if (!SettingsProvider.instance || SettingsProvider.instance === undefined) {
      SettingsProvider.instance = new SettingsProvider();
    }
    return SettingsProvider.instance;
  }

  /**
   * Get all settings from dexie db
   */
  public async GetAllSettingsFromDexieDB(): Promise<DexieSettingsModel[]> {
    return this.dexieDB.getTable<DexieSettingsModel>(this.dexieDB!.getTables().settings).toArray();
  }

  /**
   * Add a new Settings
   * @param profile Settings
   */
  public async AddSettings(profile: DexieSettingsModel): Promise<number> {
    return this.dexieDB.add<DexieSettingsModel>(this.dexieDB!.getTables().settings, profile);
  }

  /**
   * Put/Update a SettingsProvider
   * @param setting SettingsProvider
   */
  public async PutSettings(setting: DexieSettingsModel): Promise<number> {
    return this.dexieDB.put<DexieSettingsModel>(this.dexieDB!.getTables().settings, setting);
  }

  /**
   * Put/Update a Settings
   * @param dataSet Settings
   */
  public async bulkPutSettings(settings: DexieSettingsModel[]): Promise<number> {
    return this.dexieDB.bulkPut<DexieSettingsModel>(this.dexieDB!.getTables().settings, settings);
  }

  /**
   * Delete an Settings
   * @param setting Settings
   */
  public async DeleteSettings(setting: DexieSettingsModel): Promise<void> {
    return this.dexieDB.del<DexieSettingsModel>(this.dexieDB!.getTables().settings, setting.id);
  }

  public get LastUsedSettingsUuid(): string | undefined {
    return this.lastUsedSettingsUuid;
  }

  public set LastUsedSettingsUuid(settingsUuid: string) {
    if (localStorage) {
      localStorage.setItem(settingsKey, settingsUuid);
      this.lastUsedSettingsUuid = settingsUuid;
    }
  }

  public FetchSettings(settingsUuid: string): Promise<DexieSettingsModel> {
    return new Promise<DexieSettingsModel>((resolve, reject) => {
      this.GetAllSettingsFromDexieDB()
        .then((settings) => {
          const fetchedSettings = settings.find((p) => p.uuid === settingsUuid);
          if (fetchedSettings) {
            this.settings = fetchedSettings;
            resolve(fetchedSettings);
          } else {
            reject(`could not find settings with uuid: ${settingsUuid}`);
          }
        })
        .catch((error) => reject(error));
    });
  }

  public SaveSettings(settigns: DexieSettingsModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.PutSettings(settigns)
        .then((response) => {
          this.LastUsedSettingsUuid = settigns.uuid;
          resolve(response);
        })
        .then((error) => {
          reject(error);
        });
    });
  }
}

export default SettingsProvider;
