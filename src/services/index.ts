import AttributesXmlProvider from './AttributesXmlProvider';
import LoggerProvider from './LoggerProvider';
import SteamProvider from './SteamProvider';

export const SteamService = SteamProvider.getInstance();
export const LoggerService = LoggerProvider.getInstance();
export const AttributesXmlService = AttributesXmlProvider.getInstance();
