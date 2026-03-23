import { useState, useRef } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Upload, FileText, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

// Configure PDF.js worker using CDN
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface ResumeUploadProps {
  onExtract: (text: string) => void;
}

export const ResumeUpload = ({ onExtract }: ResumeUploadProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const extractTextFromPDF = async (file: File) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        
        let pageText = '';
        let lastY = -1;
        
        for (const item of textContent.items as any[]) {
          if (!item.str) continue;
          
          const currentY = item.transform[5];
          
          // If Y coordinate changes significantly, it's a new line
          if (lastY !== -1 && Math.abs(lastY - currentY) > 2) {
            pageText += '\n';
            lastY = currentY;
          } else {
            if (lastY === -1) lastY = currentY;
            // Add space between items on the same line if needed
            if (pageText.length > 0 && !pageText.endsWith(' ') && !item.str.startsWith(' ')) {
              pageText += ' ';
            }
          }
          
          // Clean up non-printable and replacement characters
          pageText += item.str.replace(/[\u0000-\u0008\u000B-\u000C\u000E-\u001F\uFFFD]/g, '');
        }
        
        fullText += pageText + '\n\n';
      }
      
      onExtract(fullText);
      setSuccess(true);
    } catch (err) {
      console.error("Error parsing PDF:", err);
      setError("Failed to parse PDF. Please ensure it's a valid text-based PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPDF(file);
    } else if (file) {
      setError("Please upload a valid PDF file.");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type === 'application/pdf') {
      extractTextFromPDF(file);
    } else if (file) {
      setError("Please upload a valid PDF file.");
    }
  };

  return (
    <div className="w-full">
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
          isDragging ? 'border-indigo-500 bg-indigo-500/10' : 
          success ? 'border-emerald-500/50 bg-emerald-500/5' :
          error ? 'border-red-500/50 bg-red-500/5' :
          'border-white/20 hover:border-indigo-400 hover:bg-white/5'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept="application/pdf"
          className="hidden"
        />
        
        <div className="flex flex-col items-center justify-center space-y-4">
          {loading ? (
            <Loader2 className="w-10 h-10 text-indigo-400 animate-spin" />
          ) : success ? (
            <CheckCircle className="w-10 h-10 text-emerald-400" />
          ) : error ? (
            <AlertCircle className="w-10 h-10 text-red-400" />
          ) : (
            <div className="p-4 bg-white/5 rounded-full">
              <Upload className="w-8 h-8 text-indigo-400" />
            </div>
          )}
          
          <div>
            <p className="text-white font-medium">
              {loading ? 'Extracting resume text...' : 
               success ? 'Resume uploaded successfully!' :
               'Upload Resume (PDF)'}
            </p>
            {!loading && !success && (
              <p className="text-sm text-gray-400 mt-1">
                Drag and drop or click to browse. Enables personalized questions.
              </p>
            )}
            {error && <p className="text-sm text-red-400 mt-2">{error}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};
