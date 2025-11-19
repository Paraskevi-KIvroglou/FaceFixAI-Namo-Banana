import * as React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="w-full py-6 px-6 md:px-12 flex items-center justify-between border-b border-slate-800 bg-slate-900/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/20">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <div>
            <h1 className="text-xl font-bold text-white tracking-tight">FaceFix AI</h1>
            <p className="text-xs text-slate-400 font-medium">Powered by Gemini 2.5 Flash</p>
        </div>
      </div>
      <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-sm font-semibold text-slate-400 hover:text-yellow-400 transition-colors">
        API Docs &rarr;
      </a>
    </header>
  );
};