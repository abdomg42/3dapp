import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductSearchStore } from '../store/ProductSearchStore';
import SearchIcon from '../assets/icons/SearchIcon.png';
import Cam from '../assets/icons/Cam.png';

const SearchBar = () => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { searchResults, searchLoading, searchProducts, clearSearchResults } = useProductSearchStore();
  const navigate = useNavigate();
  const searchRef = useRef(null);

  // Debounce the search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      searchProducts(debouncedQuery);
      setShowSuggestions(true);
    } else {
      clearSearchResults();
      setShowSuggestions(false);
    }
  }, [debouncedQuery, searchProducts, clearSearchResults]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleInputChange = (e) => {
    setQuery(e.target.value);
  }; 
  

  const handleSuggestionClick = (product) => {
    setQuery(product.name);
    setShowSuggestions(false);
    navigate(`/products/${product.id}`);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      // Navigate to search results page with query parameter
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const getHighlightedText = (text, query) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, 'gi');
    return text.replace(regex, '<mark class="bg-yellow-200">$1</mark>');
  };

  return (
    <div className="flex-1 mx-2 max-w-xl lg:flex relative" ref={searchRef}>
      <form onSubmit={handleSearchSubmit} className="w-full">
        <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full">
          <img src={SearchIcon} alt="Search" className="w-6 h-6 mx-4 hidden sm:block" />
          <input 
            type="text" 
            placeholder="Search models" 
            value={query} 
            onChange={handleInputChange} 
            className="flex-1 h-12 w-auto bg-transparent focus:outline-none text-base text-gray-700" 
          />
          <button type="submit" className="cursor-pointer hover:opacity-75 transition">
            <img src={Cam} alt="Camera" className="w-6 h-6 mx-4" />
          </button>
        </div>
      </form>
      
      {showSuggestions && (query.trim() || searchResults.length > 0) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          {searchLoading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="loading loading-spinner loading-sm"></div>
              <span className="ml-2">Searching...</span>
            </div>
          ) : searchResults.length > 0 ? (
            <div>
              {searchResults.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full p-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gray-200 rounded flex-shrink-0 flex items-center justify-center">
                      <img 
                        crossOrigin='anonymous'
                        src={`http://localhost:3000/images${product.path}`} 
                        alt={product.name} 
                        className="w-8 h-8 object-cover rounded"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div 
                        className="font-medium text-gray-900"
                        dangerouslySetInnerHTML={{ 
                          __html: getHighlightedText(product.name, query) 
                        }}
                      />
                      <div className="text-sm text-gray-500">
                        {product.category_name && (
                          <span className="mr-2">
                            Category: {getHighlightedText(product.category_name, query)}
                          </span>
                        )}
                        {product.format_extension && (
                          <span className="mr-2">
                            Format: {getHighlightedText(product.format_extension, query)}
                          </span>
                        )}
                        {product.logiciel_name && (
                          <span>
                            Logiciel: {getHighlightedText(product.logiciel_name, query)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : query.trim() && !searchLoading ? (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default SearchBar; 