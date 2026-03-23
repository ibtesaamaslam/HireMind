import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

export const Loader = ({ text = "Processing..." }: { text?: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      >
        <Loader2 className="w-10 h-10 text-indigo-500" />
      </motion.div>
      <p className="text-indigo-300 font-medium tracking-wide animate-pulse">{text}</p>
    </div>
  );
};
