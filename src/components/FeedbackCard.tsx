import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Lightbulb, MessageSquare, AlertTriangle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface FeedbackCardProps {
  clarityScore: number;
  confidenceScore: number;
  technicalScore: number;
  communicationScore: number;
  concisenessScore: number;
  relevanceScore: number;
  improvedAnswer: string;
  feedbackSummary: string;
  missingPoints: string[];
  keywordsToImprove: string[];
}

const ScoreRing = ({ score, label }: { score: number; label: string }) => {
  const color = score >= 80 ? 'text-emerald-400' : score >= 60 ? 'text-yellow-400' : 'text-red-400';
  
  return (
    <div className="flex flex-col items-center">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
          <path
            className="text-white/10"
            strokeWidth="3"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
          <path
            className={color}
            strokeWidth="3"
            strokeDasharray={`${score}, 100`}
            strokeLinecap="round"
            stroke="currentColor"
            fill="none"
            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          />
        </svg>
        <span className="absolute text-sm font-bold text-white">{score}</span>
      </div>
      <span className="text-xs text-gray-400 mt-2 font-medium uppercase tracking-wider text-center">{label}</span>
    </div>
  );
};

export const FeedbackCard = ({
  clarityScore,
  confidenceScore,
  technicalScore,
  communicationScore,
  concisenessScore,
  relevanceScore,
  improvedAnswer,
  feedbackSummary,
  missingPoints,
  keywordsToImprove
}: FeedbackCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm"
    >
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-indigo-500/20 rounded-lg">
          <MessageSquare className="w-5 h-5 text-indigo-400" />
        </div>
        <h3 className="text-xl font-semibold text-white">AI Feedback</h3>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-8">
        <ScoreRing score={clarityScore} label="Clarity" />
        <ScoreRing score={confidenceScore} label="Confidence" />
        <ScoreRing score={technicalScore} label="Technical" />
        <ScoreRing score={communicationScore} label="Comm." />
        <ScoreRing score={concisenessScore} label="Concise" />
        <ScoreRing score={relevanceScore} label="Relevance" />
      </div>

      <div className="space-y-6">
        <div>
          <h4 className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
            <Lightbulb className="w-4 h-4 mr-2 text-yellow-400" />
            Summary
          </h4>
          <p className="text-gray-300 leading-relaxed">{feedbackSummary}</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {missingPoints && missingPoints.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                <XCircle className="w-4 h-4 mr-2 text-red-400" />
                Missing Points
              </h4>
              <ul className="space-y-2">
                {missingPoints.map((point, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-red-400 rounded-full flex-shrink-0" />
                    <span className="text-sm">{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {keywordsToImprove && keywordsToImprove.length > 0 && (
            <div>
              <h4 className="flex items-center text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
                <AlertTriangle className="w-4 h-4 mr-2 text-orange-400" />
                Phrases to Improve
              </h4>
              <ul className="space-y-2">
                {keywordsToImprove.map((keyword, idx) => (
                  <li key={idx} className="flex items-start text-gray-300">
                    <span className="mr-2 mt-1.5 w-1.5 h-1.5 bg-orange-400 rounded-full flex-shrink-0" />
                    <span className="text-sm">{keyword}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="bg-indigo-900/20 border border-indigo-500/20 rounded-xl p-5">
          <h4 className="flex items-center text-sm font-semibold text-indigo-300 uppercase tracking-wider mb-3">
            <CheckCircle className="w-4 h-4 mr-2 text-emerald-400" />
            Improved Answer
          </h4>
          <div className="text-gray-200 leading-relaxed prose prose-invert max-w-none">
            <ReactMarkdown>{improvedAnswer}</ReactMarkdown>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
