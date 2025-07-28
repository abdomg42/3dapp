import React, { useState, useEffect } from 'react';
import HeartIcon from '../assets/icons/Heart.png';
import FavClickedIcon from '../assets/icons/Favclicked.png';
import { useFavoritesStore } from '../store/FavoritesStore';
import { useUserStore } from '../store/UserStore';
import { toast } from 'react-hot-toast';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  const { user } = useUserStore();
  const { favorites, toggleFavorite } = useFavoritesStore();
  const [isFavorite, setIsFavorite] = useState(false);

  // Get the correct product ID from different possible field names
  const getProductId = () => {
    return product.id || product.product_id || product._id;
  };

  // Check if this product is in favorites
  useEffect(() => {
    const productId = getProductId();
    const isInFavorites = favorites.some(fav => {
      const favProductId = fav.id || fav.product_id || fav._id;
      return favProductId === productId;
    });
    setIsFavorite(isInFavorites);
  }, [favorites, product]);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
      toast.error("Please login to add favorites");
      return;
    }

    const productId = getProductId();
    if (!productId) {
      toast.error("Product ID not found");
      return;
    }

    // Update UI immediately
    setIsFavorite(!isFavorite);
    
    try {
      await toggleFavorite(productId);
    } catch (error) {
      // Revert UI if API call fails
      setIsFavorite(!isFavorite);
    }
  };

  return (
    <div className="rounded-2xl border border-[#E0E0E0] shadow-md bg-white px-4 py-4 w-full flex flex-col h-full font-[Poppins] relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Favorite icon */}
      <button 
        className="absolute top-4 right-4 focus:outline-none hover:scale-110 transition-transform"
        onClick={handleFavoriteClick}
      >
        <img 
          src={isFavorite ? FavClickedIcon : HeartIcon} 
          alt="Favorite" 
          className={`w-7 h-7 transition-all duration-200 cursor-pointer ${
            isFavorite ? 'opacity-100 scale-110' : 'opacity-50 hover:opacity-75'
          }`} 
        />
      </button>
      {/* Product image */}
      <div className="flex justify-center items-center bg-[#FAFAFA] rounded-xl mb-6 mt-2 w-full" style={{ height: 170 }}>
        <img
          crossOrigin="anonymous"
          src={`http://localhost:3000/images${product.path}`}
          alt={product.name}
          className="w-full h-full object-contain max-h-38"
        />
      </div>
      {/* Product name */}
      <div className="font-bold text-2xl text-[#333] mb-6 ml-2">{product.name}</div>
      {/* Actions */}
      <div className="flex flex-col md:flex-row gap-2 mt-auto w-full">
        <a
          href={`http://localhost:3000/upload/${product.fichier_path}`}
          download={product.fichier_path}
          className="flex-1 min-w-[90px] whitespace-nowrap bg-[#A6E6B5] border border-[#333] text-[#333] font-medium rounded-xl px-3 py-1 text-sm md:px-5 md:py-2 md:text-base hover:bg-[#8fdca3] transition cursor-pointer text-center flex items-center justify-center"
        >
          Download
        </a>
        <Link
          to={`http://localhost:5173//products/${product.id}`}
          className="flex-1 min-w-[90px] whitespace-nowrap bg-white border border-[#333] text-[#333] font-medium rounded-xl px-3 py-1 text-sm md:px-5 md:py-2 md:text-base hover:bg-[#f3f3f3] transition cursor-pointer text-center flex items-center justify-center"
        >
          details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;