import { create } from 'zustand';
import axios from "axios";
import { toast } from 'react-hot-toast';

const BaseUrl = "http://localhost:3000";

export const useProductSearchStore = create((set) => ({
    searchResults: [],
    searchLoading: false,
    imageSearchResults: [],
    imageSearchLoading: false,

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
          
          // Store the image search results
          set({ 
            imageSearchResults: response.data.results || [], 
            imageSearchLoading: false 
          });

          toast.success('Image search completed!');
          return response.data;
          
        } catch (error) {
          console.error('Image search error:', error);
          toast.error('Failed to process image search. Please try again.');
          set({ imageSearchResults: [], imageSearchLoading: false });
          throw error;
        }
    },

    clearSearchResults: () => {
        set({ searchResults: [], searchLoading: false });
    },

    clearImageSearchResults: () => {
        set({ imageSearchResults: [], imageSearchLoading: false });
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