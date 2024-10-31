'use client';

import { X } from 'lucide-react';
import { useEffect } from 'react';

interface ImagePreviewProps {
  imageUrl: string;
  onClose: () => void;
}

export default function ImagePreview({ imageUrl, onClose }: ImagePreviewProps) {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75">
      <div className="relative max-w-4xl w-full">
        <button
          onClick={onClose}
          className="absolute -top-4 -right-4 p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors shadow-lg"
        >
          <X className="h-6 w-6" />
        </button>
        <img
          src={imageUrl}
          alt="Preview"
          className="w-full h-auto max-h-[80vh] object-contain rounded-lg"
        />
      </div>
    </div>
  );
}