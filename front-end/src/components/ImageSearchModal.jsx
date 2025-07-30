import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import gallery from '../assets/icons/gallery.png'

const ImageSearchModal = ({ onClose }) => {
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

  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
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
                {selectedFile ? 'Change Image' : 'Upload Image'}
              </button>
              {selectedFile && (
                <div className="mt-2 text-[#7A6B3F] font-medium text-center">
                  Selected: {selectedFile.name}
                </div>
              )}
            </div>
          </div>
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