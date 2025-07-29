import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import AdminActionButtons from './admin/AdminActionButtons';
import ProductUpdateDialog from './admin/ProductUpdateDialog';
import { useProductStore } from '../store/ProductStore';
import { useUserStore } from '../store/UserStore';

const SimilarProducts = ({ currentProduct, productsPerPage = 5 }) => {
  const { user } = useUserStore();
  const { products, fetchProducts } = useProductStore();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  console.log("Current Product:", currentProduct);
 
  useEffect(() => {
    
      // Filter products with the same category as current product
      const filtered = products.filter(product => 
        product.product_id  !==  currentProduct.product_id && 
        product.category === currentProduct.category
      );
      setSimilarProducts(filtered);
      
  }, [currentProduct, products]);

  const totalPages = Math.ceil(similarProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const currentProducts = similarProducts.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleUpdate = (product) => {
    setSelectedProduct(product);
    setShowUpdateDialog(true);
  };

  const handleUpdateSuccess = () => {
    fetchProducts();
  };

  // if (similarProducts.length === 0) {
  //   return null;
  // }

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold text-[#7A6B3F] mb-6">
        Similar Products ({similarProducts.length})
      </h3>

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-6">
        {currentProducts.map((product, idx) => (
          <div key={product.product_id || idx} className="relative">
            <ProductCard product={product} />
            <AdminActionButtons 
              product={product} 
              onUpdate={handleUpdate}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft size={20} />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-2 rounded-lg border ${
                currentPage === page
                  ? 'bg-[#7A6B3F] text-white border-[#7A6B3F]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      {/* Update Dialog */}
      {selectedProduct && (
        <ProductUpdateDialog
          product={selectedProduct}
          isOpen={showUpdateDialog}
          onClose={() => setShowUpdateDialog(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
    </div>
  );
};

export default SimilarProducts; 