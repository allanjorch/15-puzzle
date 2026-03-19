# 15 Puzzle Game

A classic sliding puzzle game (also known as the 15-puzzle) implemented in vanilla HTML, CSS, and JavaScript.

## Overview

The 15 Puzzle is a sliding tile puzzle that consists of a 4x4 grid with 15 numbered tiles and one empty space. The objective is to arrange the tiles in numerical order by sliding them into the empty space.

## Features

### Current Implementation
- **4x4 Grid**: Classic 15-tile puzzle layout
- **Smooth Animations**: Tiles glide smoothly into place with CSS transitions
- **3D Cube Navigation**: Help and Themes pages accessible via cube rotation with chevron buttons and arrow keys
- **Minimal UI**: Clean, distraction-free interface — only the board and nav controls visible during play
- **Multiple Input Methods**:
  - Click tiles adjacent to the empty space
  - Arrow keys (Left, Right, Up, Down) to slide tiles
- **Game Controls**:
  - Play/Pause button (or `P`) to start/pause the game
  - `N` to shuffle and start a new game
- **Stats Tracking** (shown on win):
  - Move counter
  - Timer (pauses when game is paused)
- **Win Detection**: Automatically detects when puzzle is solved
- **Celebration**: Confetti animation on completion
- **Color Themes**: 5 preset themes (Teal, Neon, Pastel, Retro, Ocean) + Random palette generator

### Game States
1. **Idle**: Fresh start, no game active. Play button or ENTER starts new game.
2. **Playing**: Timer running, moves being counted, tiles interactive
3. **Paused**: Game exists but stopped. Tiles blurred. Play button or ENTER resumes.
4. **Won**: Puzzle solved. Confetti + banner.

### Cube Navigation
The game features a 3D cube interface with three faces accessed via chevron buttons or arrow keys:
- **Help** (left): Instructions and controls
- **Game** (center): The puzzle board
- **Themes** (right): Theme selector with large preview swatches

## Controls

| Key | On Game Page (Idle/Paused) | On Game Page (Playing) | On Help/Themes Page |
|-----|---------------------------|------------------------|---------------------|
| `←` `→` Arrow Keys | Navigate cube | Move tiles | Navigate cube |
| `↑` `↓` Arrow Keys | Navigate cube | Move tiles | — |
| `?` | Go to Help | — | — |
| `T` | Go to Themes | — | — |
| `ENTER` / `ESC` | Start / Resume game | — | Return to Game |
| `P` | Pause / Resume | Pause / Resume | — |
| `N` | New game | — | — |

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
