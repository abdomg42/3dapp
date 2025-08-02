import React, { useEffect, useState } from 'react';
import { useProductSearchStore } from '../store/ProductSearchStore';
import ProductCard from '../components/ProductCard';
import FilterHeader from '../components/FilterHeader';
import Pagination from '../components/Pagination';
import { SearchIcon, ImageIcon, TrendingUpIcon } from 'lucide-react';

const ImageSearchResults = () => {
  const { 
    imageSearchResults, 
    imageSearchLoading, 
    imageSearchStats, 
    uploadedImageInfo,
    clearImageSearchResults 
  } = useProductSearchStore();

  console.log(' ImageSearchResults Debug:', {
    imageSearchResults,
    imageSearchLoading,
    imageSearchStats,
    uploadedImageInfo,
    resultsLength: imageSearchResults?.length,
    resultsType: typeof imageSearchResults,
    isArray: Array.isArray(imageSearchResults),
    condition: imageSearchResults.length === 0,
    rawResults: imageSearchResults
  });

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    // Clear results when component unmounts
    return () => {
      clearImageSearchResults();
    };
  }, [clearImageSearchResults]);

  // Calculate paginated results
  const totalPages = Math.ceil(imageSearchResults.length / itemsPerPage);
  const paginatedResults = imageSearchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (imageSearchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FilterHeader 
          title="Image Search Results"
          subtitle="Analyzing image and finding similar products..."
        />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="loading loading-spinner loading-lg"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <FilterHeader 
        title="Image Search Results"
        subtitle={`${imageSearchResults.length} similar products found`}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Info */}
        <div className="mb-6 p-6 bg-white rounded-lg shadow-sm">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              <ImageIcon className="w-8 h-8 text-blue-600" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                AI-Powered Image Search
              </h3>
              <p className="text-gray-600 mb-4">
                Found similar products based on your uploaded image using CLIP AI technology.
              </p>
              
              {/* Uploaded Image Info */}
              {uploadedImageInfo && (
                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Uploaded Image:</h4>
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                      <ImageIcon className="w-6 h-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{uploadedImageInfo.filename}</p>
                      <p className="text-xs text-gray-500">
                        {(uploadedImageInfo.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Search Statistics */}
              {imageSearchStats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{imageSearchStats.found_products}</div>
                    <div className="text-xs text-gray-600">Found in Index</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{imageSearchStats.similar_products}</div>
                    <div className="text-xs text-gray-600">Similar Found</div>
                  </div>
                  <div className="text-center p-3 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{(imageSearchStats.max_similarity * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Best Match</div>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <div className="text-2xl font-bold text-purple-600">{(imageSearchStats.min_similarity * 100).toFixed(1)}%</div>
                    <div className="text-xs text-gray-600">Lowest Match</div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {(imageSearchResults && imageSearchResults.length > 0) ? (
          <>
            {/* Results Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {paginatedResults.map((product, idx) => (
                <div key={product.id || idx} className="relative">
                  <ProductCard product={product} />
                  {/* Similarity Score Badge */}
                  {product.similarity_score && (
                    <div className="absolute top-2 right-2 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                      {(product.similarity_score * 100).toFixed(0)}%
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="bg-white rounded-full p-6 shadow-sm">
              <SearchIcon className="size-12 text-gray-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">No similar products found</h3>
              <p className="text-gray-500 max-w-sm">
                Try uploading a different image or check if your product database has embeddings.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageSearchResults; 