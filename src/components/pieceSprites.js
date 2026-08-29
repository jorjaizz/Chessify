import alfilBlanco from '../assets/sprites/PiezasBlancas/alfilblanco.gif'
import caballoBlanco from '../assets/sprites/PiezasBlancas/caballoblanco.gif'
import reyBlanco from '../assets/sprites/PiezasBlancas/kingerblanco.gif'
import peonBlanco from '../assets/sprites/PiezasBlancas/Peonblanco.gif'
import reinaBlanca from '../assets/sprites/PiezasBlancas/reinablanca.gif'
import torreBlanca from '../assets/sprites/PiezasBlancas/torreblanca.gif'

import alfilCafe from '../assets/sprites/PiezasCafé/alfilcafe.gif'
import caballoCafe from '../assets/sprites/PiezasCafé/caballocafe.gif'
import reyCafe from '../assets/sprites/PiezasCafé/kingercafe.gif'
import peonCafe from '../assets/sprites/PiezasCafé/Peoncafe.gif'
import reinaCafe from '../assets/sprites/PiezasCafé/reinacafe.gif'
import torreCafe from '../assets/sprites/PiezasCafé/torrecafe.gif'

export const SETS = {
  cafe: { k: reyCafe, q: reinaCafe, r: torreCafe, b: alfilCafe, n: caballoCafe, p: peonCafe },
  blanco: { k: reyBlanco, q: reinaBlanca, r: torreBlanca, b: alfilBlanco, n: caballoBlanco, p: peonBlanco },
}

// Power-activated sprite variants (placeholders for now - update with actual sprite paths when available)
export const POWER_SPRITES = {
  faithful_prayer: { b: null }, // Placeholder: bishop praying sprite
  rook_skip: { r: null }, // Placeholder: rook jumping sprite
  horseride: { p: null }, // Placeholder: mounted pawn sprite
  kick: { n: null }, // Placeholder: knight kicking sprite
}

export function setFor(color) {
  if (color === 'b') return SETS.cafe
  if (color === 'w') return SETS.blanco
  return null
}

export function spriteSrc(color, type) {
  const set = setFor(color)
  return set ? set[type] : null
}

/**
 * Get the sprite source for a piece with an activated power
 * Returns the power variant sprite if available, otherwise returns the base sprite
 * @param {string} color - 'b' or 'w'
 * @param {string} type - piece type ('p', 'n', 'b', 'r', 'q', 'k')
 * @param {string} powerId - the ID of the activated power
 * @returns {string|null} sprite source URL or null
 */
export function spriteWithPower(color, type, powerId) {
  // Only show power sprites for black pieces (brown sprites available)
  if (color !== 'b') return spriteSrc(color, type)
  
  const powerSprites = POWER_SPRITES[powerId]
  if (!powerSprites) return spriteSrc(color, type)
  
  const powerVariant = powerSprites[type]
  // If power variant exists, use it; otherwise use base sprite
  return powerVariant || spriteSrc(color, type)
}