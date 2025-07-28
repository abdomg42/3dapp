import { create } from 'zustand';
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const BaseUrl = "http://localhost:3000";

export const useFavoritesStore = create((set, get) => ({
  favorites: [],
  loading: false,
  error: null,

  // Fetch user's favorite products
  fetchFavorites: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BaseUrl}/favorite/user`);
      set({ favorites: response.data, loading: false });
    } catch (error) {
      console.log("Error fetching favorites:", error);
      set({ error: error.response?.data?.error || "Error fetching favorites", loading: false });
      toast.error("Failed to load favorites");
    }
  },

  // Add product to favorites
  addToFavorites: async (productId) => {
    try {
      await axios.post(`${BaseUrl}/favorite/add`, { productId });
      toast.success("Added to favorites");
    } catch (error) {
      console.log("Error adding to favorites:", error);
      toast.error(error.response?.data?.error || "Failed to add to favorites");
      throw error;
    }
  },

  // Remove product from favorites
  removeFromFavorites: async (productId) => {
    try {
      await axios.delete(`${BaseUrl}/favorite/remove`, { 
        data: { productId } 
      });
      toast.success("Removed from favorites");
    } catch (error) {
      console.log("Error removing from favorites:", error);
      toast.error(error.response?.data?.error || "Failed to remove from favorites");
      throw error;
    }
  },

  // Check if product is in favorites
  checkFavorite: async (productId) => {
    try {
      const response = await axios.get(`${BaseUrl}/favorite/check/${productId}`);
      return response.data.isFavorite;
    } catch (error) {
      console.log("Error checking favorite status:", error);
      return false;
    }
  },

  // Toggle favorite status
  toggleFavorite: async (productId) => {
    const currentFavorites = get().favorites;
    const isFavorite = currentFavorites.some(fav => {
      const favProductId = fav.id || fav.product_id || fav._id;
      return favProductId === productId;
    });
    
    if (isFavorite) {
      // Remove from favorites - update UI immediately
      const updatedFavorites = currentFavorites.filter(fav => {
        const favProductId = fav.id || fav.product_id || fav._id;
        return favProductId !== productId;
      });
      set({ favorites: updatedFavorites });
      
      try {
        await get().removeFromFavorites(productId);
      } catch (error) {
        // Revert if API call fails
        set({ favorites: currentFavorites });
        throw error;
      }
    } else {
      // Add to favorites - update UI immediately
      const newFavorite = { id: productId, product_id: productId }; // Create a temporary favorite object
      const updatedFavorites = [...currentFavorites, newFavorite];
      set({ favorites: updatedFavorites });
      
      try {
        await get().addToFavorites(productId);
        // Refresh favorites to get the complete data from backend
        await get().fetchFavorites();
      } catch (error) {
        // Revert if API call fails
        set({ favorites: currentFavorites });
        throw error;
      }
    }
  },

  // Clear favorites state
  clearFavorites: () => {
    set({ favorites: [], loading: false, error: null });
  }
})); 