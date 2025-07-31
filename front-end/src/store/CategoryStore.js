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


    addCategory: async (formData) =>{
        set({loadingC: true, errorC: null});
        try{
            await axios.post(`${BaseUrl}/Category/createCategory`, formData);
            await get().fetchCategories();
            toast.success("Category added successfully");
        }catch(error){
          console.log(error);
          toast.error("Something went wrong");
        } finally {
            set({loadingC: false});
        }
    },

    updateCategory: async (id, formData) => {
        set({loadingC: true, errorC: null});
        try {
            await axios.put(`${BaseUrl}/Category/updateCategory/${id}`, formData);
            await get().fetchCategories();
            toast.success("Category updated successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to update category");
        } finally {
            set({loadingC: false});
        }
    },

    deleteCategory: async (id) => {
        set({loadingC: true, errorC: null});
        try {
            await axios.delete(`${BaseUrl}/Category/deleteCategory/${id}`);
            await get().fetchCategories();
            toast.success("Category deleted successfully");
        } catch (error) {
            console.log(error);
            toast.error("Failed to delete category");
        } finally {
            set({loadingC: false});
        }
    },

    fetchCategories: async () => {
        set({loadingC: true, errorC: null});
        try {
            const response = await axios.get(`${BaseUrl}/Category/getCategories`);
            set({categories: response.data, loadingC: false});
            console.log("response",response.data);
        } catch (error) {
            console.log("error",error);
            set({errorC: error.message, loadingC: false});
        }
    }
}))