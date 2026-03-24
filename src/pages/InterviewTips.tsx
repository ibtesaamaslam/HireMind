import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Lightbulb, ChevronDown, Loader2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useAI } from '../hooks/useAI';

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

export const InterviewTips = () => {
  const [role, setRole] = useState('Software Engineer');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [tips, setTips] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { getRoleTips } = useAI();

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

  const fetchTips = async () => {
    if (!role.trim()) return;
    setLoading(true);
    const generatedTips = await getRoleTips(role);
    setTips(generatedTips);
    setLoading(false);
  };

  // Fetch initial tips
  useEffect(() => {
    fetchTips();
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center space-x-4 mb-8">
        <div className="p-3 bg-amber-500/20 rounded-xl">
          <Lightbulb className="w-8 h-8 text-amber-400" />
        </div>
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Interview Tips & Tricks</h1>
          <p className="text-gray-400">Get personalized advice and strategies for your target role.</p>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 mb-8">
        <div className="flex flex-col md:flex-row gap-4 items-end">
          <div className="relative flex-grow w-full" ref={dropdownRef}>
            <label className="block text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Role
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
          <button
            onClick={fetchTips}
            disabled={loading || !role.trim()}
            className="w-full md:w-auto flex items-center justify-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <span>Get Tips</span>}
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {loading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center justify-center py-20"
          >
            <Loader2 className="w-12 h-12 text-indigo-400 animate-spin mb-4" />
            <p className="text-gray-400">Generating personalized tips...</p>
          </motion.div>
        ) : tips ? (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 border border-white/10 rounded-3xl p-8 prose prose-invert prose-indigo max-w-none"
          >
            <div className="markdown-body">
              <ReactMarkdown>{tips}</ReactMarkdown>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
};
