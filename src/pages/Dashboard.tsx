import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../utils/firebaseHelpers';
import { ScoreChart } from '../components/ScoreChart';
import { Loader } from '../components/Loader';
import { FeedbackModal } from '../components/FeedbackModal';
import { motion } from 'framer-motion';
import { History, Target, TrendingUp, Plus, MessageSquare } from 'lucide-react';

interface Session {
  id: string;
  role: string;
  difficulty: string;
  overallScore: number;
  createdAt: any;
  status: string;
}

export const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  useEffect(() => {
    if (!user) return;

    const fetchSessions = async () => {
      try {
        const q = query(
          collection(db, 'sessions'),
          where('userId', '==', user.uid),
          orderBy('createdAt', 'desc')
        );
        const snapshot = await getDocs(q);
        const fetchedSessions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Session[];
        
        setSessions(fetchedSessions);
      } catch (error) {
        handleFirestoreError(error, OperationType.LIST, 'sessions');
      } finally {
        setLoading(false);
      }
    };

    fetchSessions();
  }, [user]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader text="Loading dashboard..." /></div>;

  const chartData = sessions
    .filter(s => s.status === 'completed' && s.overallScore)
    .map(s => ({
      date: s.createdAt?.toDate().toLocaleDateString() || 'Unknown',
      score: s.overallScore
    }))
    .reverse();

  const averageScore = chartData.length > 0 
    ? Math.round(chartData.reduce((acc, curr) => acc + curr.score, 0) / chartData.length)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex justify-between items-end mb-12">
        <div>
          <h1 className="text-4xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Track your interview performance over time.</p>
        </div>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsFeedbackOpen(true)}
            className="flex items-center space-x-2 bg-white/5 hover:bg-white/10 text-gray-300 px-6 py-3 rounded-xl font-medium transition-colors border border-white/10"
          >
            <MessageSquare className="w-5 h-5" />
            <span className="hidden sm:inline">Give Feedback</span>
          </button>
          <button
            onClick={() => navigate('/setup')}
            className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            <Plus className="w-5 h-5" />
            <span>New Interview</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-500/20 rounded-xl">
              <Target className="w-6 h-6 text-indigo-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300">Average Score</h3>
          </div>
          <p className="text-5xl font-bold text-white">{averageScore}<span className="text-2xl text-gray-500">/100</span></p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 lg:col-span-2"
        >
          <div className="flex items-center space-x-4 mb-6">
            <div className="p-3 bg-emerald-500/20 rounded-xl">
              <TrendingUp className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-300">Performance Trend</h3>
          </div>
          {chartData.length > 0 ? (
            <ScoreChart data={chartData} />
          ) : (
            <div className="h-64 flex items-center justify-center text-gray-500">
              Complete an interview to see your progress.
            </div>
          )}
        </motion.div>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
          <History className="w-6 h-6 mr-3 text-gray-400" />
          Recent Sessions
        </h3>
        
        <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
          {sessions.length > 0 ? (
            <div className="divide-y divide-white/10">
              {sessions.map((session) => (
                <div key={session.id} className="p-6 flex items-center justify-between hover:bg-white/5 transition-colors">
                  <div>
                    <h4 className="text-lg font-semibold text-white">{session.role}</h4>
                    <p className="text-sm text-gray-400">
                      {session.difficulty} • {session.createdAt?.toDate().toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-indigo-400">
                      {session.overallScore ? `${session.overallScore}` : '-'}
                    </div>
                    <span className="text-xs text-gray-500 uppercase tracking-wider">{session.status}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center text-gray-500">
              No sessions found. Start your first interview!
            </div>
          )}
        </div>
      </div>

      <FeedbackModal 
        isOpen={isFeedbackOpen} 
        onClose={() => setIsFeedbackOpen(false)} 
      />
    </div>
  );
};
