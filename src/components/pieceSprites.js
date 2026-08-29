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

export function setFor(color) {
  if (color === 'b') return SETS.cafe
  if (color === 'w') return SETS.blanco
  return null
}

export function spriteSrc(color, type) {
  const set = setFor(color)
  return set ? set[type] : null
}