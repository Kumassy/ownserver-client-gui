export type GameId = 'custom' | 'http' | 'minecraft' | 'minecraft_be' | 'minecraft_forge' | 'factorio'
export type Protocol = 'tcp' | 'udp'
export type EndpointClaim = {
  protocol: Protocol,
  port: number
}
export type EndpointClaims = Array<EndpointClaim>

export function toLocalPort(game: GameId): number {
  switch(game) {
    case 'custom':
      return 3010
    case 'http':
      return 80
    case 'minecraft':
      return 25565
    case 'minecraft_be':
      return 19132
    case 'minecraft_forge':
      return 25565
    case 'factorio':
      return 34197
  }
}
