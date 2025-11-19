export enum AppStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR',
}

export interface EditedImage {
  originalUrl: string;
  generatedUrl: string;
  prompt: string;
  timestamp: number;
}

export interface ImageFile {
  file: File;
  previewUrl: string;
  base64: string;
  mimeType: string;
}

export const SUGGESTED_PROMPTS = [
  "Make the person smile naturally",
  "Remove the background",
  "Add a retro film grain filter",
  "Remove blemishes from the face",
  "Make the lighting more dramatic",
  "Turn this into a line art sketch",
  "Add a pair of cool sunglasses",
  "Change hair color to blonde"
];