# 15 Puzzle - TODO

## Features Implemented

### Color Themes (COMPLETE)
- Random but coherent color palettes for tiles and UI elements
- Preset themes (e.g., Neon, Pastel, Retro, Ocean)
- Theme preview or live preview while hovering
- Hidden for now (surfaced via cube UI)

### Focus Mode (COMPLETE)
- "Compact Mode" / "Focus Mode" that hides stats and controls
- Only the board is visible during gameplay
- Stats revealed on solve or when exiting focus mode
- Keyboard shortcut to toggle (`F`)

### 3D Cube Navigation (NEW - COMPLETE)
- Help page, Game page, Themes page in 3D cube layout
- Navigation via `?` (Help), `T` (Themes), arrow keys
- Return via `ESC` or `ENTER`
- Smooth 3D rotation transition
- Large theme swatches on Themes page

### Game States (COMPLETE)
- **Idle**: Fresh load, no game started. ENTER starts game.
- **Playing**: Game in progress. Arrow keys move tiles.
- **Paused**: Game existed but stopped. ESC/ENTER resumes. Tiles blurred.
- **Won**: Puzzle solved. Confetti + banner.

---

## Features to Implement

### Variable Board Dimensions
- Support for different grid sizes: 3x3, 4x4, 4x6, 5x5, etc.
- Dynamic board sizing
- Dimension selector in UI (could be another cube face?)

### High Score List
- Top 10 entries per dimension
- Two separate lists: one by moves, one by time
- Local storage persistence
- Display best score next to current stats

---

*Last updated: 2026-03-19*
