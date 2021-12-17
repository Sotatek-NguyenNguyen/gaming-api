import { ApiProperty } from '@nestjs/swagger';

export class GameInfoBaseResponse {
  @ApiProperty({ example: 'Axie Infinity' })
  name: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  videoIntroURL: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  logoURL: string;

  @ApiProperty({
    example: 'https://cdn.axieinfinity.com/landing-page/_next/static/images/logo-f3b5c962671a2516bc9fef42ad9e9145.webp',
  })
  backgroundURL: string;

  @ApiProperty({
    example: `Axie is a new type of game, partially owned and operated by its players. Earn AXS tokens by playing and use them to decide the future of the game!`,
  })
  description: string;

  @ApiProperty({ example: 'https://axieinfinity.com/' })
  gameURL: string;
}

// GAME INFO
// - name
// - videoIntroURL
// - logoURL
// - backgroundURL
// - description
// - gameURL

// currencyCode
// currencyName

// walletAddress
//