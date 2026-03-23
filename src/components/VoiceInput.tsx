import { motion } from 'framer-motion';
import { Mic, Square, Loader2 } from 'lucide-react';

interface VoiceInputProps {
  isRecording: boolean;
  onStart: () => void;
  onStop: () => void;
  disabled?: boolean;
}

export const VoiceInput = ({ isRecording, onStart, onStop, disabled }: VoiceInputProps) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={isRecording ? onStop : onStart}
        disabled={disabled}
        className={`relative flex items-center justify-center w-20 h-20 rounded-full shadow-lg transition-all duration-300 ${
          isRecording 
            ? 'bg-red-500 hover:bg-red-600 shadow-red-500/50' 
            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/50'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isRecording ? (
          <>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 rounded-full border-2 border-red-400 opacity-50"
            />
            <Square className="w-8 h-8 text-white fill-current" />
          </>
        ) : (
          <Mic className="w-8 h-8 text-white" />
        )}
      </motion.button>
      <p className="text-sm font-medium text-gray-400 uppercase tracking-widest">
        {isRecording ? 'Recording...' : 'Tap to Speak'}
      </p>
    </div>
  );
};
