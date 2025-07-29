import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { useProductStore } from '../../store/ProductStore';
import { toast } from 'react-hot-toast';

const ProductUpdateDialog = ({ product, isOpen, onClose, onSuccess }) => {
  const { updateProduct, formats, logiciels, fetchFormats, fetchLogiciels } = useProductStore();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    format: '',
    logiciel: ''
  });
  const [loading, setLoading] = useState(false);

  const categories = ['Cat1', 'Category 2', 'Category 3'];

  useEffect(() => {
    if (product && isOpen) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        category: product.category_name || '',
        format: product.format_extension || '',
        logiciel: product.logiciel_name || ''
      });
    }
  }, [product, isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchFormats();
      fetchLogiciels();
    }
  }, [isOpen, fetchFormats, fetchLogiciels]);

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

    setLoading(true);
    try {
      await updateProduct(product.id, formData);
      toast.success('Product updated successfully');
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Failed to update product');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-zinc-200 bg-opacity-90 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-lg">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Update Product</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Product Name *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category *
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Category</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
          </div>

          {/* Format */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Format *
            </label>
            <select
              name="format"
              value={formData.format}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Format</option>
              {formats.map(format => (
                <option key={format.id} value={format.extension}>{format.extension}</option>
              ))}
            </select>
          </div>

          {/* Logiciel */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Logiciel *
            </label>
            <select
              name="logiciel"
              value={formData.logiciel}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Select Logiciel</option>
              {logiciels.map(logiciel => (
                <option key={logiciel.id} value={logiciel.name}>{logiciel.name}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductUpdateDialog; 