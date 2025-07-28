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
    searchResults: [],
    searchLoading: false,

    formData: {
      name:'',
      description:'',
      fichier_path:'',
      category:'',
      format:'',
      image:'',
      logiciel:'',
    },
    setFormData: (formData) => set({formData}),
    resetForm : () => set({formData: {name:'',
                                      description:'',
                                      fichier_path:'',
                                      category:'',
                                      format:'',
                                      image:'',
                                      logiciel:''}}),


    addProduct: async (formData) => {
        console.log("addProduct called"); // Debug log
        set({loading:true, error:null});
        try{
            console.log("Submitting formData:", formData); // Debug log
            const response = await axios.post(`${BaseUrl}/product/createProduct`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            console.log("API response:", response); // Debug log
            await get().fetchProducts();
            toast.success("Product added successfully");
        }catch(error){
          console.log("addProduct error:", error); // Debug log
          toast.error("Something went wrong");
        } finally {
            set({ loading: false });
        }
    },
    fetchProducts: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/getproducts `);
            set({products: response.data, loading: false});
        } catch (error) {
            console.log("Error in fetch Product function", error);
            toast.error("Something went wrong");
        }finally {
          set({ loading: false });
        }
    },
    fetchProduct: async (id) => {
        set({ loading: true , error: null});
        try {
          const response = await axios.get(`${BaseUrl}/product/getproduct/${id}`);
          set({
            product: response.data,
            loading: false, // pre-fill form with current product data
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