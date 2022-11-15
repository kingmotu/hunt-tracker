import { DexieProfileModel } from '@/models/Dexie/DexieProfileModel';
import DexieDB from './DexieDB';
import DexieDBProvider from './DexieDBProvider';

const profileKey: string = 'ht_profile_uuid';

class ProfileProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: ProfileProvider;

  private lastUsedProfileUuid: string | undefined = undefined;
  private userProfile: DexieProfileModel | undefined = undefined;

  private dexieDB: DexieDB = DexieDBProvider.getInstance().dexieDB;

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    if (localStorage) {
      this.lastUsedProfileUuid = localStorage.getItem(profileKey);
    }
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  // tslint:disable-next-line: member-ordering
  public static getInstance(): ProfileProvider {
    if (!ProfileProvider.instance || ProfileProvider.instance === undefined) {
      ProfileProvider.instance = new ProfileProvider();
    }
    return ProfileProvider.instance;
  }

  /**
   * Get all profiles from dexie db
   */
  public async GetAllProfilesFromDexieDB(): Promise<DexieProfileModel[]> {
    return this.dexieDB.getTable<DexieProfileModel>(this.dexieDB!.getTables().profiles).toArray();
  }

  /**
   * Add a new Profile
   * @param profile Profile
   */
  public async AddProfileProvider(profile: DexieProfileModel): Promise<number> {
    return this.dexieDB.add<DexieProfileModel>(this.dexieDB!.getTables().profiles, profile);
  }

  /**
   * Put/Update a ProfileProvider
   * @param profile ProfileProvider
   */
  public async PutProfileProvider(profile: DexieProfileModel): Promise<number> {
    return this.dexieDB.put<DexieProfileModel>(this.dexieDB!.getTables().profiles, profile);
  }

  /**
   * Put/Update a Profile
   * @param dataSet Profile
   */
  public async bulkPutProfile(profiles: DexieProfileModel[]): Promise<number> {
    return this.dexieDB.bulkPut<DexieProfileModel>(this.dexieDB!.getTables().profiles, profiles);
  }

  /**
   * Delete an Profile
   * @param profile Profile
   */
  public async DeleteProfile(profile: DexieProfileModel): Promise<void> {
    return this.dexieDB.del<DexieProfileModel>(this.dexieDB!.getTables().profiles, profile.id);
  }

  public get LastUsedProfileUuid(): string {
    return this.lastUsedProfileUuid;
  }

  public FetchUserProfile(profileUuid: string): Promise<DexieProfileModel> {
    return new Promise<DexieProfileModel>((resolve, reject) => {
      this.GetAllProfilesFromDexieDB()
        .then((profiles) => {
          const profile = profiles.find((p) => p.uuid === profileUuid);
          if (profile) {
            this.userProfile = profile;
            resolve(profile);
          } else {
            reject(`could not find user profile with uuid: ${profileUuid}`);
          }
        })
        .catch((error) => reject(error));
    });
  }
}

export default ProfileProvider;
