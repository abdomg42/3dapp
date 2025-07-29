import React from 'react';

const ProductFormFields = ({ formData, handleInputChange, categories, formats, logiciels }) => {
  return (
    <>
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
            {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
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
            {formats.map(fmt => <option key={fmt} value={fmt}>{fmt}</option>)}
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
          {logiciels.map(log => <option key={log} value={log}>{log}</option>)}
        </select>
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
    </>
  );
};

export default ProductFormFields; 