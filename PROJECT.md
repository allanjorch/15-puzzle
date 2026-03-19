# 15 Puzzle Game

A classic sliding puzzle game (also known as the 15-puzzle) implemented in vanilla HTML, CSS, and JavaScript.

## Overview

The 15 Puzzle is a sliding tile puzzle that consists of a 4x4 grid with 15 numbered tiles and one empty space. The objective is to arrange the tiles in numerical order by sliding them into the empty space.

## Features

### Current Implementation
- **4x4 Grid**: Classic 15-tile puzzle layout
- **Smooth Animations**: Tiles glide smoothly into place with CSS transitions
- **3D Cube Navigation**: Help and Theme pages accessible via cube rotation
- **Multiple Input Methods**: 
  - Click tiles adjacent to the empty space
  - Arrow keys (Left, Right, Up, Down) to slide tiles
- **Game Controls**:
  - **New Game** (`N`): Shuffles the board and starts a new game
  - **Pause** (`P`): Pause and resume the game
  - **Focus Mode** (`F`): Hide UI elements for distraction-free play
- **Stats Tracking**:
  - Move counter
  - Timer (pauses when game is paused)
- **Win Detection**: Automatically detects when puzzle is solved
- **Celebration**: Confetti animation on completion
- **Color Themes**: 5 preset themes (Teal, Neon, Pastel, Retro, Ocean) + Random

### Game States
1. **Idle**: Fresh start, no game active. ENTER starts new game.
2. **Playing**: Timer running, moves being counted, tiles interactive
3. **Paused**: Game exists but stopped. Tiles blurred. ESC/ENTER resumes.
4. **Won**: Puzzle solved. Confetti + banner.

### Cube Navigation
The game features a 3D cube interface with three faces:
- **Help**: Instructions and controls
- **Game**: The puzzle board
- **Themes**: Theme selector with large preview swatches

## Controls

| Key | On Game Page | On Help/Themes Page |
|-----|--------------|---------------------|
| Arrow Keys | Move tiles | Navigate cube |
| `?` | Go to Help | - |
| `T` | Go to Themes | - |
| `ESC/ENTER` | Pause/Resume/Start | Return to Game |
| `N` | New Game | - |
| `P` | Pause/Resume | - |
| `F` | Toggle Focus Mode | Toggle Focus Mode |

## Technical Details

### Files
- `index.html` - Structure and layout with cube faces
- `style.css` - Styling, 3D transforms, and animations
- `script.js` - Game logic, state machine, and navigation

### Architecture
- Pure vanilla JavaScript (no frameworks)
- CSS 3D transforms for cube navigation
- Absolute positioning for smooth tile animations
- Canvas API for confetti celebration effect
- Solvability guaranteed via inversion count algorithm
- LocalStorage for theme persistence

## Authors

**Idea & Design**: Allan  
**Development**: Claude (AI Assistant)

---

*Built with care!*
