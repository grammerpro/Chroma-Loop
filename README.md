# Chroma Loop

[![CI](https://github.com/grammerpro/chroma_loop/actions/workflows/ci.yml/badge.svg)](https://github.com/grammerpro/chroma_loop/actions/workflows/ci.yml)
[![Pages](https://github.com/grammerpro/chroma_loop/actions/workflows/pages.yml/badge.svg)](https://github.com/grammerpro/chroma_loop/actions/workflows/pages.yml)

Rotate a colored ring to catch falling drops that match the sector color. Easy to learn, quick sessions, satisfying streaks.

## Features

- **Core Gameplay**: Rotate the ring to match colors, build streaks, avoid mismatches.
- **Modes**: Daily mode with seeded runs, endless mode.
- **Controls**: Drag/touch or arrow keys to rotate, optional snap to sectors.
- **Polish**: Audio feedback, slow motion on stars, tutorial on first run.
- **Accessibility**: Colorblind palette, reduced motion, keyboard navigation.
- **Offline**: PWA with service worker for offline play.

## Controls

- **Drag/Touch**: Rotate the ring smoothly.
- **Arrow Keys**: Rotate left/right.
- **Settings**: Toggle snap, colorblind mode, reduced motion, audio.

## How to Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## How to Build

```bash
npm run build
```

## How to Test

```bash
npm run test
```

## How to Lint and Format

```bash
npm run lint
npm run format
```

## Deployment

The game is deployed to GitHub Pages at https://grammerpro.github.io/chroma_loop/.

## Daily Mode

Daily mode uses the current date as seed for deterministic gameplay. Everyone gets the same sequence each day.

## License

MIT License - see LICENSE file.