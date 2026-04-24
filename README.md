<div align="center">

<img src="https://img.shields.io/badge/TypeScript-99.5%25-3178C6?style=for-the-badge&logo=typescript&logoColor=white"/>
<img src="https://img.shields.io/badge/React-18%2B-61DAFB?style=for-the-badge&logo=react&logoColor=black"/>
<img src="https://img.shields.io/badge/Firebase-Firestore%20%2B%20Auth-FFCA28?style=for-the-badge&logo=firebase&logoColor=black"/>
<img src="https://img.shields.io/badge/Gemini-3.1%20Pro-4285F4?style=for-the-badge&logo=google&logoColor=white"/>
<img src="https://img.shields.io/badge/Vite-Build%20Tool-646CFF?style=for-the-badge&logo=vite&logoColor=white"/>
<img src="https://img.shields.io/badge/License-MIT-00C853?style=for-the-badge"/>

<br/><br/>

# 🧠 HireMind
### *AI-Powered Interview Practice Platform*

**HireMind simulates a real interviewer who has read your resume, understands your target role, and knows exactly what to ask — delivering instant 6-dimension AI feedback after every answer.**

<br/>

[![GitHub Stars](https://img.shields.io/github/stars/ibtesaamaslam/HireMind?style=social)](https://github.com/ibtesaamaslam/HireMind/stargazers)
&nbsp;
[![GitHub Forks](https://img.shields.io/github/forks/ibtesaamaslam/HireMind?style=social)](https://github.com/ibtesaamaslam/HireMind/network/members)
&nbsp;
[![GitHub Issues](https://img.shields.io/github/issues/ibtesaamaslam/HireMind)](https://github.com/ibtesaamaslam/HireMind/issues)

*Practice harder. Interview smarter.*

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [User Flow](#-user-flow)
- [New Session Wizard](#-new-session-wizard)
- [Active Interview Session](#-active-interview-session)
- [AI Feedback System](#-ai-feedback-system)
- [Resume Upload & Parsing](#-resume-upload--parsing)
- [Performance Dashboard](#-performance-dashboard)
- [Database Schema](#-database-schema)
- [Environment Variables](#-environment-variables)
- [Architecture Decisions](#-architecture-decisions)
- [Roadmap](#-roadmap)
- [Contributing](#-contributing)
- [Author](#-author)
- [License](#-license)

---

## 🔍 Overview

**HireMind** is a full-stack, AI-powered mock interview practice application that helps candidates prepare for technical and behavioral interviews. Users practice answering questions, receive instant AI-generated feedback across 6 scored dimensions, upload their resume so questions are personalized to their specific background, and track improvement over time via a performance dashboard.

The name **HireMind** captures the idea of tapping into an intelligent, AI-driven recruiter's mindset. The app doesn't throw random questions at you — it simulates a real interviewer who has read your resume, understands your target role and difficulty preference, and asks exactly the right questions.

> 💡 **What makes HireMind different?** Most interview prep tools give you a bank of generic questions. HireMind reads your actual resume and generates scenario-based questions about your specific projects, companies, and technologies — the same way a real technical interviewer would walk into the room having reviewed your CV.

---

## ✨ Features

### 🎙️ Core Interview Experience

- **AI-personalized questions** — Gemini 3.1 Pro reads your resume and target role to generate scenario-based questions referencing your actual experience.
- **Real-time AI feedback** — 6-dimension scored analysis delivered immediately after every answer.
- **Typewriter question display** — Questions appear with a smooth typewriter animation to simulate a real, conversational interview feel.
- **Countdown timers** — Per-question and per-session countdown clocks simulate the pressure of a real interview.
- **Side-by-side answer comparison** — Toggle between your original answer and Gemini's improved version to learn exactly what better sounds like.

### 📊 6-Dimension AI Feedback (scored 0–100)

| Dimension | What It Measures |
|-----------|-----------------|
| **Clarity** | Structure and coherence of your answer |
| **Confidence** | Assertiveness, ownership, and decisiveness |
| **Technical Depth** | Relevance and accuracy of technical content |
| **Communication** | Language quality, storytelling, and conciseness |
| **Conciseness** | Ability to be direct without unnecessary rambling |
| **Relevance** | How precisely the answer addresses the core question |

In addition to scores, every answer also receives:
- **Keywords to Improve** — filler words and weak phrases detected in your answer with suggested alternatives
- **Missing Points** — key concepts or arguments you failed to mention
- **Improved Answer** — a complete AI-rewritten version of your response

### 📄 Resume Intelligence

- Upload your PDF resume via drag-and-drop or click-to-browse.
- Text is extracted **entirely client-side** using `pdfjs-dist` — the file never leaves your browser.
- Gemini reads your resume and generates questions about specific projects, companies, technologies, and accomplishments you've listed.
- Intelligent Y-coordinate parsing handles varied PDF structures, encoding differences, and non-printable characters.

### ⚙️ Session Customization

- **Target Role Autocomplete** — Suggests common roles (Software Engineer, Product Manager, Data Scientist, etc.) as you type, with full support for custom roles.
- **Difficulty Level** — Easy, Medium, or Hard preset buttons that control question complexity and scoring expectations.
- **Optional Resume Context** — Upload your resume to go from generic questions to fully personalized ones.

### 📈 Performance Dashboard

- **Average Score card** — overall performance average across all completed sessions.
- **Performance Trend card** — direction of improvement over time.
- **Score history line chart** — session-by-session overall score plotted over time via Recharts.
- **Recent Sessions list** — past interviews with role, difficulty, date, and score.
- **AI Feedback modal** — 1–5 star rating + optional comments to improve the platform.

### 🔐 Authentication

- Google OAuth via Firebase Auth — one-click sign-in, no passwords.
- All data is scoped per user via Firestore security rules.

---

## 🧰 Tech Stack

### Frontend

| Technology | Version | Purpose |
|-----------|---------|---------|
| [React](https://react.dev/) | 18+ | UI framework |
| [TypeScript](https://www.typescriptlang.org/) | 5.x (99.5% of codebase) | End-to-end type safety |
| [Vite](https://vitejs.dev/) | Latest | Build tool and dev server |
| [Tailwind CSS](https://tailwindcss.com/) | Latest | Utility-first styling |
| [Framer Motion](https://www.framer.com/motion/) | Latest | Animations and page transitions |
| [React Router](https://reactrouter.com/) | Latest | Client-side routing |
| [Recharts](https://recharts.org/) | Latest | Score history line charts |
| [Lucide React](https://lucide.dev/) | Latest | Icon set |
| [pdfjs-dist](https://mozilla.github.io/pdf.js/) | Latest | Client-side PDF text extraction |

### Backend & AI

| Technology | Purpose |
|-----------|---------|
| [Firebase Firestore](https://firebase.google.com/docs/firestore) | Primary NoSQL database — sessions, questions, feedback |
| [Firebase Auth](https://firebase.google.com/docs/auth) | Google OAuth authentication |
| [@google/genai — Gemini 3.1 Pro](https://ai.google.dev/) | AI question generation and 6-dimension answer analysis |

---

## 🏗 System Architecture

```
┌──────────────────────────────────────────────────────────────────────┐
│                          BROWSER (Client)                            │
│                                                                      │
│  React 18 + TypeScript + Vite                                        │
│  ┌────────────────┐  ┌──────────────────┐  ┌─────────────────────┐  │
│  │  Auth Context  │  │   useAI Hook     │  │  pdfjs-dist         │  │
│  │  Firebase Auth │  │  Gemini 3.1 Pro  │  │  Client-side PDF    │  │
│  │  Google OAuth  │  │  generate/analyze│  │  parsing (no server)│  │
│  └───────┬────────┘  └────────┬─────────┘  └──────────┬──────────┘  │
│          │                   │                         │             │
│  ┌───────▼───────────────────▼─────────────────────────▼──────────┐ │
│  │                     Pages & Components                          │ │
│  │  Home · InterviewSetup · InterviewSession · Dashboard          │ │
│  └───────────────────────────────────────────────────────────────┘  │
└───────────────────┬──────────────────────┬───────────────────────────┘
                    │                      │
                    ▼                      ▼
     ┌──────────────────────┐   ┌─────────────────────────┐
     │   Firebase Firestore  │   │    Google Gemini API    │
     │  users · sessions    │   │    gemini-3.1-pro-preview│
     │  questions · feedback │   │    JSON responseSchema  │
     └──────────────────────┘   └─────────────────────────┘
```

---

## 📂 Project Structure

```
HireMind/
│
├── src/
│   ├── components/                  # Reusable UI components
│   │   ├── FeedbackModal.tsx        # 1–5 star AI rating modal
│   │   ├── Loader.tsx               # Loading spinner
│   │   ├── Navbar.tsx               # Top navigation bar
│   │   ├── ProtectedRoute.tsx       # Auth guard wrapper
│   │   ├── ResumeUpload.tsx         # PDF drag-and-drop + pdfjs parsing
│   │   └── ScoreChart.tsx           # Recharts session score line chart
│   │
│   ├── contexts/
│   │   └── AuthContext.tsx          # Firebase Auth state (useContext)
│   │
│   ├── hooks/
│   │   └── useAI.ts                 # Gemini API — generateQuestion + analyzeAnswer
│   │
│   ├── pages/
│   │   ├── Home.tsx                 # Landing page
│   │   ├── InterviewSetup.tsx       # New session wizard (role, difficulty, resume)
│   │   ├── InterviewSession.tsx     # Active interview — question + feedback
│   │   └── Dashboard.tsx            # Performance dashboard
│   │
│   ├── utils/
│   │   └── firebaseHelpers.ts       # Firestore error handling utilities
│   │
│   ├── App.tsx                      # React Router setup
│   ├── firebase.ts                  # Firebase SDK initialization
│   ├── index.css                    # Tailwind CSS imports
│   └── main.tsx                     # React DOM root mount
│
├── .env.example                     # Environment variable template
├── .gitignore
├── firebase-applet-config.json      # Firebase project config
├── firebase-blueprint.json          # Firebase resource blueprint
├── firestore.rules                  # Firestore security rules
├── index.html                       # Vite HTML entry point
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- A [Firebase Project](https://console.firebase.google.com/) with **Firestore** and **Google Auth** enabled
- A [Google Gemini API Key](https://ai.google.dev/)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ibtesaamaslam/HireMind.git
cd HireMind

# 2. Install all dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# → Fill in your Firebase and Gemini credentials (see below)

# 4. Start the development server
npm run dev
```

### Production Build

```bash
npm run build
# Output goes to dist/ — deploy to Firebase Hosting, Vercel, or Netlify
```

---

## 🔑 Environment Variables

Create a `.env` file at the project root using `.env.example` as a template:

```env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

| Variable | Where to find it |
|----------|-----------------|
| `VITE_FIREBASE_*` | Firebase Console → Project Settings → Your apps |
| `GEMINI_API_KEY` | [Google AI Studio](https://aistudio.google.com/app/apikey) |

---

## 🔄 User Flow

```
1. Visit HireMind
        ↓
2. Sign in with Google (Firebase Auth)
        ↓
3. Click "New Interview" → InterviewSetup page
        ↓
4. Select Role · Difficulty · Upload Resume (optional)
   └── PDF parsed client-side via pdfjs-dist
        ↓
5. Click "Start Interview"
   └── Session created in Firestore (status: "in-progress")
        ↓
6. Active session loads
   └── Gemini generates a personalized, scenario-based question
        ↓
7. User submits answer
   ├── Gemini analyzes → 6 dimension scores + feedback
   ├── Answer + scores saved to Firestore
   └── Feedback panel shown with side-by-side toggle
        ↓
8. "Next Question" or "End Interview"
   └── Average score computed → session status → "completed"
        ↓
9. Dashboard
   └── Score history chart · Recent sessions · Rate the AI
```

---

## 🪄 New Session Wizard

`InterviewSetup.tsx` gives users full control over their session:

- **Target Role Autocomplete** — dynamic suggestions from a preset list (Software Engineer, Product Manager, Data Scientist, DevOps Engineer, and more) while supporting fully custom role input.
- **Difficulty Level** — three toggle buttons: Easy (conceptual questions), Medium (scenario-based), Hard (deep technical + edge cases).
- **Resume Upload** — drag-and-drop PDF zone. Text is extracted via `pdfjs-dist` and stored in session state; the raw file is never uploaded to any server.

---

## 🖥 Active Interview Session

### Layout

Responsive split-panel design:

| Panel | Content |
|-------|---------|
| **Left** | Current question (typewriter effect), session timer, per-question countdown |
| **Right** | Answer textarea (during active question) or detailed feedback display (after submission) |

### Question Generation

`useAI.ts → generateQuestion()` calls `gemini-3.1-pro-preview` with a strict system prompt instructing it to act as an expert technical recruiter. The prompt:

- Speaks directly to the candidate in first person ("Imagine we're building a SaaS platform...")
- References role, difficulty, and resume text
- Produces a scenario-based, open-ended question — never a simple trivia or yes/no

### Feedback Panel

After answer submission, the right panel transitions to:

```
┌────────────────────────────────────────────────────────┐
│  Overall Score                                [84/100] │
│                                                        │
│  Clarity       ████████░░  78    Confidence  ██████░░  │
│  Tech Depth    █████████░  88    Comms       ████████░ │
│  Conciseness   ███████░░░  71    Relevance   █████████ │
│                                                        │
│  Missing Points:                                       │
│  • Didn't mention time complexity trade-offs           │
│  • No mention of horizontal scaling strategy           │
│                                                        │
│  Keywords to Improve:                                  │
│  • "basically" → remove or replace                     │
│  • "kind of" → be more decisive                        │
│                                                        │
│  [Your Answer]  ←→  [AI-Improved Answer]               │
└────────────────────────────────────────────────────────┘
```

---

## 🤖 AI Feedback System

### How `analyzeAnswer` Works

Every submitted answer runs through `useAI.ts → analyzeAnswer()`:

1. Builds a prompt containing the original question and user's answer.
2. Calls `gemini-3.1-pro-preview` with a strict `responseSchema` (structured JSON output).
3. Gemini returns a fully typed JSON object containing all 6 dimension scores, `missingPoints[]`, `keywordsToImprove[]`, `feedbackSummary`, and `improvedAnswer`.
4. Scores are saved to Firestore under the `questions` collection.
5. Frontend renders the feedback panel with score gauges and toggle comparison.

### Why Structured JSON Output?

Using Gemini's `responseSchema` parameter ensures the AI always returns a consistent, parsable object — no string parsing, no regex extraction, no hallucinated formats.

---

## 📄 Resume Upload & Parsing

### Extraction

`pdfjs-dist` runs entirely in the browser — no file is ever uploaded to a server.

### Post-Processing Pipeline

```
Raw PDF bytes
      ↓
pdfjs-dist — extract text items with Y-coordinates
      ↓
Y-coordinate grouping — items on same Y → same line
      ↓
Strip non-printable chars + \uFFFD replacement chars
      ↓
Collapse multiple spaces → single space
      ↓
Clean plain-text resume → sent to Gemini prompt
```

### How It Powers Questions

The cleaned resume text is injected into the Gemini question-generation prompt. The model is instructed to reference the candidate's specific projects, technologies, companies, and accomplishments when forming questions — at minimum 50% of generated questions should directly reference the resume.

---

## 📊 Performance Dashboard

All stats are computed fresh on every `Dashboard` mount from Firestore:

| Stat | Computation |
|------|-------------|
| `averageScore` | Mean of `overallScore` across all `completed` sessions |
| `chartData` | Per-session score + date, formatted for Recharts `<LineChart>` |
| `recentSessions` | Ordered by `createdAt` desc — role, difficulty, score, date |

A **"Give Feedback"** button opens `FeedbackModal.tsx` — a 1–5 star rating + optional comment modal. Submissions are saved to the `feedback` Firestore collection for continuous UX improvement.

---

## 🗄 Database Schema

### `users` collection

| Field | Type | Description |
|-------|------|-------------|
| `uid` | string | Firebase Auth UID |
| `email` | string | User's email address |
| `displayName` | string | User's full name |
| `createdAt` | timestamp | Account creation date |

### `sessions` collection

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Parent user UID |
| `role` | string | Target job role |
| `difficulty` | string | `Easy` · `Medium` · `Hard` |
| `resumeText` | string | Extracted resume text (optional) |
| `status` | string | `in-progress` · `completed` |
| `overallScore` | number | Average score across all answers |
| `createdAt` | timestamp | Auto-set on session creation |

### `questions` collection

| Field | Type | Description |
|-------|------|-------------|
| `sessionId` | string | Parent session ID |
| `userId` | string | Parent user UID |
| `questionText` | string | Full AI-generated question |
| `userAnswer` | string | User's submitted answer |
| `clarityScore` | number | 0–100 |
| `confidenceScore` | number | 0–100 |
| `technicalScore` | number | 0–100 |
| `communicationScore` | number | 0–100 |
| `concisenessScore` | number | 0–100 |
| `relevanceScore` | number | 0–100 |
| `improvedAnswer` | string | Gemini-rewritten version |
| `feedbackSummary` | string | Short plain-text summary |
| `missingPoints` | string[] | List of missed concepts |
| `keywordsToImprove` | string[] | Weak words / filler phrases |
| `createdAt` | timestamp | Auto-set on insert |

### `feedback` collection

| Field | Type | Description |
|-------|------|-------------|
| `userId` | string | Submitting user's UID |
| `rating` | number | 1–5 star rating |
| `comments` | string | Optional text feedback |
| `createdAt` | timestamp | Auto-set on submit |

---

## 🏛 Architecture Decisions

### Why Client-Side PDF Parsing?

Using `pdfjs-dist` in the browser eliminates the need for a backend server just for file parsing. This reduces infrastructure costs, simplifies deployment, and — most importantly — **the PDF file never leaves the user's device**. Only the extracted plain text is sent to the Gemini API, significantly improving privacy.

### Why Firebase Firestore?

Firestore's document-based NoSQL model maps perfectly to interview sessions and nested question data. It provides real-time updates, offline support, generous free-tier limits, and built-in Firestore security rules that ensure users can only read and write their own data — without writing a single line of backend auth middleware.

### Why Gemini 3.1 Pro?

Gemini 3.1 Pro offers a large context window (perfect for consuming full resumes alongside conversation history), native structured JSON output via `responseSchema` (ensuring feedback is always consistently formatted and parseable), and strong reasoning capabilities for generating scenario-based technical questions that reference specific resume content.

### Why No Backend Server?

The entire application runs on Firebase (Auth + Firestore) and the Gemini API directly from the client. This means zero server maintenance, zero scaling concerns, automatic global distribution via Firebase's CDN, and a dramatically simpler deployment pipeline — a single `npm run build` and static file deploy.

---

## 🗺 Roadmap

- [ ] **Voice answer input** — Web Speech API for spoken answers
- [ ] **Behavioral question bank** — STAR-method guided question set
- [ ] **Company-specific mode** — tailor questions to Google, Meta, Amazon, etc.
- [ ] **Peer mock interviews** — real-time matched practice with other users
- [ ] **Session export** — download PDF report of scores and feedback
- [ ] **Multilingual support** — question generation and feedback in multiple languages
- [ ] **Mobile app** — React Native port with offline question practice
- [ ] **Interview streaks & badges** — gamification to encourage daily practice

---

## 🤝 Contributing

Contributions are welcome!

```bash
# 1. Fork the repository

# 2. Clone your fork
git clone https://github.com/YOUR-USERNAME/HireMind.git

# 3. Create a feature branch
git checkout -b feature/voice-answer-input

# 4. Make your changes and commit
git add .
git commit -m "feat: add Web Speech API voice answer input"

# 5. Push and open a Pull Request
git push origin feature/voice-answer-input
```

---

## 👤 Author

<div align="center">

**Ibtesaam Aslam**

[![GitHub](https://img.shields.io/badge/GitHub-ibtesaamaslam-181717?style=for-the-badge&logo=github)](https://github.com/ibtesaamaslam)

*Full-Stack Developer & AI Enthusiast*

</div>

---

## 📜 License

```
MIT License

Copyright (c) 2024 Ibtesaam Aslam

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

| Permission | Status |
|-----------|--------|
| ✅ Commercial use | Allowed |
| ✅ Modification | Allowed |
| ✅ Distribution | Allowed |
| ✅ Private use | Allowed |
| ❌ Liability | No warranty provided |
| ❌ Trademark use | Not granted |

---

<div align="center">

**⭐ If HireMind helped you land your next role, please consider starring it on GitHub!**

[![Star on GitHub](https://img.shields.io/github/stars/ibtesaamaslam/HireMind?style=social)](https://github.com/ibtesaamaslam/HireMind)

*Practice harder. Interview smarter.*

</div>
