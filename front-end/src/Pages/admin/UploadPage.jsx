import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../store/ProductStore';
import { toast } from 'react-hot-toast';
import { X } from 'lucide-react';
import { useCategoryStore } from '../../store/CategoryStore';
import { useFormatStore } from '../../store/FormatStore';
import { useLogicielStore } from '../../store/LogicielStore';

const UploadPage = () => {
  // Move hooks inside the component
  const { categories, loadingC, errorC, fetchCategories } = useCategoryStore();
  const { formats, fetchFormats } = useFormatStore();
  const { logiciels, fetchLogiciels } = useLogicielStore();

  useEffect(() => {
    fetchCategories();
    fetchFormats();
    fetchLogiciels();
  }, [fetchCategories, fetchFormats, fetchLogiciels]);


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

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    format: '',
    logiciel: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFile, setModelFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const { addProduct } = useProductStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate image file
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
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

  const handleModelFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate 3D model file
      const allowedExtensions = ['.3ds', '.zip', '.rar', '.obj', '.fbx', '.dae', '.blend', '.max', '.ma', '.mb', '.stl', '.ply', '.wrl', '.vrml', '.3dm', '.skp', '.dwg', '.dxf', '.iges', '.step', '.stp'];
      const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
      
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error('Please select a valid 3D model file');
        return;
      }
      if (file.size > 100 * 1024 * 1024) { // 100MB limit
        toast.error('Model file size must be less than 100MB');
        return;
      }
      setModelFile(file);
    }
  };

  const handleRemoveModel = () => {
    setModelFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.category || !formData.format || !formData.logiciel) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!imageFile) {
      toast.error('Please select an image file');
      return;
    }

    if (!modelFile) {
      toast.error('Please select a model file');
      return;
    }

    setLoading(true);

    try {
      const submitFormData = new FormData();
      
      // Add text fields
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('format', formData.format);
      submitFormData.append('logiciel', formData.logiciel);
      
      // Add files
      submitFormData.append('image', imageFile);
      submitFormData.append('file', modelFile);

      await addProduct(submitFormData);
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        category: '',
        format: '',
        logiciel: ''
      });
      setImageFile(null);
      setModelFile(null);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload product');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: '',
      description: '',
      category: '',
      format: '',
      logiciel: ''
    });
    setImageFile(null);
    setModelFile(null);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8 pb-10 font-[Poppins]" style={{ fontFamily: "'Poppins', sans-serif" }}>
      <h1 className="text-3xl font-bold text-[#333] mb-8 text-center">Upload New Product</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Product Name */}
        <div>
          <label className="block mb-2 text-[#333] font-medium">Product Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product name"
            required
          />
        </div>

        {/* Category and Format */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block mb-2 text-[#333] font-medium">Category *</label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
            <option value="">Select Category</option>
            {categories && categories.map(cat => (
              <option key={cat.id} value={cat.name }>
                {cat.name || cat}
              </option>
            ))}
            </select>
          </div>
          
          <div>
            <label className="block mb-2 text-[#333] font-medium">Format *</label>
            <select
              name="format"
              value={formData.format}
              onChange={handleInputChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
            <option value="">Select Format</option>
            {formats && formats.map(fmt => (
              <option key={fmt.id} value={fmt.extension }>
                {fmt.extension }
              </option>
            ))}
            </select>
          </div>
        </div>

        {/* Software */}
        <div>
          <label className="block mb-2 text-[#333] font-medium">Logiciel *</label>
          <select
            name="logiciel"
            value={formData.logiciel}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="">Select Logiciel</option>
            {logiciels && logiciels.map(log => (
              <option key={log.id } value={log.name}>
                {log.name }
              </option>
            ))}
          </select>
        </div>

        {/* Model File Upload */}
        <div>
          <label className="block mb-2 text-[#333] font-medium">3D Model File *</label>
          {modelFile ? (
            <div className="flex items-center gap-4 border-2 border-dashed border-blue-400 rounded-lg p-4 bg-blue-50">
              <div className="text-3xl">📦</div>
              <div className="flex-1">
                <div className="font-medium text-blue-700">{modelFile.name}</div>
                <div className="text-xs text-gray-500">{(modelFile.size / 1024 / 1024).toFixed(2)} MB</div>
              </div>
              <button type="button" onClick={handleRemoveModel} className="p-1 rounded-full hover:bg-blue-200">
                <X size={20} />
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors"
              onDrop={handleModelDrop}
              onDragOver={(e) => e.preventDefault()}
            >
              <input
                type="file"
                onChange={handleModelFileChange}
                accept=".3ds,.obj,.fbx,.zip,.rar,.dae,.blend,.max,.ma,.mb,.stl,.ply,.wrl,.vrml,.3dm,.skp,.dwg,.dxf,.iges,.step,.stp"
                className="hidden"
                id="model-file"
              />
              <label htmlFor="model-file" className="cursor-pointer">
                <p className="text-gray-600">
                  Drag or Click to select 3D model file
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  Supported formats: 3DS, OBJ, FBX, DAE, BLEND, MAX, MA, MB, STL, PLY, WRL, VRML, 3DM, SKP, DWG, DXF, IGES, STEP, STP
                </p>
                <p className="text-sm text-gray-500">Max size: 100MB</p>
              </label>
            </div>
          )}
        </div>

        {/* Image Upload */}
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
              onDrop={handleImageDrop}
              onDragOver={(e) => e.preventDefault()} >
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

        {/* Description */}
        <div>
          <label className="block mb-2 text-[#333] font-medium">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white text-black min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter product description..."
          />
          <button
            type="button"
            className="border-2 border-purple-600 bg-white text-purple-500 rounded-lg px-4 py-1.5 ml-2 font-bold shadow-md shadow-purple-300/20 cursor-pointer hover:bg-purple-50 hover:shadow-lg hover:-translate-y-0.5 transition duration-200 ease-in-out"
          >
            ✨ Generate
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 bg-gray-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Uploading...' : 'Upload Product'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default UploadPage;