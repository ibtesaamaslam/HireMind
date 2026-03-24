import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseHelpers';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, BarChart, Play, ChevronDown } from 'lucide-react';
import { ResumeUpload } from '../components/ResumeUpload';

const COMMON_ROLES = [
  "Software Engineer",
  "Frontend Developer",
  "Backend Developer",
  "Full Stack Developer",
  "Data Scientist",
  "Product Manager",
  "UX/UI Designer",
  "DevOps Engineer",
  "Machine Learning Engineer",
  "Data Analyst",
  "Engineering Manager",
  "Solutions Architect",
  "QA Engineer",
  "Mobile Developer (iOS/Android)",
  "Cloud Engineer"
];

export const InterviewSetup = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [role, setRole] = useState('Software Engineer');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [difficulty, setDifficulty] = useState('Medium');
  const [resumeText, setResumeText] = useState<string>('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredRoles = COMMON_ROLES.filter(r => 
    r.toLowerCase().includes(role.toLowerCase()) && r.toLowerCase() !== role.toLowerCase()
  );

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
          <div className="relative" ref={dropdownRef}>
            <label className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-4">
              <Briefcase className="w-4 h-4 mr-2 text-indigo-400" />
              Target Role
            </label>
            <div className="relative">
              <input
                type="text"
                value={role}
                onChange={(e) => {
                  setRole(e.target.value);
                  setIsRoleDropdownOpen(true);
                }}
                onFocus={() => setIsRoleDropdownOpen(true)}
                placeholder="e.g., Frontend Developer, Data Scientist"
                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              />
              <button 
                type="button"
                onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <ChevronDown className={`w-5 h-5 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            <AnimatePresence>
              {isRoleDropdownOpen && (filteredRoles.length > 0 || COMMON_ROLES.length > 0) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute z-10 w-full mt-2 bg-gray-900 border border-white/10 rounded-xl shadow-2xl overflow-hidden max-h-60 overflow-y-auto"
                >
                  {(role ? filteredRoles : COMMON_ROLES).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setIsRoleDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-3 text-gray-300 hover:bg-indigo-600 hover:text-white transition-colors"
                    >
                      {r}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
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
