import { create } from 'zustand';
import axios from "axios";

const BaseUrl = "http://localhost:3000";


export const useProductStore = create((set,get) => ({
    products: [],
    loading: false,
    error: null,
    currentProduct: null,
    addProduct: async (e) =>{
        e.preventDefault();
        set({loading:true, error:null});
        try{
            const formData = new FormData();
            const response = await axios.post(`${BaseUrl}/product/addProdcut`,formData);
            set({products: [...get().products, response.data]});
        }
    }
    fetchProducts: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/getproducts `);
            set({products: response.data, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
        }
    },
    fetchProduct: async (id) => {
        set({ loading1: true , error1: null});
        try {
          const response = await axios.get(`${BaseUrl}/product/getproduct/${id}`);
          set({
            currentProduct: response.data,
            loading1: false, // pre-fill form with current product data
            error1: null,
          });
        } catch (error) {
          console.log("Error in fetchProduct function", error);
          set({ error: "Something went wrong", currentProduct: null });
        } finally {
          set({ loading1: false });
        }
      }
}))