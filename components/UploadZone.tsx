import * as React from 'react';
import { useRef, useState } from 'react';
import { ImageFile } from '../types';
import { fileToBase64, validateImageFile } from '../utils/imageUtils';

interface UploadZoneProps {
  onImageSelected: (image: ImageFile) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const processFile = async (file: File) => {
    if (!validateImageFile(file)) {
      alert("Please upload a valid JPG, PNG, or WebP image.");
      return;
    }
    
    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      onImageSelected({
        file,
        previewUrl,
        base64,
        mimeType: file.type
      });
    } catch (error) {
      console.error("Error processing file", error);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div 
      className={`relative group cursor-pointer rounded-2xl border-2 border-dashed transition-all duration-300 ease-in-out h-64 md:h-80 flex flex-col items-center justify-center p-8 text-center overflow-hidden
        ${isDragging 
          ? 'border-yellow-400 bg-slate-800/80 scale-[1.02]' 
          : 'border-slate-700 hover:border-slate-500 bg-slate-800/30 hover:bg-slate-800/50'
        }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input 
        type="file" 
        className="hidden" 
        ref={fileInputRef} 
        accept="image/png, image/jpeg, image/webp"
        onChange={handleFileSelect}
      />
      
      <div className="bg-slate-800 p-4 rounded-full mb-4 shadow-inner group-hover:scale-110 transition-transform duration-300">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      </div>
      
      <h3 className="text-lg font-semibold text-white mb-1">Upload an Image</h3>
      <p className="text-sm text-slate-400 max-w-xs mx-auto">
        Drag and drop your photo here, or click to browse files. 
        <br/>
        <span className="text-xs opacity-70">(JPG, PNG, WebP supported)</span>
      </p>
    </div>
  );
};