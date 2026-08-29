# Chessify Powers Guide

## Overview
This guide documents the power abilities system in Chessify and how to add or modify powers.

## Implemented Powers

### 1. Faithful Prayer (Rezo Feligrez) 🙏
**Piece**: Bishop (b)  
**Type**: Secret divine intervention

#### Mechanics
- Bishop prays in secret to invoke God's wrath
- **Success Rate**: 15% (configurable) - can be modified for testing
- **Effect**: If prayer succeeds, a random enemy piece dies (not necessarily the one targeted)
- **Victory**: Can kill the enemy King, triggering game over
- **Failure**: Prayer goes unanswered, no effect

#### Implementation Location
- Logic: `src/game/powers.js` (lines 110-155)
- Messages: `src/game/messages.js` (PRAYER_LINES)

#### Configuration
To adjust success rate for testing, edit `src/game/powers.js`:
```javascript
invocationChance: 0.15, // Change to 0.5 for 50%, 0.9 for 90%, etc.
```

---

### 2. Rook Skip (Tower Jump) ⬆️
**Piece**: Rook/Tower (r)  
**Type**: Tactical movement enhancement

#### Mechanics
- Tower can leap over an allied piece directly in its path
- Works in all 4 directions (up, down, left, right)
- After jumping ally, tower can land on any empty square or capture enemy
- Unlocks new tactical possibilities by breaking through allied formations

#### Example Scenario
```
Initial:  After Rook Skip:
  ♜       ♜ (moves forward, 
  ♙  -->  jumping pawn)
  [ ]     ♙
          [ ]
```

#### Implementation Location
- Logic: `src/game/powers.js` (lines 157-195)
- Messages: `src/game/messages.js` (ROOK_SKIP_LINES)

---

### 3. Horse Ride (Existing) 🤠
**Piece**: Pawn (p) + Knight (n)

#### Mechanics
- Pawn mounts allied Knight to become centaur-like unit
- Moves like a Knight for 2 turns
- After 2 turns, unmounts: Knight stays put, Pawn ejects to nearest empty square
- Powerful early-game mobility boost

---

### 4. Kick (Existing) 🦵
**Piece**: Knight (n)

#### Mechanics
- Knight rears up and kicks enemy pieces within its circle (8 jump positions + 8 adjacent)
- Destroys target piece and lunges 1 square toward impact point
- Enables off-board captures

---

## Power System Architecture

### File Structure
```
src/game/
  ├── powers.js          # Power definitions & logic
  ├── messages.js        # Flavor text for powers
  ├── engine.js          # State & move execution
  └── constants.js       # Board constants

src/components/
  ├── GameScreen.jsx     # UI integration
  └── pieceSprites.js    # Sprite management
```

### Power Object Structure
Each power is an object with:

```javascript
{
  id: 'power_id',                      // Unique identifier
  name: 'POWER NAME',                  // Display name
  icon: '🎯',                          // Emoji icon
  pieceTypes: ['p'],                   // Applicable piece types
  blurb: 'Short description...',       // Brief explanation
  details: 'Detailed rules...',        // Full mechanics explanation
  
  canUse(state, square, me) {          // Check if power available
    // Return true if this piece can use the power
  },
  
  getMoves(state, square, me) {        // Get all valid power moves
    // Return array of move objects with isPower: true
    return [
      {
        from: square,
        to: targetSquare,
        capture: boolean,
        isPower: true,
        powerId: 'power_id',
        // Optional custom fields:
        kickTarget: squareName(nr, nc), // For targeted abilities
      }
    ]
  },
  
  afterMove(state, from, to, events, me) { // Execute power effects
    // Modify state, add messages/sounds to events
    events.messages.push({ text: 'message', kind: 'power' })
    events.sounds.push('soundId')
    return events
  }
}
```

---

## Adding a New Power

### Step 1: Define Power in `src/game/powers.js`

