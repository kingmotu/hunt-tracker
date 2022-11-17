import AttributesXmlProvider from './AttributesXmlProvider';
import LoggerProvider from './LoggerProvider';
import MissionProvider from './MissionProvider';
import PlayerProvider from './PlayerProvider';
import ProfileProvider from './ProfileProvider';
import SettingsProvider from './SettingsProvider';
import SteamProvider from './SteamProvider';

export const SteamService = SteamProvider.getInstance();
export const LoggerService = LoggerProvider.getInstance();
export const AttributesXmlService = AttributesXmlProvider.getInstance();
export const ProfileService = ProfileProvider.getInstance();
export const SettingsService = SettingsProvider.getInstance();
export const MissionService = MissionProvider.getInstance();
export const PlayerService = PlayerProvider.getInstance();
