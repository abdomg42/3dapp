import React, { useState } from 'react';
import { X } from 'lucide-react';
import { toast } from 'react-hot-toast';

const allowedExtensions = ['.3ds', '.zip', '.rar', '.obj', '.fbx', '.dae', '.blend', '.max', '.ma', '.mb', '.stl', '.ply', '.wrl', '.vrml', '.3dm', '.skp', '.dwg', '.dxf', '.iges', '.step', '.stp'];

export default function ModelFilesUpload({ modelFiles, setModelFiles }) {
  const [showDropzone, setShowDropzone] = useState(false);

  const handleModelFileChange = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error(`${file.name} is not a valid 3D model file`);
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 100MB)`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      setModelFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} model file(s) added`);
      setShowDropzone(false);
    }
  };

  const handleModelDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    const validFiles = files.filter(file => {
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error(`${file.name} is not a valid 3D model file`);
        return false;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 100MB)`);
        return false;
      }
      return true;
    });
    if (validFiles.length > 0) {
      setModelFiles(prev => [...prev, ...validFiles]);
      toast.success(`${validFiles.length} model file(s) added`);
      setShowDropzone(false);
    }
  };

  const handleRemoveModel = (index) => {
    setModelFiles(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div>
      <label className="block mb-2 text-[#333] font-medium">3D Model Files *</label>
      {modelFiles.length > 0 && (
        <div className="space-y-2">
          {modelFiles.map((file, index) => (
            <div key={index} className="flex items-center gap-4 border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50">
              <div className="text-3xl">📦</div>
              <div className="flex-1">
                <div className="font-medium text-blue-700">{file.name}</div>
                <div className="text-xs text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button type="button" onClick={() => handleRemoveModel(index)} className="p-1 rounded-full hover:bg-blue-200">
                <X size={20} />
              </button>
            </div>
          ))}
        </div>
      )}
      {modelFiles.length === 0 || showDropzone ? (
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
          onDrop={handleModelDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            onChange={handleModelFileChange}
            accept={allowedExtensions.join(',')}
            className="hidden"
            id="model-files"
            multiple
          />
          <label htmlFor="model-files" className="cursor-pointer">
            <p className="text-gray-600">
              Drag or Click to select 3D model files (Multiple files allowed)
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: 3DS, OBJ, FBX, DAE, BLEND, MAX, MA, MB, STL, PLY, WRL, VRML, 3DM, SKP, DWG, DXF, IGES, STEP, STP
            </p>
            <p className="text-sm text-gray-500">Max size: 100MB per file</p>
            <p className="text-xs text-blue-600 mt-2">
              All files will be compressed into a single archive
            </p>
          </label>
        </div>
      ) : (
        <button
          type="button"
          className="mt-2 px-4 py-2 bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition"
          onClick={() => setShowDropzone(true)}
        >
          Add more model files
        </button>
      )}
    </div>
  );
} 