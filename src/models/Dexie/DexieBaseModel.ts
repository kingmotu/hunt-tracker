export interface IDexieBaseModel {
  id?: number;
}

export class DexieBaseModel implements IDexieBaseModel {
  public id?: number;

  constructor();
  constructor(obj: IDexieBaseModel);
  constructor(obj?: any) {
    this.id = obj && obj.id != null ? obj.id : undefined;
  }
}
