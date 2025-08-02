import { create } from 'zustand';
import axios from "axios";
import { toast } from 'react-hot-toast';

const BaseUrl = "http://localhost:3000";

export const useProductSearchStore = create((set, get) => ({
    searchResults: [],
    searchLoading: false,
    imageSearchResults: [],
    imageSearchLoading: false,
    imageSearchStats: null,
    uploadedImageInfo: null,

    searchProducts: async (query) => {
        if (!query || query.trim() === '') {
          set({ searchResults: [], searchLoading: false });
          return;
        }
        
        set({ searchLoading: true });
        try {
          const response = await axios.get(`${BaseUrl}/product/search?q=${encodeURIComponent(query.trim())}`);
          set({ searchResults: response.data, searchLoading: false });
        } catch (error) {
          console.log("Error searching products:", error);
          set({ searchResults: [], searchLoading: false });
        }
    },

    searchByImage: async (imageFile) => {
        if (!imageFile) {
          toast.error('Please select an image first');
          return;
        }

        set({ imageSearchLoading: true });
        
        try {
          const formData = new FormData();
          formData.append('image', imageFile);

          const response = await axios.post(`${BaseUrl}/product/search-by-image`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            },
          });

          console.log('Image search response:', response.data);
          console.log('Results length:', response.data.results?.length);
          console.log('Search stats:', response.data.searchStats);
          
          // Store the image search results with similarity scores
          set({ 
            imageSearchResults: Array.isArray(response.data) ? response.data : (response.data.results || []) , 
            imageSearchLoading: false,
            imageSearchStats: response.data.searchStats || null,
            uploadedImageInfo: response.data.uploadedImage || null
          });

          const resultCount = Array.isArray(response.data)
              ? response.data.length
              : (response.data.results?.length || 0);
          if (resultCount > 0) {
            toast.success(`Found ${resultCount} similar products!`);
          } else {
            toast('No similar products found. Try a different image.', {
              icon: '🔍',
              style: {
                borderRadius: '10px',
                background: '#333',
                color: '#fff',
              },
            });
          }
          
          return response.data;
          
        } catch (error) {
          console.error('Image search error:', error);
          toast.error('Failed to process image search. Please try again.');
          set({ 
            imageSearchResults: [], 
            imageSearchLoading: false,
            imageSearchStats: null,
            uploadedImageInfo: null
          });
        }
    },

    clearSearchResults: () => {
        set({ searchResults: [], searchLoading: false });
    },

    clearImageSearchResults: () => {
        set({ 
          imageSearchResults: [], 
          imageSearchLoading: false,
          imageSearchStats: null,
          uploadedImageInfo: null
        });
    },

    // Function to search products for the search results page
    searchProductsForPage: async (query) => {
        if (!query || query.trim() === '') {
          set({ searchResults: [], searchLoading: false });
          return;
        }
        
        set({ searchLoading: true });
        try {
          const response = await axios.get(`${BaseUrl}/product/search?q=${encodeURIComponent(query.trim())}`);
          set({ searchResults: response.data, searchLoading: false });
        } catch (error) {
          console.log("Error searching products:", error);
          set({ searchResults: [], searchLoading: false });
        }
    },
})) 