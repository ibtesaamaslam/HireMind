import { motion } from 'framer-motion';

export const AIAvatar = ({ isSpeaking }: { isSpeaking: boolean }) => {
  return (
    <div className="relative flex items-center justify-center w-32 h-32 mx-auto mb-6">
      {/* Subtle Breathing Animation for the whole head */}
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="relative z-10"
      >
        {/* Head Container */}
        <div className={`relative flex items-center justify-center w-24 h-24 rounded-[2rem] bg-gradient-to-b from-gray-800 to-gray-900 shadow-[0_0_30px_rgba(99,102,241,0.3)] border-2 ${isSpeaking ? 'border-indigo-400 shadow-[0_0_40px_rgba(99,102,241,0.6)]' : 'border-gray-700'} transition-all duration-500 overflow-hidden`}>
          
          {/* Inner Face Screen */}
          <div className="absolute inset-2 bg-black rounded-[1.5rem] overflow-hidden border border-gray-800">
            {/* Scanline effect */}
            <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.25)_50%)] bg-[length:100%_4px] opacity-20 pointer-events-none" />
            
            {/* Eyes */}
            <div className="absolute top-6 left-0 right-0 flex justify-center space-x-6">
              <motion.div 
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], repeatDelay: Math.random() * 2 + 2 }}
                className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
              />
              <motion.div 
                animate={{ scaleY: [1, 0.1, 1] }}
                transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 0.1], repeatDelay: Math.random() * 2 + 2 }}
                className="w-4 h-4 bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]" 
              />
            </div>

            {/* Mouth */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-10 flex justify-center items-center h-4">
              <motion.div
                animate={isSpeaking ? { height: ["2px", "12px", "4px", "16px", "2px"] } : { height: "2px" }}
                transition={isSpeaking ? { repeat: Infinity, duration: 0.3, ease: "linear" } : { duration: 0.3 }}
                className="w-full bg-cyan-400 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.8)]"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Ambient Glow */}
      {isSpeaking && (
        <>
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl -z-10"
          />
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut", delay: 0.2 }}
            className="absolute inset-0 bg-cyan-500 rounded-full blur-3xl -z-10"
          />
        </>
      )}
    </div>
  );
};
