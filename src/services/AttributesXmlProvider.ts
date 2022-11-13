import * as fs from 'fs/promises';
import { LoggerService } from '.';
const regedit = require('regedit').promisified;

class AttributesXmlProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: AttributesXmlProvider;

  private steamPath: string = '';
  private steamActiveUserId: string = '';
  private steamLastUsedGameName: string = '';

  private readonly huntAppId = '594650';
  private huntAppIdHash = '';
  private huntInstallPath = '';

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  private constructor() {}

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  public static getInstance(): AttributesXmlProvider {
    if (!AttributesXmlProvider.instance) {
      AttributesXmlProvider.instance = new AttributesXmlProvider();
    }

    return AttributesXmlProvider.instance;
  }

  public get SteamPath(): string {
    return this.steamPath;
  }

  public get SteamActiveUserId(): string {
    return this.steamActiveUserId;
  }

  public get SteamLastUsedGameName(): string {
    return this.steamLastUsedGameName;
  }

  public get HuntAppId(): string {
    return this.huntAppId;
  }

  public get HuntAppIdHash(): string {
    return this.huntAppIdHash;
  }

  public get HuntInstallPath(): string {
    return this.huntInstallPath;
  }

  public get HuntAttributesXmlPath(): string {
    return `${this.HuntInstallPath}\\user\\profiles\\default\\attributes.xml`;
  }

  public ReadSteamInfos(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      /**
       * First read steam infos from registry
       */
      this.getSteamInfos()
        .then(() => {
          /**
           * Second check if Hunt is installed
           */
          this.readLibraryFolders()
            .then(() => {
              /**
               * Read Hunt manifest file to get Hunt path
               */
              this.readHuntManifest()
                .then(() => {
                  resolve();
                })
                .catch((error) => reject(error));
            })
            .catch((error) => reject(error));
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  private getSteamInfos(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      const keyPathSteam64 = `HKLM\\SOFTWARE\\Wow6432Node\\Valve\\Steam`;
      const keyPathSteam = `HKLM\\SOFTWARE\\Valve\\Steam`;
      const keyPathSteamActiveUser = `HKCU\\SOFTWARE\\Valve\\Steam\\ActiveProcess`;
      const keyPathSteamLastUsername = `HKCU\\SOFTWARE\\Valve\\Steam`;

      regedit
        .list([keyPathSteam, keyPathSteam64])
        .then((regListPaths: any) => {
          if (regListPaths[keyPathSteam64]) {
            this.steamPath = regListPaths[keyPathSteam64].values.InstallPath.value;
          } else if (regListPaths[keyPathSteam]) {
            this.steamPath = regListPaths[keyPathSteam].values.InstallPath.value;
          } else {
            reject(`could not find Steam installation`);
          }

          regedit
            .list(keyPathSteamActiveUser)
            .then((regListActiveUser: any) => {
              if (regListActiveUser[keyPathSteamActiveUser]) {
                this.steamActiveUserId =
                  regListActiveUser[keyPathSteamActiveUser].values.ActiveUser.value;
                if (this.steamActiveUserId === '0') {
                  LoggerService.debug(`It seems Steam is not running since ActiveUseId is zero.`);
                }
              } else {
                reject(`Could not find active user in registry`);
              }
              regedit
                .list(keyPathSteamLastUsername)
                .then((regListLastUserName: any) => {
                  if (regListLastUserName[keyPathSteamLastUsername]) {
                    if (regListLastUserName[keyPathSteamLastUsername].values.LastGameNameUsed) {
                      this.steamLastUsedGameName =
                        regListLastUserName[keyPathSteamLastUsername].values.LastGameNameUsed.value;
                    } else if (regListLastUserName[keyPathSteamLastUsername].values.AutoLoginUser) {
                      this.steamLastUsedGameName =
                        regListLastUserName[keyPathSteamLastUsername].values.AutoLoginUser.value;
                    } else {
                      reject(`Could not find last used game/user name`);
                    }
                    resolve(true);
                  } else {
                    reject(`Could not find last used username in registry`);
                  }
                })
                .catch((error: any) => reject(error));
            })
            .catch((error: any) => reject(error));
        })
        .catch((error: any) => reject(error));
    });
  }

  /**
   * Method to read libraryfolders.vdf and check if Hunt: Showdown is installed
   * @returns
   */
  private readLibraryFolders(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const libraryfoldersFilePath = this.steamPath + '\\steamapps\\libraryfolders.vdf';

      fs.readFile(libraryfoldersFilePath, { encoding: 'utf8' })
        .then((file) => {
          const libraryfoldersFile = JSON.parse(
            `{${file
              .replaceAll(/"\n(\t)*{/g, '":\n$1{')
              .replaceAll(/^(\t)*"(.*)"(\t)*"(.*)"\n/gm, '$1"$2": "$4",\n')
              .replaceAll(/,\n(\t*)}/gm, '\n$1}')
              .replaceAll(/\t/gm, '')
              .replaceAll(/\n/gm, '')}}`,
          );
          LoggerService.debug(`libraryfoldersFile: `, JSON.stringify(libraryfoldersFile));
          let appKeys: string[] | undefined = undefined;
          try {
            appKeys = Object.keys((libraryfoldersFile as any)['libraryfolders']['0']['apps']);
            if (appKeys.some((appKey) => appKey === this.huntAppId)) {
              this.huntAppIdHash = (libraryfoldersFile as any)['libraryfolders']['0']['apps'][
                this.huntAppId
              ];
              resolve();
            } else {
              reject('Hunt: SHowdown seems not to be installed on your device');
            }
          } catch (error) {
            reject('Error on parsing steam apps');
          }
        })
        .catch((error) => {
          console.error(`error on open file: `, error);
        });
    });
  }

  private readHuntManifest(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const huntManifestFilePath =
        this.steamPath + `\\steamapps\\appmanifest_${this.huntAppId}.acf`;

      fs.readFile(huntManifestFilePath, { encoding: 'utf8' })
        .then((file) => {
          const huntManifestFile = JSON.parse(
            `{${file
              .replaceAll(/"\n(\t)*{/g, '":\n$1{')
              .replaceAll(/^(\t)*"(.*)"(\t)*"(.*)"\n/gm, '$1"$2": "$4",\n')
              .replaceAll(/}\n(\t*)"/gm, '},\n$1"')
              .replaceAll(/,\n(\t*)}/gm, '\n$1}')
              .replaceAll(/\t/gm, '')
              .replaceAll(/\n/gm, '')}}`,
          );
          LoggerService.debug(`huntManifestFile: `, huntManifestFile);
          try {
            const installDir = (huntManifestFile as any)['AppState']['installdir'];
            this.huntInstallPath = this.SteamPath + `\\steamapps\\common\\${installDir}`;
            resolve();
          } catch (error) {
            LoggerService.debug(`readHuntManifest error: `, error);
            reject(error);
          }
        })
        .catch((error) => {
          console.error(`error on open file: `, error);
        });
    });
  }

  private getLastPlayerNameUsedInSteam(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      const huntManifestFilePath =
        this.steamPath + `\\steamapps\\appmanifest_${this.huntAppId}.acf`;

      fs.readFile(huntManifestFilePath, { encoding: 'utf8' })
        .then((file) => {
          const huntManifestFile = JSON.parse(
            `{${file
              .replaceAll(/"\n(\t)*{/g, '":\n$1{')
              .replaceAll(/^(\t)*"(.*)"(\t)*"(.*)"\n/gm, '$1"$2": "$4",\n')
              .replaceAll(/}\n(\t*)"/gm, '},\n$1"')
              .replaceAll(/,\n(\t*)}/gm, '\n$1}')
              .replaceAll(/\t/gm, '')
              .replaceAll(/\n/gm, '')}}`,
          );
          LoggerService.debug(`huntManifestFile: `, huntManifestFile);
          try {
            const installDir = (huntManifestFile as any)['AppState']['installdir'];
            this.huntInstallPath = this.SteamPath + `\\steamapps\\common\\${installDir}`;
            resolve();
          } catch (error) {
            LoggerService.debug(`readHuntManifest error: `, error);
            reject(error);
          }
        })
        .catch((error) => {
          console.error(`error on open file: `, error);
        });
    });
  }
}

export default AttributesXmlProvider;
