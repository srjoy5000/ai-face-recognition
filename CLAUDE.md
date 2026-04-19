# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # Start dev server (Vite HMR)
npm run build      # Production build → dist/
npm run preview    # Preview production build locally
npm run lint       # ESLint check
npm run deploy     # Build and deploy to GitHub Pages (gh-pages -d dist)
```

No test suite is configured.

## Architecture

React 19 class-component SPA (no router — routing is handled via `route` state in `App`). Three routes: `signIn`, `register`, `home`.

**State lives entirely in `App`** (`src/App.jsx`). Child components receive callbacks as props; none hold meaningful state except form inputs in `SignIn` and `Register`.

### Face detection

The original Clarifai API has been replaced with **MediaPipe Tasks Vision** (`@mediapipe/tasks-vision`). `App.getOrCreateFaceDetector()` lazily initialises a singleton `FaceDetector` (GPU delegate, `blaze_face_full_range` model loaded from CDN). `calcFaceLocation` loads the image via a hidden `Image` element (with `crossOrigin: "anonymous"`), runs detection, then scales bounding boxes to the fixed 500 px render width used by `FaceRecognition`.

Bounding-box format stored in `bboxes` state:
```js
{ leftCol, topRow, rightCol, bottomRow }  // CSS absolute offsets in pixels
```

### Backend API

`baseURL = "https://ai-face-recognition-api.onrender.com/"` (separate Node/Express repo). Endpoints used:
- `POST /signin` — returns user object
- `POST /register` — returns user object  
- `PUT /image` — increments entry count, returns new count

The backend is **not** in this repo. Both `SignIn` and `Register` hardcode the same `baseURL`.

### Styling

Tachyons utility classes + per-component CSS files. `particles-bg` renders a full-page cobweb particle background. `react-parallax-tilt` is used on the Logo card.

### Deployment

Deployed to GitHub Pages at `https://srjoy5000.github.io/ai-face-recognition/` via the `gh-pages` package. Vite's `base` must stay compatible with that path if changed.
