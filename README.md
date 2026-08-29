# Chessify

Chess. The f*ck up edition.

Hot-seat chaos chess for the **Out of the box** hackathon track. There's no check, no checkmate, no mercy: **capture the King and win**. Every piece will eventually kill the King its own way.

## Play

```
pnpm install
pnpm dev
```

Move pieces by **drag & drop** **or** by **clicking** (piece → target square).

## Test the engine

Pure logic, no browser needed:

```
pnpm test
```

## Stack

- Vite + React 18
- react-chessboard 4 (drag & drop board)
- Tailwind CSS 4
- Framer Motion (animations)
- Web Audio API (synthesized SFX, no asset files)

## Architecture (read this before coding)

- `src/game/engine.js` — custom mini-engine. Board is an 8x8 array of `{type,color}`. No castling / en passant / check rules. `getMoves(state, square)` → legal moves; `applyMove(state, from, to, move)` → new immutable-ish state + `{sounds, messages}` events.
- `src/game/powers.js` — each power is a module with `canUse`, `getMoves`, `afterMove`. To add a power: add one entry here, nothing else.
- `src/game/constants.js` — square math, deltas, piece codes.
- `src/game/messages.js` — every funny line in the game lives here.
- `src/game/sound.js` — `sfx.move()`, `sfx.capture()`, `sfx.power()`, `sfx.victory()`...
- `src/components/GameScreen.jsx` — board wiring (drag & drop → engine) and square highlighting (neon = power move).

Power idea bank for the hackathon: **Amen** (bishop prays, a piece on its diagonal dies), **Demolition** (rook pushes pieces like a bulldozer), **Tantrum** (queen flings attackers 2 squares away when targeted), **Catapult** (knight launches allies).

## Layout

```
Menu → GameScreen (hot-seat) → GameOver (THE KING IS DEAD)
```