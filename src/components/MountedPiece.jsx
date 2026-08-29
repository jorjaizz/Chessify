const KNIGHT_PATHS = (
  <>
    <path
      d="M 22,10 C 32.5,11 38.5,18 38,39 L 15,39 C 15,30 25,32.5 23,18"
      style={{ fill: 'inherit', stroke: '#000000' }}
    />
    <path
      d="M 24,18 C 24.38,20.91 18.45,25.37 16,27 C 13,29 13.18,31.34 11,31 C 9.958,30.06 12.41,27.96 11,28 C 10,28 11.19,29.23 10,30 C 9,30 5.997,31 6,26 C 6,24 12,14 12,14 C 12,14 13.89,12.1 14,10.5 C 13.27,9.506 13.5,8.5 13.5,7.5 C 14.5,6.5 16.5,10 16.5,10 L 18.5,10 C 18.5,10 19.28,8.008 21,7 C 22,7 22,10 22,10"
      style={{ fill: 'inherit', stroke: '#000000' }}
    />
    <path
      d="M 9.5 25.5 A 0.5 0.5 0 1 1 8.5,25.5 A 0.5 0.5 0 1 1 9.5 25.5 z"
      style={{ fill: '#000000', stroke: '#000000' }}
    />
    <path
      d="M 15 15.5 A 0.5 1.5 0 1 1 14,15.5 A 0.5 1.5 0 1 1 15 15.5 z"
      transform="matrix(0.866,0.5,-0.5,0.866,9.693,-5.173)"
      style={{ fill: '#000000', stroke: '#000000' }}
    />
  </>
)

const PAWN_PATH =
  'm 22.5,9 c -2.21,0 -4,1.79 -4,4 0,0.89 0.29,1.71 0.78,2.38 C 17.33,16.5 16,18.59 16,21 c 0,2.03 0.94,3.84 2.41,5.03 C 15.41,27.09 11,31.58 11,39.5 H 34 C 34,31.58 29.59,27.09 26.59,26.03 28.06,24.84 29,23.03 29,21 29,18.59 27.67,16.5 25.72,15.38 26.21,14.71 26.5,13.89 26.5,13 c 0,-2.21 -1.79,-4 -4,-4 z'

export default function MountedPiece({ color }) {
  const fill = color === 'w' ? '#ffffff' : '#555555'
  return (
    <div style={{ position: 'relative', width: '100%', height: '100%', pointerEvents: 'none' }}>
      <svg viewBox="0 0 45 45" style={{ width: '100%', height: '100%', fill }}>
        <g style={{ strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' }}>
          {KNIGHT_PATHS}
        </g>
      </svg>
      <svg
        viewBox="0 0 45 45"
        style={{
          position: 'absolute',
          top: '10%',
          left: '30%',
          width: '40%',
          height: '40%',
          fill,
          filter: 'drop-shadow(0 1px 0 rgba(0,0,0,0.6))',
        }}
      >
        <path
          d={PAWN_PATH}
          style={{ fill: 'inherit', stroke: '#000000', strokeWidth: 1.5, strokeLinecap: 'round' }}
        />
      </svg>
    </div>
  )
}