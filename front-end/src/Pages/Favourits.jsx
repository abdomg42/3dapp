import React, { useEffect } from 'react';
import { PackageIcon, HeartIcon } from "lucide-react";
import { useFavoritesStore } from '../store/FavoritesStore';
import { useUserStore } from '../store/UserStore';
import ProductCard from '../components/ProductCard';
import { Navigate } from 'react-router-dom';

const Favourits = () => {
  const { user } = useUserStore();
  const { favorites, loading, error, fetchFavorites } = useFavoritesStore();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user, fetchFavorites]);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen w-full px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#7A6B3F] mb-2">
          My Favorites
        </h1>
        <p className="text-gray-600 text-lg">
          Your saved products and models
        </p>
      </div>

      {/* Content */}
      {error && (
        <div className="alert alert-error mb-8">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="loading loading-spinner loading-lg" />
        </div>
      ) : favorites.length === 0 ? (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full p-6">
            <HeartIcon className="size-12 text-gray-400" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold text-gray-600">No favorites yet</h3>
            <p className="text-gray-500 max-w-sm">
              Start adding products to your favorites by clicking the heart icon on any product
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6 lg:gap-8">
          {favorites.map((product, idx) => (
            <ProductCard key={idx || product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favourits;