# Quick Reference: Adding Power Sprites

When you have the sprite images ready, follow these simple steps:

## Step 1: Import Sprite
In `src/components/pieceSprites.js`, add at the top:

```javascript
// Your new sprite images
import bishopPrayingSprite from '../assets/sprites/bishop_praying.gif'
import rookJumpingSprite from '../assets/sprites/rook_jumping.gif'
import pawnMountedSprite from '../assets/sprites/pawn_mounted.gif'
import knightKickingSprite from '../assets/sprites/knight_kicking.gif'
```

## Step 2: Update POWER_SPRITES Map
In the same file, update:

```javascript
export const POWER_SPRITES = {
  faithful_prayer: { b: bishopPrayingSprite },    // Bishop praying
  rook_skip: { r: rookJumpingSprite },             // Rook jumping
  horseride: { p: pawnMountedSprite },             // Pawn mounted
  kick: { n: knightKickingSprite },                // Knight kicking
}
```

## Done!
The sprite system will automatically:
1. Detect when a power is used
2. Look up the corresponding sprite in `POWER_SPRITES`
3. Display the power variant sprite instead of the base sprite
4. Revert to normal sprite when power is no longer active

---

## File Locations
- **Sprite imports**: `src/components/pieceSprites.js` (top of file)
- **Power sprites map**: `src/components/pieceSprites.js` (lines 13-18)
- **Sprite assets folder**: `src/assets/sprites/PiezasCafé/`

## Example with Current Structure

If you add sprite images to the PiezasCafé folder:
- `src/assets/sprites/PiezasCafé/alfilOrando.gif` (bishop praying)
- `src/assets/sprites/PiezasCafé/torreSaltando.gif` (rook jumping)

Then update:

```javascript
import alfil from '../assets/sprites/PiezasCafé/alfilcafe.gif'
import alfilOrando from '../assets/sprites/PiezasCafé/alfilOrando.gif'  // NEW
import torre from '../assets/sprites/PiezasCafé/torrecafe.gif'
import torreSaltando from '../assets/sprites/PiezasCafé/torreSaltando.gif'  // NEW
// ... rest of imports

export const POWER_SPRITES = {
  faithful_prayer: { b: alfilOrando },    // NEW
  rook_skip: { r: torreSaltando },        // NEW
  horseride: { p: null },                 // Not implemented yet
  kick: { n: null },                      // Not implemented yet
}
```

That's it! No other changes needed.
