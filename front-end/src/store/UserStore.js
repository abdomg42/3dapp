import { create } from 'zustand';
import axios from "axios";

const BaseUrl = "http://localhost:3000";


export const useUserStore = create((set,get) => ({
    categories: [],
    loadingC: false,
    errorC: null,
   
    formData: {
      name:'',
      email:'',
      password:'',
    },
    setFormData: (formData) => set({formData}),
    resetForm : () => set({formData: {name:''}}),


    addUser: async (e) =>{
        e.preventDefault();
        set({loading:true, error:null});
        try{
            const {formData} = get();
            await axios.post(`${BaseUrl}/User/createUser`,formData);
            await get().fetchUsers();
            get().resetForm();
            toast.success("User added successfully");
        }catch(error){
          console.log(error);
          toast.error("Something went wrong");
        }
    },
    fetchUsers: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/User/getUsers`);
            set({categories: response.data, loading: false});
            console.log("response",response.data);
        } catch (error) {
            console.log("error",error);
            set({error: error.message, loading: false});
        }
    }
}))