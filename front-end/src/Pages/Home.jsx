import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/ProductStore';
import { useCategoryStore } from '../store/CategoryStore';
import { useFavoritesStore } from '../store/FavoritesStore';
import { useUserStore } from '../store/UserStore';
import ProductCard from '../components/ProductCard';
import Category from '../components/Category';
import Formats from '../components/Formats';
import Logiciels from '../components/Logiciels';
import { RefreshCwIcon } from 'lucide-react';

const Home = () => {
  const { products, loading, error, fetchProducts } = useProductStore();
  const { categories, fetchCategories } = useCategoryStore();
  const { fetchFavorites } = useFavoritesStore();
  const { user } = useUserStore();
  const [sort, setSort] = useState('newest');

  const filterOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'name-asc', label: 'Name A-Z' },
    { value: 'name-desc', label: 'Name Z-A' }
  ];

  useEffect(() => {
    fetchProducts(sort);
    fetchCategories();
    if (user) {
      fetchFavorites();
    }
  }, [fetchProducts, fetchCategories, fetchFavorites, user, sort]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const handleRefresh = () => {
    fetchProducts(sort);
    fetchCategories();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-200">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-200">
        <div className="alert alert-error">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      {categories && categories.length > 0 && (
        <aside className="lg:w-64 flex-shrink-0 lg:h-screen pt-4 rounded-xl shadow sticky top-0 overflow-y-auto z-30 bg-white p-4 my-2">
          <div className="space-y-6">
            <Category />
            <Formats />
            <Logiciels />
          </div>
        </aside>
      )}
      
      {/* Main Content */}
      <main className="flex-1 w-full px-4 py-8">
        <div className="flex flex-row justify-between items-center gap-2 mb-4">
          {/* Product Count */}
          <div className="text-lg font-semibold text-[#7A6B3F]">
            {products.length} {products.length < 2 ? 'Product' : 'Products'} Found
          </div>
          
          {/* Filter and Refresh */}
          <div className="flex items-center gap-2">
            <select
              className="border border-gray-300 text-[#7A6B3F] rounded-lg px-4 py-3 text-base md:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#D6C16B] bg-white"
              value={sort}
              onChange={handleSortChange}
            >
              {filterOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button 
              className="flex btn btn-ghost btn-circle bg-[#7A6B3F] text-white" 
              onClick={handleRefresh}
            >
              <RefreshCwIcon className="size-5" />
            </button>
          </div>
        </div>
        
        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {products.map((product, idx) => (
            <ProductCard key={product.id || idx} product={product} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Home;