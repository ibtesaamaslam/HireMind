# HireMind — AI-Powered Interview Practice Platform

## Table of Contents
- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [How It Works — User Flow](#how-it-works--user-flow)
- [New Session Wizard](#new-session-wizard)
- [Active Interview Session](#active-interview-session)
- [AI Feedback System](#ai-feedback-system)
- [Resume Upload & Parsing](#resume-upload--parsing)
- [Performance Dashboard](#performance-dashboard)
- [Feedback Mechanism](#feedback-mechanism)
- [Database Schema](#database-schema)
- [Environment Variables](#environment-variables)
- [Architecture Decisions](#architecture-decisions)

---

## Overview
**HireMind** is a full-stack, AI-powered mock interview practice application that helps candidates prepare for technical and behavioral interviews. Users can practice answering questions, receive instant AI-generated feedback on their performance, upload their resume so questions are personalized to their background, and track improvement over time via a performance dashboard.

The name **HireMind** captures the idea of tapping into an intelligent, AI-driven recruiter's mindset. The app doesn't just throw random questions at you; it simulates a real interviewer who has read your resume, understands your target role, and knows exactly what to ask.

---

## Features

### Core Interview Experience
* **AI-generated personalized questions** — questions are tailored from your resume, target role, and difficulty level.
* **Real-time AI feedback** after every answer covering 6 dimensions.
* **Countdown timer** per question and per session to simulate real pressure.
* **Side-by-side comparison** — toggle between your original answer and the AI-improved version.
* **Typewriter effect** — the AI's questions appear with a smooth typewriter effect, making the interview feel more conversational.

### Feedback Dimensions
* **Clarity (0–100)** — structure and coherence of your answer.
* **Confidence (0–100)** — assertiveness, ownership, decisiveness.
* **Technical Depth (0–100)** — relevance and accuracy of technical content.
* **Communication (0–100)** — language quality, storytelling, conciseness.
* **Conciseness (0–100)** — ability to get to the point without rambling.
* **Relevance (0–100)** — how well the answer addresses the core of the question.
* **Keywords to Improve** — specific keywords or phrases from the user's answer that could be improved or avoided (e.g., filler words, weak verbs).
* **Missing Points** — key points the user missed in their answer.

### Resume Intelligence
* **Upload PDF resume** with drag-and-drop or click-to-browse.
* **Text extracted client-side** using `pdfjs-dist`.
* AI reads your resume and asks about specific projects, companies, technologies, and accomplishments.
* Intelligent parsing logic handles different PDF structures, Y-coordinate line breaks, and character encodings.

### Session Customization
* **Target Role Autocomplete** — select from a list of common roles (Software Engineer, Product Manager, Data Scientist, etc.) or type your own.
* **Difficulty Level** — Easy, Medium, Hard.
* **Resume Context** — optional resume upload to personalize the interview.

### Performance Dashboard
* **Stat cards:** Average Score and Performance Trend.
* **Score history line chart** — overall score over time using `recharts`.
* **Recent Sessions** — list of past interviews with their roles, difficulties, and scores.
* **Feedback Mechanism** — a modal to rate the AI and provide comments on the interview experience.

---

## Tech Stack

### Frontend
| Technology | Purpose |
| :--- | :--- |
| **React 18+** | UI framework |
| **TypeScript** | Type safety |
| **Vite** | Build tool + dev server |
| **Tailwind CSS** | Utility-first styling |
| **Framer Motion** | Animations and page transitions |
| **React Router** | Client-side routing |
| **Recharts** | Score history charts |
| **Lucide React** | Icon set |
| **pdfjs-dist** | Client-side PDF text extraction |

### Backend & AI
| Technology | Purpose |
| :--- | :--- |
| **Firebase Firestore** | Primary NoSQL database |
| **Firebase Auth** | Google OAuth authentication |
| **@google/genai** | Gemini 3.1 Pro for AI question generation and analysis |

---

## Project Structure

```text
src/
├── components/               # Reusable UI components
│   ├── FeedbackModal.tsx     # Modal for rating the AI
│   ├── Loader.tsx            # Loading spinner
│   ├── Navbar.tsx            # Top navigation bar
│   ├── ProtectedRoute.tsx    # Auth guard for routes
│   ├── ResumeUpload.tsx      # PDF drag-and-drop and parsing
│   └── ScoreChart.tsx        # Recharts line chart
├── contexts/                 # React Context providers
│   └── AuthContext.tsx       # Firebase Auth state management
├── hooks/                    # Custom React hooks
│   └── useAI.ts              # Gemini API integration (generate/analyze)
├── pages/                    # Route components
│   ├── Dashboard.tsx         # Performance dashboard
│   ├── Home.tsx              # Landing page
│   ├── InterviewSession.tsx  # Active interview interface
│   └── InterviewSetup.tsx    # Session configuration wizard
├── utils/                    # Helper functions
│   └── firebaseHelpers.ts    # Error handling for Firestore
├── App.tsx                   # Router setup
├── firebase.ts               # Firebase initialization
├── index.css                 # Tailwind imports
└── main.tsx                  # React root mount
```

---

## Getting Started

### Prerequisites
* Node.js 18+
* npm or yarn
* A Firebase Project with Firestore and Google Auth enabled
* A Google Gemini API Key

### Installation
```bash
# Install all dependencies
npm install
```

### Environment Variables
Create a `.env` file in the root directory:
```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
GEMINI_API_KEY=your_gemini_api_key
```

### Running in Development
```bash
# Start the Vite dev server
npm run dev
```

### Production Build
```bash
# Build the React app
npm run build
```

---

## How It Works — User Flow

1. **User visits app**
   ↓
2. **Logs in with Google**
   ↓
3. **Clicks "New Interview"** → Setup Page
   ↓
4. **Selects Role, Difficulty, and uploads Resume (Optional)**
   → PDF is parsed client-side using `pdfjs-dist`
   ↓
5. **Clicks "Start Interview"**
   → Session created in Firestore (status: "in-progress")
   ↓
6. **Active session loads**
   → AI generates a personalized question using the Gemini API, acting as an expert recruiter.
   ↓
7. **User answers the question**
   → On submit: AI analyzes the answer (clarity, confidence, tech depth, etc.)
   → Answer + scores saved to Firestore
   → Feedback panel shown with side-by-side comparison option
   ↓
8. **User clicks "Next Question" or "End Interview"**
   → If ended, average score computed across all answers
   → Session status updated to "completed" in Firestore
   ↓
9. **User views Dashboard**
   → Dashboard shows score history, recent sessions, and allows providing feedback on the AI.

---

## New Session Wizard

The setup page (`InterviewSetup.tsx`) allows users to configure their upcoming interview:

* **Target Role Autocomplete** — A dynamic input field that suggests common roles (e.g., "Software Engineer", "Product Manager") as the user types, while still allowing custom inputs.
* **Difficulty Level** — 3 preset buttons (Easy, Medium, Hard).
* **Resume Upload** — A drag-and-drop zone for PDF resumes. The text is extracted and passed to the AI to personalize the interview questions.

---

## Active Interview Session

### Layout
Split-panel layout (responsive):
* **Left panel** — Current question with a typewriter effect, session timer, and question timer.
* **Right panel** — Answer input textarea or detailed feedback display.

### Question Generation
The `useAI` hook calls the Gemini API with a strict prompt instructing it to act as an expert technical recruiter. It speaks directly to the candidate in the first person (e.g., *"Imagine we are building a SaaS application... Walk me through how you would design..."*). It uses the provided role, difficulty, and resume text to generate a highly relevant, scenario-based question.

### Feedback Panel
After submitting an answer, the panel transitions to the feedback result:
* Overall score badge in top-right.
* 6 score gauges — Clarity, Confidence, Tech Depth, Communication, Conciseness, Relevance.
* Missing Points — Key concepts the user failed to mention.
* Keywords to Improve — Filler words or weak phrases detected in the answer.
* Improved Answer — AI-rewritten version of the user's answer.

---

## AI Feedback System

### How Analysis Works
Every submitted answer goes through the `analyzeAnswer` function in `useAI.ts`.
1. Builds a prompt that includes the original question and the user's answer.
2. Sends to `gemini-3.1-pro-preview` with a structured `responseSchema` (JSON output).
3. Returns all scores, missing points, keywords to improve, a feedback summary, and an improved answer.

---

## Resume Upload & Parsing

### Extraction Library
* **PDF** — `pdfjs-dist` is used to parse PDFs entirely on the client side.

### Post-Processing
The raw extracted text is cleaned up:
* Y-coordinate analysis ensures proper line breaks.
* Non-printable characters and replacement characters (`\uFFFD`) are stripped out.
* Multiple consecutive spaces are collapsed.

### How It Powers Questions
The extracted text is sent to the AI prompt. The AI is instructed to base the question on the candidate's experience if applicable, asking about specific projects or technologies mentioned in the resume.

---

## Performance Dashboard

### Stats Computed
All stats are computed fresh on each `Dashboard` load from Firestore:
* `averageScore` — Average of all `overallScore` values from completed sessions.
* `chartData` — Formatted data for the Recharts line chart, showing score trends over time.
* `recentSessions` — A list of the user's past interviews.

---

## Feedback Mechanism

A **"Give Feedback"** button on the Dashboard opens a modal (`FeedbackModal.tsx`) allowing users to rate the AI's performance (1-5 stars) and provide optional comments. This data is saved to a dedicated `feedback` collection in Firestore, enabling continuous improvement of the AI prompts and application UX.

---

## Database Schema

### `users` collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `uid` | string | Firebase Auth UID |
| `email` | string | User's email |
| `displayName` | string | User's full name |
| `createdAt` | timestamp | Account creation date |

### `sessions` collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | string | Parent user UID |
| `role` | string | Job role being practiced |
| `difficulty` | string | Easy, Medium, Hard |
| `resumeText` | string | Extracted resume text (optional) |
| `status` | string | `in-progress` or `completed` |
| `overallScore` | number | Average score across all answers |
| `createdAt` | timestamp | Auto set on insert |

### `questions` collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `sessionId` | string | Parent session ID |
| `userId` | string | Parent user UID |
| `questionText` | string | Full question text |
| `userAnswer` | string | User's answer |
| `clarityScore` | number | AI clarity score |
| `confidenceScore` | number | AI confidence score |
| `technicalScore` | number | AI technical depth score |
| `communicationScore`| number | AI communication score |
| `concisenessScore` | number | AI conciseness score |
| `relevanceScore` | number | AI relevance score |
| `improvedAnswer` | string | AI-rewritten answer |
| `feedbackSummary` | string | Short summary of feedback |
| `missingPoints` | array | List of missed concepts |
| `keywordsToImprove` | array | List of weak words/phrases |
| `createdAt` | timestamp | Auto set on insert |

### `feedback` collection
| Field | Type | Description |
| :--- | :--- | :--- |
| `userId` | string | Submitting user UID |
| `rating` | number | 1-5 star rating |
| `comments` | string | Optional text feedback |
| `createdAt` | timestamp | Auto set on insert |

---

## Architecture Decisions

### Why Client-Side PDF Parsing?
Using `pdfjs-dist` on the client side eliminates the need for a dedicated backend server just for file parsing. It reduces server costs, improves privacy (the file never leaves the user's browser, only the extracted text goes to the AI), and simplifies the deployment architecture.

### Why Firebase Firestore?
Firestore provides real-time updates, offline support, and a flexible NoSQL schema that perfectly matches the document-based nature of interview sessions and questions. The built-in security rules ensure that users can only access their own data.

### Why Gemini 3.1 Pro?
Gemini 3.1 Pro offers exceptional reasoning capabilities, large context windows (perfect for reading full resumes), and native support for structured JSON outputs (`responseSchema`). This ensures the AI feedback is consistently formatted and easily parsable by the frontend.

---

*Built with HireMind — practice harder, interview smarter.*
