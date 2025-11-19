import * as React from 'react';
import { useState, useEffect } from 'react';
import { ImageFile, AppStatus, SUGGESTED_PROMPTS } from '../types';
import { editImageWithGemini } from '../services/geminiService';

interface EditorProps {
  initialImage: ImageFile;
  onReset: () => void;
}

export const Editor: React.FC<EditorProps> = ({ initialImage, onReset }) => {
  const [prompt, setPrompt] = useState('');
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Cleanup URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setStatus(AppStatus.PROCESSING);
    setErrorMessage(null);
    setResultUrl(null);

    try {
      const generatedBase64Url = await editImageWithGemini({
        imageBase64: initialImage.base64,
        mimeType: initialImage.mimeType,
        prompt: prompt
      });
      
      setResultUrl(generatedBase64Url);
      setStatus(AppStatus.SUCCESS);
    } catch (error: any) {
      setStatus(AppStatus.ERROR);
      setErrorMessage(error.message || "Something went wrong. Please try again.");
    }
  };

  const isProcessing = status === AppStatus.PROCESSING;

  return (
    <div className="w-full max-w-6xl mx-auto animate-fade-in">
      
      {/* Top Bar: Navigation & Reset */}
      <div className="flex items-center justify-between mb-6">
        <button 
          onClick={onReset}
          className="flex items-center text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Upload
        </button>
        <span className="px-3 py-1 rounded-full bg-slate-800 text-xs text-slate-400 border border-slate-700">
            {initialImage.file.name}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: Controls & Original Image Preview */}
        <div className="flex flex-col gap-6 order-2 lg:order-1">
          
          {/* Image Preview Card */}
          <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700 relative group overflow-hidden">
            <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded z-10">
                ORIGINAL
            </div>
            <img 
                src={initialImage.previewUrl} 
                alt="Original" 
                className="w-full h-64 md:h-96 object-contain rounded-lg bg-slate-900/50"
            />
          </div>

          {/* Prompt Input Section */}
          <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 shadow-xl">
            <label htmlFor="prompt-input" className="block text-sm font-bold text-slate-200 mb-2">
              How would you like to edit this image?
            </label>
            <div className="relative">
              <textarea
                id="prompt-input"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                disabled={isProcessing}
                placeholder="e.g., Make me smile, Remove the person in the background, Add a retro filter..."
                className="w-full bg-slate-900 border border-slate-700 rounded-xl p-4 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-yellow-500/50 focus:border-yellow-500 resize-none h-32"
              />
              <button
                onClick={handleGenerate}
                disabled={isProcessing || !prompt.trim()}
                className={`absolute bottom-3 right-3 px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-200 flex items-center
                  ${isProcessing || !prompt.trim() 
                    ? 'bg-slate-700 text-slate-400 cursor-not-allowed' 
                    : 'bg-yellow-500 hover:bg-yellow-400 text-slate-900 hover:shadow-lg hover:shadow-yellow-500/20'
                  }`}
              >
                {isProcessing ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-slate-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
                    </svg>
                    Generate Edit
                  </>
                )}
              </button>
            </div>

            {/* Suggestions Chips */}
            <div className="mt-4">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-2">Suggestions</p>
                <div className="flex flex-wrap gap-2">
                    {SUGGESTED_PROMPTS.map((suggestion, idx) => (
                        <button
                            key={idx}
                            onClick={() => setPrompt(suggestion)}
                            disabled={isProcessing}
                            className="text-xs py-1.5 px-3 rounded-full bg-slate-700/50 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-600 transition-colors"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>

            {/* Error Display */}
            {status === AppStatus.ERROR && errorMessage && (
              <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-red-500 shrink-0" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                 <span className="text-sm text-red-400">{errorMessage}</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Results */}
        <div className="order-1 lg:order-2">
          {status === AppStatus.SUCCESS && resultUrl ? (
             <div className="animate-fade-in flex flex-col h-full">
                <div className="bg-slate-900 rounded-2xl border border-yellow-500/30 overflow-hidden relative shadow-[0_0_40px_-10px_rgba(234,179,8,0.15)] h-full min-h-[400px] flex items-center justify-center">
                    <div className="absolute top-4 left-4 bg-yellow-500 text-slate-900 text-xs font-bold px-2 py-1 rounded z-10 shadow-lg">
                        GENERATED EDIT
                    </div>
                     <img 
                        src={resultUrl} 
                        alt="Edited result" 
                        className="w-full h-auto max-h-[600px] object-contain"
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-slate-900 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex justify-end">
                         <a 
                            href={resultUrl} 
                            download={`facefix-edit-${Date.now()}.png`}
                            className="bg-white text-slate-900 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-200 transition-colors flex items-center shadow-lg"
                         >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                            Download Image
                         </a>
                    </div>
                </div>
             </div>
          ) : (
            <div className="h-full min-h-[400px] bg-slate-800/30 rounded-2xl border-2 border-dashed border-slate-700 flex flex-col items-center justify-center p-8 text-slate-500">
                {isProcessing ? (
                    <div className="text-center">
                        <div className="inline-block relative w-20 h-20 mb-4">
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-slate-600 rounded-full opacity-20"></div>
                            <div className="absolute top-0 left-0 w-full h-full border-4 border-yellow-500 rounded-full border-t-transparent animate-spin"></div>
                        </div>
                        <h3 className="text-lg font-semibold text-white">Applying Magic...</h3>
                        <p className="text-sm mt-2">Our Nano Banana AI is editing your image.</p>
                    </div>
                ) : (
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <p>Your edited image will appear here.</p>
                    </div>
                )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};