import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProductStore } from '../store/ProductStore';
import ProductCard from '../components/ProductCard';
import HeartIcon from '../assets/icons/Heart.png';

const similarProducts = Array(7).fill({
  id: 1,
  name: 'Nordic Chair',
  path: '/chair.jpg',
});

const ProductPage = () => {
  const { id } = useParams();
  const { currentProduct, loading1, error1 , fetchProduct } = useProductStore();

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);
  console.log("currentProduct",currentProduct);
  if (loading1) return <div className="flex justify-center items-center h-96 text-lg">Loading...</div>;
  if (error1) return <div className="flex justify-center items-center h-96 text-red-500 text-lg">{error}</div>;
  if (!currentProduct) return <div className="flex justify-center items-center h-96 text-gray-500 text-lg">Product not found.</div>;

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top section: image + info */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left: Product Image */}
        <div className="flex-1 flex flex-col items-center justify-start">
          <span className="text-lg text-[#7A6B3F] font-medium mb-2 self-start">{currentProduct.category || 'Category'} / {currentProduct.name}</span>
          <img
            src={currentProduct.path ? `http://localhost:3000/images${currentProduct.path}` : '/chair.jpg'}
            alt={currentProduct.name}
            className="w-[320px] h-[320px] object-contain rounded-2xl shadow-md bg-[#fafafa]"
          />
        </div>
        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-center items-start gap-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#333]">{currentProduct.name}</h1>
          <div>
            <span className="text-xl font-semibold text-[#333]">Description :</span>
            <p className="mt-2 text-lg text-gray-600">{currentProduct.description || 'No description available.'}</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button className="bg-[#A6E6B5] border border-[#333] text-[#333] font-medium rounded-xl px-8 py-2 text-lg hover:bg-[#8fdca3] transition flex items-center gap-2">
              <span>Download</span>
            </button>
            <button className="border border-[#D6C16B] rounded-xl px-4 py-2 flex items-center justify-center hover:bg-[#f8f6f2] transition">
              <img src={HeartIcon} alt="Favorite" className="w-7 h-7 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      {/* Similar Models */}
      <div>
        <h2 className="text-xl font-semibold text-[#7A6B3F] mb-4">Similar Models</h2>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {similarProducts.map((product, idx) => (
            <div key={idx} className="min-w-[220px]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductPage;