import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseHelpers';
import { motion } from 'framer-motion';
import { Briefcase, BarChart, Play } from 'lucide-react';
import { ResumeUpload } from '../components/ResumeUpload';

export const InterviewSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('Software Engineer');
  const [difficulty, setDifficulty] = useState('Medium');
  const [resumeText, setResumeText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const handleStart = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const sessionData: any = {
        userId: user.uid,
        role,
        difficulty,
        status: 'in-progress',
        createdAt: serverTimestamp(),
      };
      
      if (resumeText) {
        sessionData.resumeText = resumeText;
      }
      
      const docRef = await addDoc(collection(db, 'sessions'), sessionData);
      navigate(`/interview/${docRef.id}`);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, 'sessions');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-black px-4 py-12">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-xl bg-white/5 border border-white/10 p-10 rounded-[2rem] backdrop-blur-xl"
      >
        <h2 className="text-3xl font-bold text-white mb-8 text-center">Configure Interview</h2>

        <div className="space-y-8">
          <div>
            <label className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              <Briefcase className="w-4 h-4 mr-2 text-indigo-400" />
              Target Role
            </label>
            <input
              type="text"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              placeholder="e.g., Frontend Developer, Data Scientist"
              className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              <BarChart className="w-4 h-4 mr-2 text-purple-400" />
              Difficulty Level
            </label>
            <div className="grid grid-cols-3 gap-4">
              {['Easy', 'Medium', 'Hard'].map((level) => (
                <button
                  key={level}
                  onClick={() => setDifficulty(level)}
                  className={`py-3 rounded-xl font-medium transition-all ${
                    difficulty === level
                      ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                      : 'bg-black/50 text-gray-400 border border-white/10 hover:bg-white/5'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              Resume (Optional)
            </label>
            <ResumeUpload onExtract={(text) => setResumeText(text)} />
          </div>

          <button
            onClick={handleStart}
            disabled={loading || !role.trim()}
            className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Play className="w-5 h-5 fill-current" />
            <span>{loading ? 'Starting...' : 'Start Interview'}</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
