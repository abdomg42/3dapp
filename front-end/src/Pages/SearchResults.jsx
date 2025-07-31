import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProductSearchStore } from '../store/ProductSearchStore';
import ProductCard from '../components/ProductCard';
import FilterHeader from '../components/FilterHeader';
import Pagination from '../components/Pagination';
import { SearchIcon, PackageIcon } from 'lucide-react';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const { searchResults, searchLoading, searchProductsForPage } = useProductSearchStore();
  const [sort, setSort] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    if (query.trim()) {
      searchProductsForPage(query);
    }
  }, [query, searchProductsForPage]);

  // Reset to page 1 if search results change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchResults]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const getHighlightedText = (text, searchQuery) => {
    if (!searchQuery) return text;
    const regex = new RegExp(`(${searchQuery})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  // Calculate paginated search results
  const totalPages = Math.ceil(searchResults.length / itemsPerPage);
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (searchLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <FilterHeader 
          title={`Search Results for "${query}"`}
          subtitle="Searching..."
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
        title={`Search Results for "${query}"`}
        subtitle={`${searchResults.length} products found`}
        filters={[query]}
      />
      
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Info */}
        <div className="mb-6 p-4 bg-white rounded-lg shadow-sm">
          <div className="flex items-center space-x-3">
            <SearchIcon className="w-6 h-6 text-gray-500" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Search Results for "
                <span 
                  className="text-blue-600"
                  dangerouslySetInnerHTML={{ 
                    __html: getHighlightedText(query, query) 
                  }}
                />
                "
              </h3>
              <p className="text-sm text-gray-600">
                Found {searchResults.length} product{searchResults.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Sort Controls after */}
        {/* <div className="flex justify-end mb-6">
          <select
            value={sort}
            onChange={handleSortChange}
            className="border border-gray-300 text-[#7A6B3F] rounded-lg px-4 py-2 text-base font-semibold focus:outline-none focus:ring-2 focus:ring-[#D6C16B] bg-white"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
          </select>
        </div> */}

        {searchResults.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-96 space-y-4">
            <div className="bg-white rounded-full p-6 shadow-sm">
              <PackageIcon className="size-12 text-gray-400" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-semibold text-gray-900">No products found</h3>
              <p className="text-gray-500 max-w-sm">
                No products found for "{query}". Try a different search term.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {paginatedResults.map((product, idx) => (
              <ProductCard key={product.id || idx} product={product} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        )}
      </div>
    </div>
  );
};

export default SearchResults; 