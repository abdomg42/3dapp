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


    addProduct: async (e) =>{
        console.log("addProduct called"); // Debug log
        e.preventDefault();
        set({loading:true, error:null});
        try{
            const {formData} = get();
            console.log("Submitting formData:", formData); // Debug log
            const response = await axios.post(`${BaseUrl}/product/createProduct`,formData);
            console.log("API response:", response); // Debug log
            await get().fetchProducts();
            get().resetForm();
            toast.success("Product added successfully");
        }catch(error){
          console.log("addProduct error:", error); // Debug log
          toast.error("Something went wrong");
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