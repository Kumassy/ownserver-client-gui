const ENTRY_GAME = 'entry.665497736'
const ENTRY_OS = 'entry.581420414'
const ENTRY_APP_TYPE = 'entry.1310045396'
const ENTRY_APP_VERSION = 'entry.522632759'
const ENTRY_LOG = 'entry.2057541863'

export enum Game {
  Minecraft = 'Minecraft Java Edition',
  MinecraftBe = 'Minecraft Bedrock Edition',
  MinecraftForge = 'Minecraft Forge',
  Factorio = 'factorio',
}

export enum AppType {
  GUI = 'デスクトップアプリ, GUI',
  CLI = 'コマンド, CLI',
}

export const constructUrl = (game: Game, os: string, appType: AppType, appVersion: string, log: string) => {
  return `https://docs.google.com/forms/d/e/1FAIpQLSekB3eFJBI3bEscx1y9FjIEEVzA6hAchlAO55EKZIhbEMvFSQ/viewform?usp=pp_url&${ENTRY_GAME}=${encodeURI(game)}&${ENTRY_OS}=${encodeURI(os)}&${ENTRY_APP_TYPE}=${encodeURI(appType)}&${ENTRY_APP_VERSION}=${encodeURI(appVersion)}&${ENTRY_LOG}=${encodeURI(log)}`
}
