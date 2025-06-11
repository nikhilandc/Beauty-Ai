import React, { useState } from 'react';
import { X, Upload, Trash2, Image as ImageIcon } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImageSelect: (imageUrl: string) => void;
  currentImage?: string | null;
}

export function ImageUploadModal({ isOpen, onClose, onImageSelect, currentImage }: ImageUploadModalProps) {
  const [previewImage, setPreviewImage] = useState<string | null>(currentImage || null);
  const [isDragging, setIsDragging] = useState(false);

  const handleImageUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error('Image size should be less than 5MB');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const imageUrl = reader.result as string;
      setPreviewImage(imageUrl);
      onImageSelect(imageUrl);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const file = e.dataTransfer.files[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setPreviewImage(null);
    onImageSelect('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full mx-4">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Upload Your Photo</h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {previewImage ? (
          <div className="relative">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-96 object-cover rounded-2xl"
            />
            <button
              onClick={removeImage}
              className="absolute top-4 right-4 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ) : (
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-2xl p-8 text-center ${
              isDragging
                ? 'border-pink-400 bg-pink-50 dark:bg-pink-900/10'
                : 'border-gray-300 dark:border-gray-600'
            }`}
          >
            <div className="flex flex-col items-center">
              <ImageIcon className="w-16 h-16 text-gray-400 dark:text-gray-500 mb-4" />
              <p className="text-lg mb-2">Drag and drop your photo here</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                or click to select a file
              </p>
              <label className="bg-gradient-to-r from-pink-400 to-purple-400 text-white px-6 py-3 rounded-full cursor-pointer hover:opacity-90 transition-opacity">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="hidden"
                />
                <Upload className="w-5 h-5 inline-block mr-2" />
                Choose File
              </label>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>Supported formats: JPG, PNG, GIF</p>
          <p>Maximum file size: 5MB</p>
        </div>
      </div>
    </div>
  );
}