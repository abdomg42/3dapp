import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ProductCard from './ProductCard';
import ProductUpdateDialog from './admin/ProductUpdateDialog';
import { useProductStore } from '../store/ProductStore';
import { useUserStore } from '../store/UserStore';
import Pagination from './Pagination';

const SimilarProducts = ({ currentProduct, productsPerPage = 5 }) => {
  const { user } = useUserStore();
  const { products, fetchProducts, loading } = useProductStore();
  const [similarProducts, setSimilarProducts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  
  console.log("Current Product:", currentProduct);
  console.log("All Products:", products);
  console.log("Products length:", products.length);

  // Fetch products when component mounts
  useEffect(() => {
    if (products.length === 0) {
      console.log("Fetching products because products array is empty");
      fetchProducts();
    }
  }, [fetchProducts, products.length]);

  useEffect(() => {
    if (currentProduct && products.length > 0) {
     
      // Filter products with the same category as current product
      const filtered = products.filter(product => {
        const isSameCategory = product.category === currentProduct.category;
        const isNotSameProduct = product.product_id !== currentProduct.product_id;
        
        console.log(`Product ${product.name}: category=${product.category}, same=${isSameCategory}, notSame=${isNotSameProduct}`);
        
        return isSameCategory && isNotSameProduct;
      });
      
      console.log("Filtered similar products:", filtered);
      setSimilarProducts(filtered);
    }
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

  // Show loading state while products are being fetched
  if (loading && products.length === 0) {
    return (
      <div className="mt-8">
        <h3 className="text-2xl font-bold text-[#7A6B3F] mb-6">
          Similar Products
        </h3>
        <div className="flex justify-center items-center h-32">
          <div className="text-gray-500">Loading similar products...</div>
        </div>
      </div>
    );
  }

  // Don't show anything if no similar products
  if (similarProducts.length === 0) {
    return null;
  }

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
          </div>
        ))}
      </div>

       <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      
    </div>
  );
};

export default SimilarProducts; 