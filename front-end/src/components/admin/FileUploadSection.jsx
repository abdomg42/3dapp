import React from 'react';

const FileUploadSection = ({ imageFile, modelFile, handleImageChange, handleModelFileChange }) => {
  const handleModelDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleModelFileChange({ target: { files: [droppedFile] } });
  };

  const handleImageDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleImageChange({ target: { files: [droppedFile] } });
  };

  return (
    <>
      {/* Model File Upload */}
      <div>
        <label className="block mb-2 text-[#333] font-medium">3D Model File *</label>
        <div 
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
          onDrop={handleModelDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          <input
            type="file"
            onChange={handleModelFileChange}
            accept=".3ds,.obj,.fbx,.dae,.blend,.max,.ma,.mb,.stl,.ply,.wrl,.vrml,.3dm,.skp,.dwg,.dxf,.iges,.step,.stp"
            className="hidden"
            id="model-file"
          />
          <label htmlFor="model-file" className="cursor-pointer">
            <p className="text-gray-600">
              {modelFile ? modelFile.name : 'Drag or Click to select 3D model file'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: 3DS, OBJ, FBX, DAE, BLEND, MAX, MA, MB, STL, PLY, WRL, VRML, 3DM, SKP, DWG, DXF, IGES, STEP, STP
            </p>
            <p className="text-sm text-gray-500">Max size: 100MB</p>
          </label>
        </div>
      </div>

      {/* Image Upload */}
      <div>
        <label className="block mb-2 text-[#333] font-medium">Product Image *</label>
        <div
          className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
          onDrop={handleImageDrop}
          onDragOver={(e) => e.preventDefault()}
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
              {imageFile ? imageFile.name : 'Drag or Click to select product image'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Supported formats: JPEG, PNG, GIF, WebP
            </p>
            <p className="text-sm text-gray-500">Max size: 5MB</p>
          </label>
        </div>
      </div>
    </>
  );
};

export default FileUploadSection; 