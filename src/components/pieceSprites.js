import alfil from '../assets/sprites/PiezasCafé/alfilcafe.gif'
import caballo from '../assets/sprites/PiezasCafé/caballocafe.gif'
import rey from '../assets/sprites/PiezasCafé/kingercafe.gif'
import peon from '../assets/sprites/PiezasCafé/Peoncafe.gif'
import reina from '../assets/sprites/PiezasCafé/reinacafe.gif'
import torre from '../assets/sprites/PiezasCafé/torrecafe.gif'

export const SETS = {
  cafe: { k: rey, q: reina, r: torre, b: alfil, n: caballo, p: peon },
}

// Power-activated sprite variants (placeholders for now - update with actual sprite paths when available)
export const POWER_SPRITES = {
  faithful_prayer: { b: null }, // Placeholder: bishop praying sprite
  rook_skip: { r: null }, // Placeholder: rook jumping sprite
  horseride: { p: null }, // Placeholder: mounted pawn sprite
  kick: { n: null }, // Placeholder: knight kicking sprite
}

export function setFor(color) {
  return color === 'b' ? SETS.cafe : null
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