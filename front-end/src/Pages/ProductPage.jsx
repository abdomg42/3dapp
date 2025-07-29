import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {Pencil, Trash, Edit } from 'lucide-react';
import { useProductStore } from '../store/ProductStore';
import SimilarProducts from '../components/SimilarProducts';
import HeartIcon from '../assets/icons/Heart.png';
import { toast } from 'react-hot-toast';
import AdminActionButtons from '../components/admin/AdminActionButtons';
import ProductUpdateDialog from '../components/admin/ProductUpdateDialog';
import { useUserStore } from '../store/UserStore';

const ProductPage = () => {
  const { id } = useParams();
  const { product, loading, error, fetchProduct, fetchProducts } = useProductStore();
  const { user } = useUserStore();
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (id) fetchProduct(id);
  }, [id, fetchProduct]);

  const handleDownload = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      // Get the file path from the product
      const filePath = product.fichier_path || product.path;
      if (!filePath) {
        toast.error("No file available for download");
        return;
      }

      // Create the full URL for the file
      const fileUrl = `http://localhost:3000/upload${filePath}`;
      
      // Create a temporary link element to trigger download
      const link = document.createElement('a');
      link.href = fileUrl;
      link.download = product.name || 'product-file';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success("Download started!");
    } catch (error) {
      console.error('Download error:', error);
      toast.error("Failed to download file");
    }
  };

  const handleUpdate = () => {
    setShowUpdateDialog(true);
  };

  const handleUpdateSuccess = () => {
    fetchProduct(id);
    fetchProducts();
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await useProductStore.getState().deleteProduct(product.id);
      setShowDeleteConfirm(false);
      toast.success("Product deleted successfully");
      // Optionally redirect after delete
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-96 text-lg">Loading...</div>;
  if (error) return <div className="flex justify-center items-center h-96 text-red-500 text-lg">{error}</div>;
  if (!product) return <div className="flex justify-center items-center h-96 text-gray-500 text-lg">Product not found.</div>;

  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-8xl px-4 mx-8 py-8">
      {/* Top section: image + info */}
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        {/* Left: Product Image */}
        <div className="flex-1 flex flex-col items-center justify-start">
          <span className="text-lg text-[#7A6B3F] font-medium mb-2 self-start ">
            {product.category_name || product.category || 'Category'} / {product.name}
          </span>
          <img
            crossOrigin="anonymous"
            src={`http://localhost:3000/images${product.path}`}
            alt={product.name}
            className="w-[520px] h-[520px] object-contain rounded-2xl p-4 my-2 shadow-md bg-[#fafafa]"
          />
        </div>
        {/* Right: Product Info */}
        <div className="flex-1 flex flex-col justify-center items-start gap-6 relative">
          {/* Admin Action Buttons */}
          {isAdmin && (
            <div className="absolute top-0 right-0 flex gap-2 z-10">
              <button
                onClick={handleUpdate}
                className="p-2 cursor-pointer bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
                title="Edit Product"
              >
                <Pencil size={18} />
              </button>
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="p-2 cursor-pointer bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Delete Product"
              >
                <Trash size={18} />
              </button>
            </div>
          )}
          <h1 className="text-2xl md:text-3xl font-bold text-[#333]">{product.name}</h1>
          <div>
            <span className="text-xl font-semibold text-[#333]">Description :</span>
            <p className="mt-2 text-lg text-gray-600">{product.description || 'No description available.'}</p>
          </div>
          <div className="flex gap-4 mt-4">
            <button 
              onClick={handleDownload}
              className="bg-[#A6E6B5] border border-[#333] text-[#333] font-medium rounded-xl px-8 py-2 text-lg hover:bg-[#8fdca3] transition flex items-center gap-2 cursor-pointer"
            >
              <span>Download</span>
            </button>
            <button className="border border-[#D6C16B] rounded-xl px-4 py-2 flex items-center justify-center hover:bg-[#f8f6f2] transition cursor-pointer">
              <img src={HeartIcon} alt="Favorite" className="w-7 h-7 opacity-70" />
            </button>
          </div>
        </div>
      </div>
      {/* Update Dialog */}
      {isAdmin && showUpdateDialog && (
        <ProductUpdateDialog
          product={product}
          isOpen={showUpdateDialog}
          onClose={() => setShowUpdateDialog(false)}
          onSuccess={handleUpdateSuccess}
        />
      )}
      {/* Delete Confirmation Modal */}
      {isAdmin && showDeleteConfirm && (
        <div className="fixed inset-0 bg-zinc-200 bg-opacity-90 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete "{product.name}"? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50"
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Similar Products */}
      <SimilarProducts currentProduct={product} />
    </div>
  );
};

export default ProductPage;