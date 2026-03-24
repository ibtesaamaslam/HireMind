import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export interface FeedbackResult {
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

export const useAI = () => {
  const generateSpeech = async (text: string): Promise<string | null> => {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text }] }],
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: 'Kore' },
            },
          },
        },
      });
      return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
    } catch (error) {
      console.error("Error generating speech:", error);
      return null;
    }
  };

  const getRoleTips = async (role: string): Promise<string> => {
    try {
      const prompt = `Provide 5 highly actionable, specific interview tips and tricks for a ${role} position. Include common technical topics to study and behavioral traits to highlight. Format as Markdown.`;
      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });
      return response.text?.trim() || "Could not generate tips at this time.";
    } catch (error) {
      console.error("Error generating tips:", error);
      return "Could not generate tips at this time.";
    }
  };

  const getRealTimeFeedback = async (question: string, currentTranscript: string, persona: string): Promise<string> => {
    try {
      const prompt = `You are a ${persona} conducting an interview.
The question is: "${question}"
The candidate is currently answering and has said so far: "${currentTranscript}"

Provide a VERY BRIEF (1 short sentence max) real-time hint, encouragement, or course-correction. 
Keep it under 15 words. Speak directly to the candidate.
Example: "Good start, now mention a specific metric." or "You're rambling, get to the point."`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
      });
      return response.text?.trim() || "";
    } catch (error) {
      console.error("Error generating real-time feedback:", error);
      return "";
    }
  };

  const generateQuestion = async (role: string, difficulty: string, previousQuestions: string[] = [], resumeText?: string, persona: string = 'Friendly Recruiter'): Promise<string> => {
    try {
      let prompt = `You are an expert technical recruiter and hiring manager conducting an interview for a ${role} position at the ${difficulty} level.
Your persona is: ${persona}. Adopt this persona's tone and style completely in your question.

Generate ONE practical, scenario-based interview question.

CRITICAL INSTRUCTIONS:
1. Speak DIRECTLY to the candidate in the first person (e.g., "Imagine we are building...", "Walk me through how you would...").
2. DO NOT include any meta-text, introductions, or explanations of why it's a good question.
3. DO NOT output "Here is a question" or "What to listen for".
4. Just output the exact words you would say to the candidate as if you were speaking to them right now.
5. Make it practical and not generic (avoid generic LeetCode algorithms; focus on real-world system behavior, APIs, architecture, or domain-specific challenges).

Previous questions asked in this session (do not repeat): ${previousQuestions.join(' | ')}`;

      if (resumeText) {
        prompt += `\n\nThe candidate provided their resume. Base the question on their experience if applicable:\n${resumeText.substring(0, 2000)}`;
      }

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
      });

      return response.text?.trim() || "Could you tell me about a challenging project you worked on recently?";
    } catch (error) {
      console.error("Error generating question:", error);
      return "Could you tell me about a challenging project you worked on recently?";
    }
  };

  const analyzeAnswer = async (question: string, answer: string, persona: string = 'Friendly Recruiter'): Promise<FeedbackResult> => {
    try {
      const prompt = `Analyze this interview answer.
Question: "${question}"
User Answer: "${answer}"

Provide a detailed analysis including specific keywords or phrases that could be improved, and evaluate conciseness and relevance.
IMPORTANT: Write the 'feedbackSummary' and 'improvedAnswer' from the perspective and tone of a ${persona}.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.1-pro-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              clarityScore: { type: Type.NUMBER, description: "Clarity score (0-100)" },
              confidenceScore: { type: Type.NUMBER, description: "Confidence score (0-100)" },
              technicalScore: { type: Type.NUMBER, description: "Technical depth score (0-100)" },
              communicationScore: { type: Type.NUMBER, description: "Communication score (0-100)" },
              concisenessScore: { type: Type.NUMBER, description: "Conciseness score (0-100)" },
              relevanceScore: { type: Type.NUMBER, description: "Relevance score (0-100)" },
              improvedAnswer: { type: Type.STRING, description: "A professionally improved version of the answer" },
              feedbackSummary: { type: Type.STRING, description: "A short summary of the feedback" },
              missingPoints: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Key points the user missed"
              },
              keywordsToImprove: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Specific keywords or phrases from the user's answer that could be improved or avoided (e.g., filler words, weak verbs)"
              }
            },
            required: ["clarityScore", "confidenceScore", "technicalScore", "communicationScore", "concisenessScore", "relevanceScore", "improvedAnswer", "feedbackSummary", "missingPoints", "keywordsToImprove"]
          }
        }
      });

      const jsonStr = response.text?.trim();
      if (!jsonStr) throw new Error("Empty response from AI");
      
      return JSON.parse(jsonStr) as FeedbackResult;
    } catch (error) {
      console.error("Error analyzing answer:", error);
      return {
        clarityScore: 50,
        confidenceScore: 50,
        technicalScore: 50,
        communicationScore: 50,
        concisenessScore: 50,
        relevanceScore: 50,
        improvedAnswer: "Error generating improved answer. Please try again.",
        feedbackSummary: "Could not analyze the answer due to an error.",
        missingPoints: ["N/A"],
        keywordsToImprove: ["N/A"]
      };
    }
  };

  return { generateQuestion, analyzeAnswer, generateSpeech, getRoleTips, getRealTimeFeedback };
};
