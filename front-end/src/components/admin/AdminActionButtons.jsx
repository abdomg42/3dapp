import React, { useState } from 'react';
import {Pencil, Trash, Edit } from 'lucide-react';
import { useUserStore } from '../../store/UserStore';
import { useProductStore } from '../../store/ProductStore';
import { toast } from 'react-hot-toast';

const AdminActionButtons = ({ product, onUpdate }) => {
  const { user } = useUserStore();
  const { deleteProduct } = useProductStore();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const isAdmin = user?.role === "admin";

  if (!isAdmin) return null;

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      await deleteProduct(product.id);
      setShowDeleteConfirm(false);
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error("Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleModify = () => {
    onUpdate(product);
  };

  return (
    <>
      <div className="absolute top-4 left-4 flex gap-2">
        <button
          onClick={handleModify}
          className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors"
          title="Edit Product"
        >
          <Pencil size={18} />
        </button>
        <button
          onClick={() => setShowDeleteConfirm(true)}
          className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
          title="Delete Product"
        >
          <Trash size={18} />
        </button>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
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
    </>
  );
};

export default AdminActionButtons; 