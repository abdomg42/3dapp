import { create } from 'zustand';
import axios from "axios";
import { toast } from "react-hot-toast";

const BaseUrl = "http://localhost:3000";


export const useCategoryStore = create((set,get) => ({
    categories: [],
    loadingC: false,
    errorC: null,
   
    formData: {
      name:'',
    },
    setFormData: (formData) => set({formData}),
    resetForm : () => set({formData: {name:''}}),


    addCategory: async (e) =>{
        e.preventDefault();
        set({loading:true, error:null});
        try{
            const {formData} = get();
            await axios.post(`${BaseUrl}/Category/createCategory`,formData);
            await get().fetchCategories();
            get().resetForm();
            toast.success("Category added successfully");
        }catch(error){
          console.log(error);
          toast.error("Something went wrong");
        }
    },
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