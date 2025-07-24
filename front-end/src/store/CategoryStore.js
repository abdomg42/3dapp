import { create } from 'zustand';
import axios from "axios";

const BaseUrl = "http://localhost:3000";


export const useCategoryStore = create((set,get) => ({
    categories: [],
    loadingC: false,
    errorC: null,
    // addProduct: async (e) =>{
    //     e.preventDefault();
    //     set({loading:true, error:null});
    //     try{
    //         const formData = new FormData();
    //         const response = await axios.post(`${BaseUrl}/product/addProdcut`,formData);
    //         set({products: [...get().products, response.data]});
    //     }
    // }
    fetchCategories: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/Category/getCategories`);
            set({categories: response.data, loading: false});
            console.log("response",response.data);
        } catch (error) {
            console.log("error",error);
            set({error: error.message, loading: false});
        }
    }
}))