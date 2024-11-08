'use client';

import { useState, useCallback, useEffect } from 'react';
import { Upload, X, Loader2, ZoomIn } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import ImagePreview from './image-preview';
import { initializeStorage } from '@/lib/supabase';
import { createClient } from '@/lib/auth/client/client'

type UploadedFile = {
  name: string;
  url: string;
};

interface FileUploadProps {
  onFilesUploaded: (files: UploadedFile[]) => void;
  uploadedFiles: UploadedFile[];
  onFileRemove: (url: string) => void;
}

export default function FileUpload({ onFilesUploaded, uploadedFiles, onFileRemove }: FileUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    initializeStorage('screenshots');
  }, []);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setUploading(true);
    setError(null);
    const newFiles: UploadedFile[] = [];

    try {
      for (const file of acceptedFiles) {
        const fileExt = file.name.split('.').pop();
        const uniqueId = crypto.randomUUID();
        const fileName = `${uniqueId}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('screenshots')
          .upload(fileName, file, {
            cacheControl: '3600',
            upsert: false
          });

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('screenshots')
          .getPublicUrl(fileName);

        newFiles.push({
          name: file.name,
          url: publicUrl,
        });
      }

      onFilesUploaded(newFiles);
    } catch (error: any) {
      console.error('Upload error:', error);
      setError(error.message || 'Failed to upload files. Please try again.');
    } finally {
      setUploading(false);
    }
  }, [supabase, onFilesUploaded]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    disabled: uploading,
  });

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Screenshots (Optional)
      </label>
      
      <div
        {...getRootProps()}
        className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md 
          ${isDragActive ? 'border-black bg-gray-50' : ''}
          ${uploading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:border-gray-400'}
        `}
      >
        <div className="space-y-1 text-center">
          {uploading ? (
            <Loader2 className="mx-auto h-12 w-12 text-gray-400 animate-spin" />
          ) : (
            <Upload className="mx-auto h-12 w-12 text-gray-400" />
          )}
          <div className="flex text-sm text-gray-600">
            <input {...getInputProps()} />
            <p className="text-center mx-auto">
              <span className="font-medium text-black hover:text-gray-800">
                Upload files
              </span>
              {' '}or drag and drop
            </p>
          </div>
          <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
        </div>
      </div>

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}

      {uploadedFiles.length > 0 && (
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {uploadedFiles.map((file) => (
            <div key={file.url} className="relative group">
              <div className="aspect-square relative overflow-hidden rounded-lg">
                <img
                  src={file.url}
                  alt={file.name}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity">
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setPreviewImage(file.url);
                      }}
                      className="p-2 bg-white rounded-full text-gray-900 hover:bg-gray-100 transition-colors"
                    >
                      <ZoomIn className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onFileRemove(file.url);
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {previewImage && (
        <ImagePreview
          imageUrl={previewImage}
          onClose={() => setPreviewImage(null)}
        />
      )}
    </div>
  );
}