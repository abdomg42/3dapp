import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/ProductStore';
import ProductCard from '../components/ProductCard';
import FilterHeader from '../components/FilterHeader';
import { PackageIcon } from 'lucide-react';

const CategoryFilter = () => {
  const { categoryName } = useParams();
  const { products, loading, error, fetchProductsByCategory } = useProductStore();
  const [sort, setSort] = useState('newest');

  useEffect(() => {
    if (categoryName) {
      fetchProductsByCategory(decodeURIComponent(categoryName), sort);
    }
  }, [categoryName, sort, fetchProductsByCategory]);

  const decodedCategoryName = decodeURIComponent(categoryName || '');

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FilterHeader 
          title={decodedCategoryName}
          subtitle={`Products in ${decodedCategoryName} category`}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FilterHeader 
          title={decodedCategoryName}
          subtitle={`Products in ${decodedCategoryName} category`}
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="alert alert-error">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterHeader 
        title={decodedCategoryName}
        subtitle={`${products.length} products found in ${decodedCategoryName} category`}
        filters={[decodedCategoryName]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Sort Controls */}
        <div className="flex justify-end mb-6">
          <select
            value={sort}
            onChange={handleSortChange}
            className="border border-gray-300 text-[#7A6B3F] rounded-lg px-4 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#D6C16B] bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div>

        {products.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="bg-white rounded-full p-6 shadow-sm">
              <PackageIcon className="size-12 text-gray-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-500 max-w-sm">
                No products found in the "{decodedCategoryName}" category
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {products.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryFilter; 