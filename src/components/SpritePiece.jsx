export default function SpritePiece({ src, pixelated = true }) {
  return (
    <img
      src={src}
      alt=""
      draggable={false}
      style={{
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        imageRendering: pixelated ? 'pixelated' : 'auto',
        userSelect: 'none',
        pointerEvents: 'none',
      }}
    />
  )
}