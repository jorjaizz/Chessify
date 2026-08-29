import alfil from '../assets/sprites/PiezasCafé/alfilcafe.gif'
import caballo from '../assets/sprites/PiezasCafé/caballocafe.gif'
import rey from '../assets/sprites/PiezasCafé/kingercafe.gif'
import peon from '../assets/sprites/PiezasCafé/Peoncafe.gif'
import reina from '../assets/sprites/PiezasCafé/reinacafe.gif'
import torre from '../assets/sprites/PiezasCafé/torrecafe.gif'

export const SETS = {
  cafe: { k: rey, q: reina, r: torre, b: alfil, n: caballo, p: peon },
}

export function setFor(color) {
  return color === 'b' ? SETS.cafe : null
}

export function spriteSrc(color, type) {
  const set = setFor(color)
  return set ? set[type] : null
}