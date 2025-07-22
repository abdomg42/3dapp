import React from 'react';
import HeartIcon from '../assets/icons/Heart.png';

const ProductCard = ({ product }) => {
  return (
    <div className="rounded-2xl border border-[#E0E0E0] shadow-md bg-white p-4 w-80 font-[Poppins] relative" style={{ fontFamily: "'Poppins', sans-serif" }}>
      {/* Favorite icon */}
      <button  className="absolute top-4 right-4 focus:outline-none">
        <img src={HeartIcon} alt="Favorite" className='w-7 h-7  opacity-50' />
      </button>
      {/* Product image */}
      <div className="flex justify-center items-center bg-[#FAFAFA] rounded-xl mb-6 mt-2" style={{ height: 170 }}>
        <img
          crossorigin="anonymous"
          src={`http://localhost:3000/images${product.path}`}
          alt={product.name}
          className="w-[75%] h-full object-cover max-h-38"
        />
      </div>
      {/* Product name */}
      <div className="font-bold text-2xl text-[#333] mb-6 ml-2">{product.name}</div>
      {/* Actions */}
      <div className="flex items-center justify-between px-2 gap-4">
        <a
          href="#"
          // onClick={onDownload}
          className="bg-[#A6E6B5] border border-[#333]  text-[#333] font-medium rounded-xl px-8 py-2 pl-5 text-lg hover:bg-[#8fdca3] transition cursor-pointer text-center min-w-[130px]"
          
        >
          Download
        </a>
        <a
          href="#"
          // onClick={onDetails}
          className="bg-white border border-[#333] text-[#333] font-medium rounded-xl px-8 py-2 text-lg hover:bg-[#f3f3f3]   transition cursor-pointer text-center min-w-[130px]"
          
        >
          details
        </a>
      </div>
    </div>
  );
};

export default ProductCard;