# 15 Puzzle Game

A classic sliding puzzle game (also known as the 15-puzzle) implemented in vanilla HTML, CSS, and JavaScript.

## Overview

The 15 Puzzle is a sliding tile puzzle that consists of a 4x4 grid with 15 numbered tiles and one empty space. The objective is to arrange the tiles in numerical order by sliding them into the empty space.

## Features

### Current Implementation
- **4x4 Grid**: Classic 15-tile puzzle layout
- **Smooth Animations**: Tiles glide smoothly into place with CSS transitions
- **Multiple Input Methods**: 
  - Click tiles adjacent to the empty space
  - Arrow keys (Left, Right, Up, Down) to slide tiles
- **Game Controls**:
  - **New Game** (`N`): Shuffles the board and starts a new game
- **Stats Tracking**:
  - Move counter
  - Timer (starts on first move)
- **Win Detection**: Automatically detects when puzzle is solved
- **Celebration**: Confetti animation on completion
- **Keyboard Navigation**: All actions accessible via keyboard

### Game States
1. **Idle**: Shows solved puzzle, no interaction allowed
2. **Playing**: Timer running, moves being counted
3. **Won**: Solved puzzle with stats, banner to dismiss

## Controls

| Input | Action |
|-------|--------|
| Arrow Keys | Move tiles |
| Click | Move adjacent tile |
| `N` | New game |
| `Enter/Escape` | Dismiss win banner |

## Technical Details

### Files
- `index.html` - Structure and layout
- `style.css` - Styling and animations
- `script.js` - Game logic and state management

### Architecture
- Pure vanilla JavaScript (no frameworks)
- CSS Grid for board layout with absolute positioning for smooth animations
- Canvas API for confetti celebration effect
- Solvability guaranteed via inversion count algorithm

## Authors

**Idea & Design**: Allan  
**Development**: Claude (AI Assistant)

---

*Built with care in a single productive session!*
