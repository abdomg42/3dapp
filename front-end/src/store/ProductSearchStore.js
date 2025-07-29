import { create } from 'zustand';
import axios from "axios";

const BaseUrl = "http://localhost:3000";

export const useProductSearchStore = create((set) => ({
    searchResults: [],
    searchLoading: false,

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

    clearSearchResults: () => {
        set({ searchResults: [], searchLoading: false });
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