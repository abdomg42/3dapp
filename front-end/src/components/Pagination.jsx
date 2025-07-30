import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  const getPages = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
    return pages;
  };

  return (
    <nav className="flex justify-center items-center mt-10">
      <div className="flex gap-1 px-4 py-2 rounded-full shadow bg-white/80 backdrop-blur border border-gray-200">
        <button
          className="p-2 rounded-full text-[#7A6B3F] hover:bg-[#f5eecb] transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft size={20} />
        </button>
        {getPages().map((page) => (
          <button
            key={page}
            className={`px-3 py-1 rounded-full font-semibold transition-all duration-150
              ${page === currentPage
                ? 'bg-[#7A6B3F] text-white shadow-md scale-105'
                : 'bg-transparent text-[#7A6B3F] hover:bg-[#f5eecb]'}
            `}
            onClick={() => onPageChange(page)}
            disabled={page === currentPage}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </button>
        ))}
        <button
          className="p-2 rounded-full text-[#7A6B3F] hover:bg-[#f5eecb] transition disabled:opacity-40 disabled:cursor-not-allowed"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </nav>
  );
};

export default Pagination; 