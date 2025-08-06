import React, { useEffect, useState } from 'react';
import { useProductStore } from '../../store/ProductStore';
import { toast } from 'react-hot-toast';
import { useCategoryStore } from '../../store/CategoryStore';
import { useFormatStore } from '../../store/FormatStore';
import { useLogicielStore } from '../../store/LogicielStore';
import ModelFilesUpload from './ModelFilesUpload';
import TextureFilesUpload from './TextureFilesUpload';
import ImageUpload from './ImageUpload';

const UploadPage = () => {
  const { categories, fetchCategories } = useCategoryStore();
  const { formats, fetchFormats } = useFormatStore();
  const { logiciels, fetchLogiciels } = useLogicielStore();

  useEffect(() => {
    fetchCategories();
    fetchFormats();
    fetchLogiciels();
  }, [fetchCategories, fetchFormats, fetchLogiciels]);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    format: '',
    logiciel: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [modelFiles, setModelFiles] = useState([]);
  const [textureFiles, setTextureFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const { addProduct } = useProductStore();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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
    if (modelFiles.length === 0) {
      toast.error('Please select at least one model file');
      return;
    }
    setLoading(true);
    try {
      const submitFormData = new FormData();
      submitFormData.append('name', formData.name);
      submitFormData.append('description', formData.description);
      submitFormData.append('category', formData.category);
      submitFormData.append('format', formData.format);
      submitFormData.append('logiciel', formData.logiciel);
      submitFormData.append('image', imageFile);
      modelFiles.forEach(file => {
        submitFormData.append('modelFiles', file);
      });
      textureFiles.forEach(file => {
        submitFormData.append('textureFiles', file);
      });
      await addProduct(submitFormData);
      setFormData({
        name: '',
        description: '',
        category: '',
        format: '',
        logiciel: ''
      });
      setImageFile(null);
      setModelFiles([]);
      setTextureFiles([]);
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
    setModelFiles([]);
    setTextureFiles([]);
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
        {/* Model Files Upload */}
        <ModelFilesUpload modelFiles={modelFiles} setModelFiles={setModelFiles} />
        {/* Texture Files Upload */}
        <TextureFilesUpload textureFiles={textureFiles} setTextureFiles={setTextureFiles} />
        {/* Image Upload */}
        <ImageUpload imageFile={imageFile} setImageFile={setImageFile} />
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