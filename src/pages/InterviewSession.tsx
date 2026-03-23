import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, updateDoc, collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseHelpers';
import { useAI, FeedbackResult } from '../hooks/useAI';
import { useSpeech } from '../hooks/useSpeech';
import { VoiceInput } from '../components/VoiceInput';
import { FeedbackCard } from '../components/FeedbackCard';
import { Loader } from '../components/Loader';
import { TypewriterText } from '../components/TypewriterText';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle2, Clock } from 'lucide-react';

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
};

export const InterviewSession = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { generateQuestion, analyzeAnswer } = useAI();
  const { isRecording, transcript, setTranscript, startRecording, stopRecording, isSupported } = useSpeech();

  const [session, setSession] = useState<any>(null);
  const [currentQuestion, setCurrentQuestion] = useState<string>('');
  const [pastQuestions, setPastQuestions] = useState<string[]>([]);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);
  const [loadingState, setLoadingState] = useState<'initializing' | 'generating_question' | 'analyzing' | 'idle'>('initializing');
  const [questionCount, setQuestionCount] = useState(0);
  
  // Timers
  const [sessionTime, setSessionTime] = useState(0);
  const [questionTime, setQuestionTime] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);

  const MAX_QUESTIONS = 5;
  const transcriptRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerActive) {
      interval = setInterval(() => {
        setSessionTime(prev => prev + 1);
        if (loadingState === 'idle') {
          setQuestionTime(prev => prev + 1);
        }
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, loadingState]);

  useEffect(() => {
    const initSession = async () => {
      if (!user || !id) return;
      try {
        const docRef = doc(db, 'sessions', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setSession(data);
          setIsTimerActive(true);
          loadNextQuestion(data.role, data.difficulty, [], data.resumeText);
        } else {
          navigate('/dashboard');
        }
      } catch (error) {
        handleFirestoreError(error, OperationType.GET, `sessions/${id}`);
      }
    };
    initSession();
  }, [user, id]);

  const loadNextQuestion = async (role: string, difficulty: string, history: string[], resumeText?: string) => {
    setLoadingState('generating_question');
    setFeedback(null);
    setTranscript('');
    setQuestionTime(0);
    const newQuestion = await generateQuestion(role, difficulty, history, resumeText);
    setCurrentQuestion(newQuestion);
    setPastQuestions([...history, newQuestion]);
    setLoadingState('idle');
  };

  const handleSubmitAnswer = async () => {
    if (!transcript.trim() || !user || !id) return;
    
    setLoadingState('analyzing');
    const result = await analyzeAnswer(currentQuestion, transcript);
    setFeedback(result);

    // Save question and feedback to Firestore
    try {
      await addDoc(collection(db, 'questions'), {
        sessionId: id,
        userId: user.uid,
        questionText: currentQuestion,
        userAnswer: transcript,
        ...result,
        createdAt: serverTimestamp()
      });
      setQuestionCount(prev => prev + 1);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'questions');
    }
    
    setLoadingState('idle');
  };

  const handleNext = async () => {
    if (questionCount >= MAX_QUESTIONS) {
      // End session
      setIsTimerActive(false);
      try {
        await updateDoc(doc(db, 'sessions', id!), {
          status: 'completed',
          overallScore: Math.round(((feedback?.clarityScore || 0) + (feedback?.technicalScore || 0)) / 2)
        });
        navigate('/dashboard');
      } catch (error) {
        handleFirestoreError(error, OperationType.UPDATE, `sessions/${id}`);
      }
    } else {
      loadNextQuestion(session.role, session.difficulty, pastQuestions, session.resumeText);
    }
  };

  if (loadingState === 'initializing') return <div className="min-h-screen flex items-center justify-center"><Loader text="Preparing your interview..." /></div>;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 pb-6 border-b border-white/10 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">{session?.role} Interview</h2>
          <p className="text-indigo-400 font-medium">{session?.difficulty} Level</p>
        </div>
        
        <div className="flex items-center space-x-6 bg-white/5 px-6 py-3 rounded-2xl border border-white/10">
          <div className="flex items-center space-x-2">
            <Clock className="w-5 h-5 text-indigo-400" />
            <div className="flex flex-col">
              <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Session</span>
              <span className="text-lg font-mono text-white leading-none">{formatTime(sessionTime)}</span>
            </div>
          </div>
          <div className="w-px h-8 bg-white/10"></div>
          <div className="flex flex-col">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Question</span>
            <span className="text-lg font-mono text-white leading-none">{formatTime(questionTime)}</span>
          </div>
        </div>

        <div className="text-right">
          <span className="text-sm text-gray-500 uppercase tracking-wider">Progress</span>
          <div className="text-3xl font-bold text-white">{questionCount + 1}<span className="text-gray-600">/{MAX_QUESTIONS}</span></div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loadingState === 'generating_question' ? (
          <motion.div key="loading-q" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader text="AI is formulating the next question..." />
          </motion.div>
        ) : loadingState === 'analyzing' ? (
          <motion.div key="loading-a" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <Loader text="Analyzing your response..." />
          </motion.div>
        ) : !feedback ? (
          <motion.div key="question" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8">
            {/* Question Card */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 rounded-3xl p-8 shadow-2xl min-h-[120px]">
              <h3 className="text-2xl font-medium text-white leading-relaxed">
                "<TypewriterText text={currentQuestion} speed={25} />"
              </h3>
            </div>

            {/* Input Area */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8">
              <div className="flex flex-col md:flex-row gap-8">
                {isSupported && (
                  <div className="flex-shrink-0 flex items-center justify-center md:border-r border-white/10 md:pr-8">
                    <VoiceInput
                      isRecording={isRecording}
                      onStart={startRecording}
                      onStop={stopRecording}
                    />
                  </div>
                )}
                <div className="flex-grow flex flex-col">
                  <textarea
                    ref={transcriptRef}
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="Type your answer here or use the microphone..."
                    className="w-full h-40 bg-black/50 border border-white/10 rounded-2xl p-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none mb-4"
                  />
                  <div className="flex justify-end">
                    <button
                      onClick={handleSubmitAnswer}
                      disabled={!transcript.trim()}
                      className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50"
                    >
                      <span>Submit Answer</span>
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div key="feedback" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <FeedbackCard {...feedback} />
            <div className="flex justify-end">
              <button
                onClick={handleNext}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-xl font-bold transition-all hover:scale-105 shadow-lg shadow-emerald-600/20"
              >
                <span>{questionCount >= MAX_QUESTIONS - 1 ? 'Finish Interview' : 'Next Question'}</span>
                <CheckCircle2 className="w-5 h-5" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
