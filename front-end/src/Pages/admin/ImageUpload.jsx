import React from 'react';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';

const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

export default function ImageUpload({ imageFile, setImageFile }) {
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }
      setImageFile(file);
      toast.success('Image selected successfully');
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  };

  return (
    <div>
      <label className="block mb-2 text-[#333] font-medium">Product Image *</label>
      {imageFile ? (
        <div className="flex items-center gap-4 border-2 border-dashed border-green-400 rounded-lg p-4 bg-green-50">
          <img
            src={URL.createObjectURL(imageFile)}
            alt="Preview"
            className="w-20 h-20 object-contain rounded-lg border"
          />
          <div className="flex-1">
            <div className="font-medium text-green-700">{imageFile.name}</div>
            <div className="text-xs text-gray-500">{(imageFile.size / 1024).toFixed(1)} KB</div>
          </div>
          <button type="button" onClick={handleRemoveImage} className="p-1 rounded-full hover:bg-green-200">
            <X size={20} />
          </button>
        </div>
      ) : (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
        >
          <input
            type="file"
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
            id="image-file"
          />
          <label htmlFor="image-file" className="cursor-pointer">
            <div className="text-4xl mb-2">🖼️</div>
            <p className="text-gray-600">
              Drag or Click to select product image
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP
            </p>
            <p className="text-sm text-gray-500">Max size: 5MB</p>
          </label>
        </div>
      )}
    </div>
  );
} 