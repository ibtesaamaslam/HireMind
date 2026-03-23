# HireMind - AI Interview Copilot

HireMind is a production-ready web application designed to help users practice interviews with real-time AI feedback. It acts as a combined interviewer and AI coach, providing dynamic questions, analyzing responses, and offering actionable feedback to improve interview performance.

## 🚀 Core Features

1. **Real-Time Interview Mode**
   - Select your target role (e.g., Software Engineer, Data Scientist) and difficulty level.
   - The AI dynamically generates practical, non-generic interview questions.
   - Respond using **Voice (Speech-to-Text)** or Text input.

2. **Advanced AI Feedback Engine**
   - Powered by Gemini 3.1 Pro, the engine analyzes your answers in real-time.
   - **Granular Scoring**: Receive scores (0-100) for Clarity, Confidence, Technical Depth, Communication, Conciseness, and Relevance.
   - **Actionable Insights**: Identifies specific keywords or phrases to improve (e.g., filler words, weak verbs).
   - **Improved Answers**: Provides a professionally rewritten version of your answer.
   - **Missing Points**: Highlights key concepts you forgot to mention.

3. **Resume-Based Interview Mode**
   - Upload your resume (PDF).
   - The app extracts the text and uses it as context to generate highly personalized, experience-based interview questions.

4. **Performance Dashboard**
   - Track your session history.
   - Visualize your score trends over time using interactive charts.
   - Review past sessions and overall performance.

5. **Session Timers & UI Enhancements**
   - Prominent timers track both the overall session duration and the time spent on the current question.
   - Typewriter effect for AI questions to simulate a real conversational flow.
   - Dark futuristic UI with glassmorphism and neon accents.

## 🏗️ Tech Stack

- **Frontend**: React 19, Vite, Tailwind CSS v4, Framer Motion
- **Routing**: React Router DOM
- **Backend/Database**: Firebase (Firestore for data storage, Firebase Auth for Google Login)
- **AI Integration**: `@google/genai` (Gemini 3.1 Pro)
- **Speech Recognition**: Web Speech API (`SpeechRecognition`)
- **PDF Parsing**: `pdfjs-dist`
- **Charts**: Recharts
- **Markdown Rendering**: `react-markdown`, `@tailwindcss/typography`

## 📁 Project Structure

```text
/
├── firebase-applet-config.json # Firebase configuration
├── firebase-blueprint.json     # Firestore schema blueprint
├── firestore.rules             # Secure Firestore security rules
├── src/
│   ├── components/
│   │   ├── FeedbackCard.tsx    # Displays granular AI feedback
│   │   ├── Loader.tsx          # Animated loading states
│   │   ├── Navbar.tsx          # Top navigation bar
│   │   ├── ResumeUpload.tsx    # PDF parsing and upload component
│   │   ├── ScoreChart.tsx      # Recharts implementation for dashboard
│   │   ├── TypewriterText.tsx  # Animated text effect for questions
│   │   └── VoiceInput.tsx      # Microphone recording button
│   ├── contexts/
│   │   └── AuthContext.tsx     # Firebase Authentication context
│   ├── hooks/
│   │   ├── useAI.ts            # Gemini API integration (generate & analyze)
│   │   └── useSpeech.ts        # Web Speech API integration
│   ├── pages/
│   │   ├── Dashboard.tsx       # User performance tracking
│   │   ├── Home.tsx            # Landing page
│   │   ├── InterviewSession.tsx# Main interview interface & timers
│   │   ├── InterviewSetup.tsx  # Role, difficulty, and resume configuration
│   │   └── Login.tsx           # Google Sign-in page
│   ├── utils/
│   │   └── firebaseHelpers.ts  # Error handling utilities
│   ├── App.tsx                 # Main routing and layout
│   ├── firebase.ts             # Firebase initialization
│   ├── index.css               # Tailwind CSS entry point
│   └── main.tsx                # React entry point
```

## 🔐 Security & Database

The application uses Firebase Firestore with strict security rules (`firestore.rules`). 
- **Ownership**: Users can only read and write their own data (sessions, questions, profiles).
- **Validation**: All incoming data is validated against strict schemas (e.g., `isValidSession`, `isValidQuestion`) to prevent data corruption or malicious payloads.
- **Immutable Fields**: Fields like `createdAt` and `userId` are protected from modification after creation.

## 🚀 Getting Started

1. **Authentication**: Sign in using your Google account.
2. **Setup**: Navigate to the Dashboard and click "New Interview".
3. **Configure**: Enter your target role, select a difficulty, and optionally upload your resume (PDF).
4. **Practice**: Read the AI's question, click the microphone to record your answer (or type it), and submit.
5. **Review**: Analyze the detailed feedback, review the improved answer, and proceed to the next question.
6. **Track**: After completing the session (5 questions), review your progress on the Dashboard.

## 💡 AI Prompt Engineering

The core of HireMind relies on structured JSON generation via the Gemini API. The `analyzeAnswer` function uses a strict `responseSchema` to guarantee that the AI returns perfectly formatted data containing all required metrics, missing points, and keywords to improve.
