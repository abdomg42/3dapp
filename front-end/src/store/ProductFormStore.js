import { create } from 'zustand';

export const useProductFormStore = create((set) => ({
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
    
    resetForm: () => set({
      formData: {
        name:'',
        description:'',
        fichier_path:'',
        category:'',
        format:'',
        image:'',
        logiciel:''
      }
    }),
})) 