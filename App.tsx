import * as React from 'react';
import { useState } from 'react';
import { Header } from './components/Header';
import { UploadZone } from './components/UploadZone';
import { Editor } from './components/Editor';
import { ImageFile } from './types';

function App() {
  const [activeImage, setActiveImage] = useState<ImageFile | null>(null);

  const handleImageSelected = (image: ImageFile) => {
    setActiveImage(image);
  };

  const handleReset = () => {
    setActiveImage(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-800 to-slate-900 text-slate-100">
      <Header />
      
      <main className="flex-grow p-6 md:p-8 lg:p-12 flex flex-col items-center">
        
        {!activeImage ? (
          <div className="w-full max-w-2xl animate-fade-in-up">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400 mb-4">
                Reimagine your photos
              </h2>
              <p className="text-slate-400 text-lg max-w-lg mx-auto">
                Use AI to edit expressions, remove unwanted objects, or style your images with simple text prompts.
              </p>
            </div>
            
            <UploadZone onImageSelected={handleImageSelected} />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center opacity-70">
                <div className="p-4">
                    <div className="bg-slate-800/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        ✨
                    </div>
                    <h3 className="font-semibold text-white">Smart Edits</h3>
                    <p className="text-sm text-slate-400">Change expressions naturally</p>
                </div>
                <div className="p-4">
                     <div className="bg-slate-800/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        🧹
                    </div>
                    <h3 className="font-semibold text-white">Clean Up</h3>
                    <p className="text-sm text-slate-400">Remove objects instantly</p>
                </div>
                <div className="p-4">
                     <div className="bg-slate-800/50 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
                        🎨
                    </div>
                    <h3 className="font-semibold text-white">Creative Style</h3>
                    <p className="text-sm text-slate-400">Add filters & effects</p>
                </div>
            </div>
          </div>
        ) : (
          <Editor 
            initialImage={activeImage} 
            onReset={handleReset} 
          />
        )}

      </main>

      <footer className="py-6 text-center text-slate-600 text-sm border-t border-slate-800/50">
        <p>&copy; {new Date().getFullYear()} FaceFix AI. Built with Gemini 2.5 Flash Image.</p>
      </footer>

      <style>{`
        @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        .animate-fade-in-up {
            animation: fadeInUp 0.6s ease-out forwards;
        }
        .animate-fade-in {
            animation: fadeIn 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
}

export default App;