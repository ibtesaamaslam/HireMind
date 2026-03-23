import { useState, useEffect, useCallback } from 'react';

// Declare SpeechRecognition interfaces for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const useSpeech = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState<any>(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcriptPart = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            currentTranscript += transcriptPart + ' ';
          } else {
            currentTranscript += transcriptPart;
          }
        }
        setTranscript((prev) => prev + currentTranscript);
      };

      rec.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        setIsRecording(false);
      };

      rec.onend = () => {
        setIsRecording(false);
      };

      setRecognition(rec);
    } else {
      console.warn("Speech Recognition API not supported in this browser.");
    }
  }, []);

  const startRecording = useCallback(() => {
    if (recognition) {
      setTranscript('');
      setIsRecording(true);
      recognition.start();
    }
  }, [recognition]);

  const stopRecording = useCallback(() => {
    if (recognition && isRecording) {
      recognition.stop();
      setIsRecording(false);
    }
  }, [recognition, isRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);

  return {
    isRecording,
    transcript,
    setTranscript,
    startRecording,
    stopRecording,
    resetTranscript,
    isSupported: !!recognition
  };
};
