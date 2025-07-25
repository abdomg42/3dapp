import React, { useEffect, useState } from 'react';
import { PackageIcon, PlusCircleIcon, RefreshCwIcon } from "lucide-react";
import { useProductStore } from '../store/ProductStore';
import { useCategoryStore } from '../store/CategoryStore';
import ProductCard from '../components/ProductCard';
import Category from '../components/Category';

const filterOptions = [
  { value: 'popularity', label: 'Popularity' },
  { value: 'newest', label: 'Newest' },
  { value: 'oldest', label: 'Oldest' },
  { value: 'price_low', label: 'Price: Low to High' },
  { value: 'price_high', label: 'Price: High to Low' },
];

const Home = () => {
  const {products, loading, error, fetchProducts} = useProductStore();
  const {categories, loadingC , errorC, fetchCategories} = useCategoryStore();
  const [filter, setFilter] = useState('popularity');
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);
  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  return (
    <div className="min-h-screen flex flex-row">
      {/* Sidebar */}
      {categories && categories.length > 0 && (
        <aside className=" lg:w-64 flex-shrink-0  lg:h-screen pt-4 rounded-xl shadow sticky top-0 overflow-y-auto z-30">
          <Category />
        </aside>
      )}
      {/* Main Content */}
      <main className="flex-1 w-full px-4 py-8">
        <div className="flex flex-row justify-end items-center gap-2 mb-4">
          <select
            className="border border-gray-300 text-[#7A6B3F] rounded-lg px-4 py-3 text-base md:text-lg font-semibold focus:outline-none focus:ring-2 focus:ring-[#D6C16B] bg-white"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          >
            {filterOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button className="flex btn btn-ghost btn-circle bg-[#7A6B3F] text-white" onClick={fetchProducts && fetchCategories}>
            <RefreshCwIcon className="size-5" />
          </button>
        </div>
        {error && <div className="alert alert-error mb-8">{error}</div>}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg" />
          </div>
        ) : products.length === 0 && !loading ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="bg-base-100 rounded-full p-6">
              <PackageIcon className="size-12" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold ">No products found</h3>
              <p className="text-gray-500 max-w-sm">
                Get started by adding your first product to the inventory
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
            {products.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
export default Home;