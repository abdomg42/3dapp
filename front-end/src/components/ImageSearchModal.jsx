import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { useProductSearchStore } from '../store/ProductSearchStore';
import gallery from '../assets/icons/gallery.png'

const ImageSearchModal = ({ onClose }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const { searchByImage, imageSearchLoading } = useProductSearchStore();

  // Prevent body scroll when modal is open
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onClose();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please select a valid image file (JPEG, PNG, GIF, WebP)');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image file size must be less than 5MB');
        return;
      }
      
      setSelectedFile(file);
      
      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleSearch = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    try {
      await searchByImage(selectedFile);
      
      // Navigate to image search results
      navigate('/image-search-results');
      
      onClose();
      
    } catch (error) {
      console.error('Image search error:', error);
      // Error is already handled in the store
    }
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const modalContent = (
    <div 
      onClick={handleBackdropClick}
      onKeyDown={handleKeyDown}
      tabIndex={-1}
      style={{position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 99999, backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'}}>

    <div 
        onClick={(e) => e.stopPropagation()}
        style={{backgroundColor: 'white',borderRadius: '0.75rem',boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          width: '100%',maxWidth: '42rem',maxHeight: '90vh',overflow: 'hidden',display: 'flex',flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-300">
          <h2 className="text-2xl font-semibold text-[#7A6B3F]">Search By Image</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full cursor-pointer transition-colors duration-200"
            aria-label="Close modal"
          >
            <span className="text-2xl text-gray-500 hover:text-gray-700">&times;</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-10">
          <div
            className="flex flex-col items-center justify-center border-2 border-dashed border-[#7d8cff] bg-white rounded-lg w-full"
            style={{ minHeight: 250 }}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {previewUrl ? (
              // Show image preview
              <div className="flex flex-col items-center justify-center w-full h-full p-6">
                <img 
                  src={previewUrl} 
                  alt="Preview" 
                  className="max-w-full max-h-48 object-contain rounded-lg shadow-sm"
                />
                <div className="mt-4 text-center">
                  <p className="text-[#7A6B3F] font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">Size: {(selectedFile.size / 1024 / 1024).toFixed(2)} MB</p>
                  <button
                    type="button"
                    onClick={handleRemoveFile}
                    className="mt-2 px-4 py-1 text-sm text-red-600 hover:text-red-800 underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ) : (
              // Show upload area
              <div className="flex flex-col items-center justify-center w-full h-full p-6 my-6">
                <img src={gallery} className='w-12 h-12 ' />
                <p className="mt-4 text-xl text-[#7A6B3F] font-medium text-center">Drag or Select<br />an image here</p>
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  style={{ display: 'none' }}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  className="cursor-pointer mt-6 mb-4 px-8 py-3 rounded-full bg-[#7d8cff] text-white text-lg font-semibold shadow hover:bg-[#5c6bc0] transition-colors duration-200"
                  onClick={() => fileInputRef.current && fileInputRef.current.click()}
                >
                  Upload Image
                </button>
              </div>
            )}
          </div>

          {/* Search Button */}
          {selectedFile && (
            <div className="mt-6 text-center">
              <button
                type="button"
                onClick={handleSearch}
                disabled={imageSearchLoading}
                className="cursor-pointer px-8 py-3 rounded-full bg-green-600 text-white text-lg font-semibold shadow hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                {imageSearchLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="loading loading-spinner loading-sm mr-2"></div>
                    Searching...
                  </div>
                ) : (
                  'Search by Image'
                )}
              </button>
              <p className="mt-2 text-sm text-gray-600">
                Find similar products based on this image using AI
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  // Render using React Portal
  const portalElement = document.getElementById('modal-root');
  
  if (!portalElement) {
    return modalContent;
  }

  try {
    return createPortal(modalContent, portalElement);
  } catch (error) {
    console.error('Portal creation failed:', error);
    return modalContent;
  }
};

export default ImageSearchModal; 