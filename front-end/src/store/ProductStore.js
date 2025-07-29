import { create } from 'zustand';
import axios from "axios";
import toast from "react-hot-toast";

const BaseUrl = "http://localhost:3000";

export const useProductStore = create((set,get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
    formats: [],
    logiciels: [],

    addProduct: async (formData) => {
        console.log("addProduct called");
        set({loading:true, error:null});
        try{
            console.log("Submitting formData:", formData);
            const response = await axios.post(`${BaseUrl}/product/createProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("API response:", response);
            await get().fetchProducts();
            toast.success("Product added successfully");
        }catch(error){
          console.log("addProduct error:", error);
          
          // Handle specific error cases
          if (error.response) {
            const status = error.response.status;
            const errorMessage = error.response.data?.error || 'Unknown error';
            
            switch (status) {
              case 409:
                toast.error("A product with this name already exists. Please choose a different name.");
                break;
              case 400:
                toast.error("Please fill in all required fields.");
                break;
              case 500:
                toast.error("Server error. Please try again later.");
                break;
              default:
                toast.error(errorMessage);
            }
          } else {
            toast.error("Network error. Please check your connection.");
          }
        } finally {
            set({ loading: false });
        }
    },

    deleteProduct: async (productId) => {
        set({loading: true, error: null});
        try {
            await axios.delete(`${BaseUrl}/product/deleteProduct/${productId}`);
            await get().fetchProducts();
            toast.success("Product deleted successfully");
        } catch (error) {
            console.log("Error deleting product:", error);
            set({ error: "Error deleting product", loading: false });
            toast.error("Failed to delete product");
            throw error;
        } finally {
            set({ loading: false });
        }
    },

    updateProduct: async (productId, formData) => {
        set({loading: true, error: null});
        try {
            await axios.put(`${BaseUrl}/product/updateProduct/${productId}`, formData);
            await get().fetchProducts();
            toast.success("Product updated successfully");
        } catch (error) {
            console.log("Error updating product:", error);
            set({ error: "Error updating product", loading: false });
            toast.error("Failed to update product");
            throw error;
        } finally {
            set({ loading: false });
        }
    },
    
    fetchProducts: async (sort = 'newest') => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/getProductsWithSort?sort=${sort}`);
            set({products: response.data, loading: false});
        } catch (error) {
            console.log("Error in fetch Product function", error);
            set({ error: "Something went wrong", loading: false });
            toast.error("Something went wrong");
        }
    },

    fetchProductsByCategory: async (categoryName, sort = 'newest') => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/category/${encodeURIComponent(categoryName)}?sort=${sort}`);
            set({products: response.data, loading: false});
        } catch (error) {
            console.log("Error fetching products by category:", error);
            set({ error: "Error fetching products by category", loading: false });
            toast.error("Error fetching products by category");
        }
    },

    fetchProductsByFormat: async (formatName, sort = 'newest') => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/format/${encodeURIComponent(formatName)}?sort=${sort}`);
            set({products: response.data, loading: false});
        } catch (error) {
            console.log("Error fetching products by format:", error);
            set({ error: "Error fetching products by format", loading: false });
            toast.error("Error fetching products by format");
        }
    },

    fetchProductsByLogiciel: async (logicielName, sort = 'newest') => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/logiciel/${encodeURIComponent(logicielName)}?sort=${sort}`);
            set({products: response.data, loading: false});
        } catch (error) {
            console.log("Error fetching products by logiciel:", error);
            set({ error: "Error fetching products by logiciel", loading: false });
            toast.error("Error fetching products by logiciel");
        }
    },

    fetchProduct: async (id) => {
        set({ loading: true , error: null});
        try {
          const response = await axios.get(`${BaseUrl}/product/getproduct/${id}`);
          set({
            product: response.data,
            loading: false,
            error: null,
          });
        } catch (error) {
          console.log("Error in fetchProduct function", error);
          set({ error: "Something went wrong", product: null });
          toast.error("Something went wrong");
        } finally {
          set({ loading: false });
        }
    },

    fetchFormats: async () => {
      try {
        const response = await axios.get(`${BaseUrl}/Format/getFormats`);
        set({ formats: response.data });
      } catch (error) {
        console.log("Error fetching formats", error);
        toast.error("Failed to load formats");
      }
    },

    fetchLogiciels: async () => {
      try {
        const response = await axios.get(`${BaseUrl}/Logiciel/getLogiciels`);
        set({ logiciels: response.data });
      } catch (error) {
        console.log("Error fetching logiciels", error);
        toast.error("Failed to load logiciels");
      }
    },
}))