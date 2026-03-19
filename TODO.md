# 15 Puzzle - TODO

## Features Implemented

### Color Themes (COMPLETE)
- Random but coherent color palettes for tiles and UI elements
- Preset themes (Teal, Neon, Pastel, Retro, Ocean)
- Random palette generator
- Accessible via Themes cube face with large swatches

### Minimal UI (COMPLETE)
- Clean, distraction-free interface — only the board and nav controls visible during play
- Recording indicator (blinking red dot) when game is active
- Stats hidden until win

### 3D Cube Navigation (COMPLETE)
- Help page, Game page, Themes page in 3D cube layout
- Navigation via chevron buttons or arrow keys
- Smooth 3D rotation transition
- Large theme swatches on Themes page

### Game States (COMPLETE)
- **Idle**: Fresh load, no game active. ENTER starts game.
- **Playing**: Game in progress. Timer running, recording indicator visible.
- **Paused**: Game stopped. Tiles blurred. ENTER resumes.
- **Won**: Puzzle solved. Confetti + themed banner.

### Recording Indicator (COMPLETE)
- Blinking red dot centered on play/pause button
- Visible only while timer is actively running (not when paused, won, or idle)
- Mirrors play/pause icon — hides icon while visible

### Themed Win Banner (COMPLETE)
- Banner adopts active theme colors (background, accent)
- Updates live when theme changes

---

## Features to Implement

### Variable Board Dimensions
- Support for different grid sizes: 3x3, 4x4, 4x6, 5x5, etc.
- Dynamic board sizing
- Dimension selector in UI

### High Score List
- Top 10 entries per dimension
- Two separate lists: one by moves, one by time
- Local storage persistence
- Display best score next to current stats

### Multi-tile Mouse Dragging
- Drag multiple adjacent tiles at once toward the empty space
- Smooth drag-and-drop interaction

### Circular Navigation
- Navigate from Help page directly to Themes page (and vice versa)
- Horizontal wrap-around navigation

---

*Last updated: 2026-03-19*
