import { MissionBagEntryModel } from '@/models/Mission/MissionBagEntryModel';

function GetEventType(inItem: MissionBagEntryModel): string {
  switch (inItem.category) {
    case null:
      break;

    default:
      break;
  }
  return '';
}

export default GetEventType;