```javascript
{
  id: 'my_power',
  name: 'MY POWER',
  icon: '🎯',
  pieceTypes: ['r'], // Rook
  blurb: 'Does something cool',
  details: 'Full explanation...',
  
  canUse(state, square, me) {
    if (!me || me.type !== 'r') return false
    if (me.color !== state.turn) return false
    // Additional conditions
    return true
  },
  
  getMoves(state, square, me) {
    if (!this.canUse(state, square, me)) return []
    const { r, c } = rcOf(square)
    const out = []
    
    // Calculate valid moves
    out.push({
      from: square,
      to: targetSquare,
      capture: false,
      isPower: true,
      powerId: this.id,
    })
    
    return out
  },
  
  afterMove(state, from, to, events, me) {
    // Execute power effects
    events.sounds.push('power_sound')
    events.messages.push({ text: pick(MY_POWER_LINES), kind: 'power' })
    return events
  }
}
```

### Step 2: Add Messages in `src/game/messages.js`

```javascript
export const MY_POWER_LINES = [
  'Message 1 🎯',
  'Message 2 ⚡',
  'Message 3 💫',
]
```

### Step 3: Add Sprite Support in `src/components/pieceSprites.js`

```javascript
export const POWER_SPRITES = {
  // ... existing powers
  my_power: { r: null }, // Will update with actual sprite path
}
```

### Step 4: Import New Sprite Lines

In `src/game/powers.js`:
```javascript
import { HORSE_LINES, KICK_LINES, PRAYER_LINES, ROOK_SKIP_LINES, MY_POWER_LINES } from './messages.js'
```

---

## Sprite Customization

### Framework Ready
The system automatically detects when a piece has used a power and can display a different sprite.

### Adding Power Sprites

1. **Create or obtain sprite images** for power-activated states
2. **Import in `pieceSprites.js`**:
   ```javascript
   import bishopPraying from '../assets/sprites/bishop_praying.gif'
   ```

3. **Update `POWER_SPRITES` map**:
   ```javascript
   export const POWER_SPRITES = {
     faithful_prayer: { b: bishopPraying },
     rook_skip: { r: rookJumping },
     // ...
   }
   ```

4. **Test**: Sprite changes automatically when power is used

### Current Status
- ✅ System implemented
- ⏳ Placeholder sprites in place
- 📝 Ready for actual sprite paths when available

---

## Testing Powers

### Manual Testing
1. Start new game
2. Select piece with available power
3. Grab power pill (shows available moves)
4. Drop on valid target
5. Observe:
   - Sprite change (when sprites added)
   - Message display
   - Sound playback
   - Game state update

### Debugging
- Check console for error messages
- Verify `game.powerUsed` Map in React DevTools
- Monitor `state.board` for piece changes

---

## State Management

### Power Tracking
```javascript
// In game state:
powerUsed: new Map() // square -> powerId

// Example after using faithful_prayer at e4:
powerUsed.set('e4', 'faithful_prayer')

// Checking if piece used power:
const powerId = game.powerUsed.get('e4') // Returns 'faithful_prayer' or undefined
```

### State Transitions
- Powers are tracked through moves
- Sprite system queries `game.powerUsed` for each piece
- State properly cloned during move transitions

---

## Modifying Existing Powers

### Prayer Success Rate
Edit `src/game/powers.js` line ~115:
```javascript
invocationChance: 0.15, // Change this (0.0 to 1.0)
```

### Messages
Edit corresponding lines in `src/game/messages.js`:
```javascript
export const PRAYER_LINES = {
  success: ['New success message 🎉', ...],
  fail: ['New failure message 😔', ...],
}
```

### Movement Rules
Modify `getMoves()` method in power definition:
- Add/remove valid landing squares
- Change capture rules
- Adjust range or direction

---

## Common Issues

### Power Not Appearing
- ✓ Check `canUse()` returns true
- ✓ Verify piece type in `pieceTypes`
- ✓ Ensure it's the correct player's turn (`me.color === state.turn`)

### Wrong Piece Captured
- ✓ Check `getMoves()` is returning correct target
- ✓ Verify capture logic in `afterMove()`
- ✓ Check for "merge" or special cases in `engine.js`

### Sprite Not Changing
- ✓ Verify sprite paths in `POWER_SPRITES`
- ✓ Check `powerUsed.set()` is called in engine
- ✓ Ensure piece is actually moving to the new square

---

## Notes for Development

- All powers must return from `getMoves()` before they can be executed
- The `isPower: true` flag distinguishes power moves from regular moves
- `afterMove()` is called after basic move execution but before mounting/dismounting logic
- Power visual feedback (sprites) is automatic once sprites are provided

---

For questions or changes, refer to the implementation files or create an issue with your use case.
