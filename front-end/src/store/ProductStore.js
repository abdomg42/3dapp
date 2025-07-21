import { create } from 'zustand';
import axios from "axios";

const BaseUrl = "http://localhost:3000";


export const useProductStore = create((set,get) => ({
    products: [],
    loading: false,
    error: null,

    fetchProducts: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/product/getproducts `);
            set({products: response.data, loading: false});
        } catch (error) {
            set({error: error.message, loading: false});
        }
    }
}))