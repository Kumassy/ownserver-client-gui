export type GameId = 'custom' | 'http' | 'minecraft' | 'factorio'

export function toLocalPort(game: GameId): number {
  switch(game) {
    case 'custom':
      return 3010
    case 'http':
      return 80
    case 'minecraft':
      return 25565
    case 'factorio':
      return 34197
  }
}
