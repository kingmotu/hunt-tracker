import DexieDB from './DexieDB';
import DexieDBProvider from './DexieDBProvider';
import { DexieSteamPlayerProfileModel } from '@/models/Dexie/DexieSteamPlayerProfileModel';
import { LiteEvent, ILiteEvent } from '../liteEvent/liteEvent';
import { LoggerService } from './index';

class PlayerProvider {
  /**
   * Credits: https://refactoring.guru/design-patterns/singleton/typescript/example
   */
  private static instance: PlayerProvider;

  private players: DexieSteamPlayerProfileModel[] = [];
  private playersLoaded: boolean = false;

  private dexieDB: DexieDB = DexieDBProvider.getInstance().dexieDB;

  private readonly onPlayersLoaded = new LiteEvent<DexieSteamPlayerProfileModel[]>();
  private readonly onPlayersChanged = new LiteEvent<DexieSteamPlayerProfileModel[]>();

  /**
   * The Singleton's constructor should always be private to prevent direct
   * construction calls with the `new` operator.
   */
  private constructor() {
    this.FetchPlayers(false)
      .then((resposne) => {
        this.onPlayersLoaded.trigger(resposne);
      })
      .catch((error) => {
        LoggerService.error(error);
      });
  }

  /**
   * The static method that controls the access to the singleton instance.
   *
   * This implementation let you subclass the Singleton class while keeping
   * just one instance of each subclass around.
   */
  // tslint:disable-next-line: member-ordering
  public static getInstance(): PlayerProvider {
    if (!PlayerProvider.instance || PlayerProvider.instance === undefined) {
      PlayerProvider.instance = new PlayerProvider();
    }
    return PlayerProvider.instance;
  }

  /**
   * Get all players from dexie db
   */
  public async GetAllPlayersFromDexieDB(): Promise<DexieSteamPlayerProfileModel[]> {
    return this.dexieDB
      .getTable<DexieSteamPlayerProfileModel>(this.dexieDB!.getTables().players)
      .toArray();
  }

  /**
   * Add a new Player
   * @param player Player
   */
  public async AddPlayer(player: DexieSteamPlayerProfileModel): Promise<number> {
    return this.dexieDB.add<DexieSteamPlayerProfileModel>(
      this.dexieDB!.getTables().players,
      player,
    );
  }

  /**
   * Put/Update a Player
   * @param player Player
   */
  public async PutPlayer(player: DexieSteamPlayerProfileModel): Promise<number> {
    return this.dexieDB.put<DexieSteamPlayerProfileModel>(
      this.dexieDB!.getTables().players,
      player,
    );
  }

  /**
   * Put/Update a Player
   * @param dataSet Player
   */
  public async bulkPutPlayer(players: DexieSteamPlayerProfileModel[]): Promise<number> {
    return this.dexieDB.bulkPut<DexieSteamPlayerProfileModel>(
      this.dexieDB!.getTables().players,
      players,
    );
  }

  /**
   * Delete an Player
   * @param player Player
   */
  public async DeletePlayer(player: DexieSteamPlayerProfileModel): Promise<void> {
    return this.dexieDB.del<DexieSteamPlayerProfileModel>(
      this.dexieDB!.getTables().players,
      player.id,
    );
  }

  /**
   * Delete an Player
   * @param player Player
   */
  public async UpdatePlayer(player: DexieSteamPlayerProfileModel): Promise<number> {
    return this.dexieDB.update<DexieSteamPlayerProfileModel>(
      this.dexieDB!.getTables().players,
      player.id,
      player,
    );
  }

  public get Players(): DexieSteamPlayerProfileModel[] {
    return this.players;
  }

  public get PlayersLoaded(): boolean {
    return this.playersLoaded;
  }

  public get OnPlayersLoaded(): ILiteEvent<DexieSteamPlayerProfileModel[]> {
    return this.onPlayersChanged.expose();
  }

  public get OnPlayersChanged(): ILiteEvent<DexieSteamPlayerProfileModel[]> {
    return this.onPlayersChanged.expose();
  }

  public FetchPlayers(triggerOnChanged: boolean = true): Promise<DexieSteamPlayerProfileModel[]> {
    return new Promise<DexieSteamPlayerProfileModel[]>((resolve, reject) => {
      this.GetAllPlayersFromDexieDB()
        .then((players) => {
          this.players = players;
          if (triggerOnChanged) {
            this.onPlayersChanged.trigger(this.players);
          }
          resolve(players);
        })
        .catch((error) => reject(error));
    });
  }

  public FetchPlayerByUuid(playerUuid: string): Promise<DexieSteamPlayerProfileModel> {
    return new Promise<DexieSteamPlayerProfileModel>((resolve, reject) => {
      this.GetAllPlayersFromDexieDB()
        .then((players) => {
          const player = players.find((p) => p.uuid === playerUuid);
          if (player) {
            resolve(player);
          } else {
            reject(`could not find player with uuid: ${playerUuid}`);
          }
        })
        .catch((error) => reject(error));
    });
  }

  public FetchPlayerByProfileId(playerProfileId: number): Promise<DexieSteamPlayerProfileModel> {
    return new Promise<DexieSteamPlayerProfileModel>((resolve, reject) => {
      this.GetAllPlayersFromDexieDB()
        .then((players) => {
          const player = players.find((p) => p.profileId === playerProfileId);
          if (player) {
            resolve(player);
          } else {
            reject(`could not find player with profile id: ${playerProfileId}`);
          }
        })
        .catch((error) => reject(error));
    });
  }

  public AddNewPlayer(inPlayer: DexieSteamPlayerProfileModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.PutPlayer(inPlayer)
        .then((response) => {
          this.FetchPlayers().finally(() => {
            resolve(response);
          });
        })
        .catch((error) => {
          reject(error);
        });
    });
  }

  public AddUpdatePlayerData(inPlayer: DexieSteamPlayerProfileModel): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      this.GetAllPlayersFromDexieDB()
        .then((players) => {
          const oldPlayer = players.find((p) => p.uuid === inPlayer.uuid);
          if (oldPlayer) {
            inPlayer.id = oldPlayer.id;
            this.UpdatePlayer(inPlayer)
              .then((response) => {
                this.FetchPlayers().finally(() => {
                  resolve(response);
                });
              })
              .catch((error) => {
                reject(error);
              });
          } else {
            this.PutPlayer(inPlayer)
              .then((response) => {
                this.FetchPlayers().finally(() => {
                  resolve(response);
                });
              })
              .catch((error) => {
                reject(error);
              });
          }
        })
        .catch((error) => {
          reject(error);
        });
    });
  }
}

export default PlayerProvider;
