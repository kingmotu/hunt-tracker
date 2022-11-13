export interface IXmlEntrieModel {
  name: string;
  value?: string;
}

export class XmlEntrieModel implements IXmlEntrieModel {
  public name: string;
  public value?: string;

  constructor();
  constructor(obj: IXmlEntrieModel);
  // eslint-disable-next-line
  constructor(obj?: any) {
    this.name = (obj && obj.name) || '';
    if (obj && obj.value) {
      this.value == obj.value;
    }
  }
}
