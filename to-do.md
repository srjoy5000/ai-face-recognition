# SmartBrain — Project To-Do

## Bugs to Fix

### 1. Typo: `type="tex"` in `ImageLinkForm`
**File:** `src/components/imagelinkform/ImageLinkForm.jsx:12`  
The input has `type="tex"` instead of `type="text"`. This falls back to a plain text input in most browsers but is technically invalid HTML.

### 2. Double slash in `PUT /image` URL
**File:** `src/App.jsx:165`  
`baseURL` already ends with `/`, so `` fetch(`${baseURL}/image`) `` produces `https://…onrender.com//image`. Should be `fetch(`${baseURL}image`)` (no leading slash).

### 3. `baseURL` duplicated across three files
Defined independently in `App.jsx`, `SignIn/SignIn.jsx`, and `Register/Register.jsx`. Any backend URL change requires three edits. Move to a shared `src/config.js` and import from there.

### 4. `PUT /image` is not awaited
**File:** `src/App.jsx:165–177`  
`onSubmitButton` is `async` but the `fetch(…/image)` call is fire-and-forget (no `await`). If it fails, the entry count silently stays stale. Await it inside the existing `try/catch`.

---

## UX Improvements (from in-code To-Dos)

### 5. Loading state during sign-in / register
No visual feedback while the API call is in flight. Add a loading boolean to `SignIn` and `Register` state; disable the submit button and show a spinner or "Loading…" label while `fetch` is pending.

### 6. Loading state during face detection
`onSubmitButton` is async but the UI gives no indication the model is running. Add a loading flag to `App` state and show a loading indicator in `ImageLinkForm` (or overlay) while `calcFaceLocation` runs.

### 7. No feedback when no faces are detected
If `calcFaceLocation` returns an empty array, nothing happens on screen. Show a message like "No faces detected." near the image.

### 8. No feedback on API errors (sign-in / register)
`onSubmitSignIn` and `onSubmitSignUp` silently do nothing if the server returns an error or `user.id` is absent. Surface an error message (e.g. "Invalid credentials") to the user.

### 9. Image upload support
Currently only URL input is supported. Add a file input so users can upload images from their device. The uploaded file would need to be converted to an `HTMLImageElement` or blob URL before passing to `FaceDetector.detect()`.

### 10. Random face image fetch
Optional stretch feature: add a button that fetches a random face image URL (e.g. from a public dataset API) and pre-fills the URL input.

---

## Code Quality

### 11. Remove dead commented-out code (old Clarifai API)
**File:** `src/App.jsx:69–158`  
Large blocks of the original Clarifai-based `faceLocation` and `onSubmitButton` are commented out. They are no longer needed and add noise; delete them.

### 12. Migrate class components to hooks
`App`, `SignIn`, and `Register` use the class component API. React's current best practice is function components with hooks. This is a refactor, not a bug, but it would make the codebase consistent and easier to extend.

---

## Deployment Note

`vite.config.js` must have `base: '/ai-face-recognition/'` set for GitHub Pages deployment. Verify this matches the `homepage` in `package.json` (`https://srjoy5000.github.io/ai-face-recognition/`) before running `npm run deploy`.
