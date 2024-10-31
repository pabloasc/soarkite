'use client';

import { useState } from 'react';
import { ZoomIn } from 'lucide-react';
import ImagePreview from './request-form/image-preview';

interface RequestScreenshotsProps {
  screenshots: string[];
}

export default function RequestScreenshots({ screenshots }: RequestScreenshotsProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {screenshots.map((url, index) => (
          <div
            key={url}
            className="relative group cursor-pointer aspect-square"
            onClick={() => setSelectedImage(url)}
          >
            <img
              src={url}
              alt={`Screenshot ${index + 1}`}
              className="h-full w-full object-cover rounded-lg transition-transform group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity rounded-lg">
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                <div className="p-2 bg-white rounded-full text-gray-900">
                  <ZoomIn className="h-4 w-4" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedImage && (
        <ImagePreview
          imageUrl={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}
    </>
  );
}