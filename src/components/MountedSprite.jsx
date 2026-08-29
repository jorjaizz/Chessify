import SpritePiece from './SpritePiece.jsx'
import { spriteSrc } from './pieceSprites.js'

export default function MountedSprite({ color, pixelated = true }) {
  const knight = spriteSrc(color, 'n')
  const pawn = spriteSrc(color, 'p')
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {knight && <SpritePiece src={knight} pixelated={pixelated} />}
      {pawn && (
        <div
          style={{
            position: 'absolute',
            top: '-16%',
            left: '24%',
            width: '52%',
            height: '52%',
            pointerEvents: 'none',
          }}
        >
          <SpritePiece src={pawn} pixelated={pixelated} />
        </div>
      )}
    </div>
  )
}