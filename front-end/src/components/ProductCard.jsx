import React from 'react';
import HeartIcon from '../assets/icons/Heart.png';


const ProductCard = ({ product }) => {
  return (
    <div className="rounded-2xl border border-[#E0E0E0] shadow-md bg-white px-4 py-4 w-full flex flex-col h-full font-[Poppins] relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Favorite icon */}
      <button className="absolute top-4 right-4 focus:outline-none">
        <img src={HeartIcon} alt="Favorite" className='w-7 h-7 opacity-50' />
      </button>
      {/* Product image */}
      <div className="flex justify-center items-center bg-[#FAFAFA] rounded-xl mb-6 mt-2 w-full" style={{ height: 170 }}>
        <img
          crossorigin="anonymous"
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
          href="#"
          className="flex-1 min-w-[90px] whitespace-nowrap bg-[#A6E6B5] border border-[#333] text-[#333] font-medium rounded-xl px-3 py-1 text-sm md:px-5 md:py-2 md:text-base hover:bg-[#8fdca3] transition cursor-pointer text-center"
        >
          Download
        </a>
        <a
          href="#"
          className="flex-1 min-w-[90px] whitespace-nowrap bg-white border border-[#333] text-[#333] font-medium rounded-xl px-3 py-1 text-sm md:px-5 md:py-2 md:text-base hover:bg-[#f3f3f3] transition cursor-pointer text-center"
        >
          details
        </a>
      </div>
    </div>
  );
};

export default ProductCard;