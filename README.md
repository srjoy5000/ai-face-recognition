# Face Detector App

> Try Face Detection with ease.

## 🌐 Live Demo

[https://srjoy5000.github.io/ai-face-recognition/](https://srjoy5000.github.io/ai-face-recognition/)

---

## 🚀 Key Features

- **Core Functionality**: Paste any public image URL and the AI model draws bounding boxes around every detected face
- **UI/UX**: Responsive and mobile-friendly design with animated particle background

## 🛠 Tech Stack

| Category     | Tools & Technologies                                                                                                                                                                                                |
| :----------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![JS](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)       |
| **Backend**  | ![Node](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express](https://img.shields.io/badge/express.js-000000?style=for-the-badge&logo=express&logoColor=white) |
| **Database** | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)                                                                                                   |
| **CI/CD**    | ![GitHub Actions](https://img.shields.io/badge/GitHub_Actions-2088FF?style=for-the-badge&logo=github-actions&logoColor=white)                                                                                       |

---

## 📂 Project Structure

```
./
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions: build & deploy to GitHub Pages
├── src/
│   ├── components/
│   │   ├── facerecognition/    # Renders image + absolute-positioned bounding boxes
│   │   ├── imagelinkform/      # URL input + Detect button
│   │   ├── logo/               # Tilt-animated brain logo card
│   │   ├── navigation/         # Sign In / Sign Out / Register nav links
│   │   ├── rank/               # Displays user name and entry count
│   │   ├── Register/           # Registration form (calls POST /register)
│   │   └── SignIn/             # Sign-in form (calls POST /signin)
│   ├── App.jsx                 # Root component — owns all state & routing logic
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── index.html
├── vite.config.js
├── eslint.config.js
├── package.json
└── README.md
```

## 🏁 Quick Start

### Prerequisites

- Node.js v18+

### Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/srjoy5000/ai-face-recognition.git
   cd ai-face-recognition
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Run the app:**
   ```bash
   npm run dev
   ```

No environment variables are required — the backend API is publicly hosted.

## 🗺️ Roadmap

- [x] User sign-up / sign-in with entry count tracking
- [x] Client-side face detection via MediaPipe (no Clarifai API dependency)
- [x] GitHub Actions deployment to GitHub Pages
- [ ] Loading states during sign-in, register, and face detection
- [ ] User-visible error messages on API failures
- [ ] Image file upload support (in addition to URL input)

## 📄 License

This project is licensed under the MIT License.

---

**Developed by srjoy5000**  
[GitHub](https://github.com/srjoy5000)
