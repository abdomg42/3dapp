import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.bmp', '.tga', '.tiff', '.psd', '.dds', '.ktx', '.pvr', '.hdr', '.exr'];

export default function TextureFilesUpload({ textureFiles, setTextureFiles }) {
  const [showDropzone, setShowDropzone] = useState(false);

  const handleTextureFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error(`${file.name} is not a valid texture file`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 50MB)`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      setTextureFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} texture file(s) added`);
      setShowDropzone(false);
    }
  };

  const handleTextureDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error(`${file.name} is not a valid texture file`);
        return false;
      }
      if (file.size > 50 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 50MB)`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      setTextureFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} texture file(s) added`);
      setShowDropzone(false);
    }
  };

  const handleRemoveTexture = (index) => {
    setTextureFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block mb-2 text-[#333] font-medium">Texture Files (Optional)</label>
      {textureFiles.length > 0 && (
        <div className="space-y-2">
          {textureFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-4 border-2 border-dashed border-orange-400 rounded-lg p-4 bg-orange-50">
              <div className="text-3xl">🎨</div>
              <div className="flex-1">
                <div className="font-medium text-orange-700">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button type="button" onClick={() => handleRemoveTexture(index)} className="p-1 rounded-full hover:bg-orange-200">
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      {textureFiles.length === 0 || showDropzone ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-orange-500 transition-colors"
          onDrop={handleTextureDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            onChange={handleTextureFileChange}
            accept={allowedExtensions.join(',')}
            className="hidden"
            id="texture-files"
            multiple
          />
          <label htmlFor="texture-files" className="cursor-pointer">
            <p className="text-gray-600">
              Drag or Click to select texture files (Multiple files allowed)
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPG, PNG, BMP, TGA, TIFF, PSD, DDS, KTX, PVR, HDR, EXR
            </p>
            <p className="text-sm text-gray-500">Max size: 50MB per file</p>
            <p className="text-xs text-orange-600 mt-2">
              All files will be compressed into a single archive with model files
            </p>
          </label>
        </div>
      ) : (
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 transition"
          onClick={() => setShowDropzone(true)}
        >
          Add more texture files
        </button>
      )}
    </div>
  );
} 