# 15 Puzzle Game

A classic sliding puzzle game (also known as the 15-puzzle) implemented in vanilla HTML, CSS, and JavaScript.

## Overview

The 15 Puzzle is a sliding tile puzzle that consists of a 4x4 grid with 15 numbered tiles and one empty space. The objective is to arrange the tiles in numerical order by sliding them into the empty space.

## Features

### Current Implementation
- **4x4 Grid**: Classic 15-tile puzzle layout
- **Smooth Animations**: Tiles glide smoothly into place with CSS transitions
- **3D Cube Navigation**: Help and Themes pages accessible via chevron buttons or arrow keys
- **Minimal UI**: Clean, distraction-free interface — only the board and minimal nav controls visible
- **Recording Indicator**: Blinking red dot on the play/pause button when the game is active and timer is running
- **Multiple Input Methods**:
  - Click tiles adjacent to the empty space
  - Arrow keys (Left, Right, Up, Down) to slide tiles
- **Game Controls**:
  - `ENTER` — context-aware: starts game from idle, pauses when playing, resumes when paused
  - `ESC` — always resets to idle state
  - Play/Pause chevron button mirrors ENTER behavior
- **Stats Tracking** (shown on win):
  - Move counter
  - Timer
- **Win Detection**: Automatically detects when puzzle is solved
- **Celebration**: Confetti animation on completion with themed banner
- **Color Themes**: 5 preset themes (Teal, Neon, Pastel, Retro, Ocean) + Random palette generator

### Game States
1. **Idle**: Fresh start, no game active. Play button or ENTER starts new game.
2. **Playing**: Timer running, moves being counted, tiles interactive, recording indicator visible.
3. **Paused**: Game exists but stopped. Tiles blurred. Play button or ENTER resumes.
4. **Won**: Puzzle solved. Confetti + themed banner.

### Cube Navigation
The game features a 3D cube interface with three faces accessed via chevron buttons or arrow keys:
- **Help** (left): Instructions and controls
- **Game** (center): The puzzle board
- **Themes** (right): Theme selector with large preview swatches

## Controls

| Key | On Game Page (Idle) | On Game Page (Playing) | On Game Page (Paused) | On Help/Themes Page |
|-----|--------------------|-----------------------|-----------------------|---------------------|
| `←` `→` Arrow Keys | Navigate cube | Move tiles | Navigate cube | Navigate cube |
| `↑` `↓` Arrow Keys | — | Move tiles | — | — |
| `ENTER` | Start game | Pause | Resume | Return to Game |
| `ESC` | — | Reset | Reset | Return to Game |

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
