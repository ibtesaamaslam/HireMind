import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, BrainCircuit, LineChart, ArrowRight } from 'lucide-react';

export const Home = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {/* Hero Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-indigo-900/20 via-black to-black -z-10" />
        
        <div className="text-center max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-8">
              Master Your Next Interview with <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">HireMind</span>
            </h1>
            <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Real-time voice analysis, personalized feedback, and dynamic follow-up questions. Practice like it's the real thing.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link
                to="/setup"
                className="group relative inline-flex items-center justify-center px-8 py-4 text-base font-bold text-white bg-indigo-600 rounded-full overflow-hidden transition-all hover:bg-indigo-700 hover:scale-105"
              >
                <span className="mr-2">Start Practicing</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 border-t border-white/10">
        <div className="grid md:grid-cols-3 gap-12">
          <FeatureCard
            icon={<Mic className="w-8 h-8 text-indigo-400" />}
            title="Voice & Text Input"
            description="Speak naturally or type your answers. Our AI processes your response in real-time."
            delay={0.1}
          />
          <FeatureCard
            icon={<BrainCircuit className="w-8 h-8 text-purple-400" />}
            title="Smart Feedback"
            description="Get scored on clarity, confidence, and technical depth. See improved versions of your answers."
            delay={0.2}
          />
          <FeatureCard
            icon={<LineChart className="w-8 h-8 text-emerald-400" />}
            title="Track Progress"
            description="Monitor your performance over time with detailed analytics and skill breakdowns."
            delay={0.3}
          />
        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }: { icon: React.ReactNode, title: string, description: string, delay: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ delay, duration: 0.5 }}
    className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-colors"
  >
    <div className="mb-6 p-4 bg-black/50 inline-block rounded-2xl">{icon}</div>
    <h3 className="text-2xl font-bold mb-4">{title}</h3>
    <p className="text-gray-400 leading-relaxed">{description}</p>
  </motion.div>
);
