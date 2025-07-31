import { create } from 'zustand';
import axios from "../lib/axios";
import { toast } from "react-hot-toast";

const BaseUrl = "http://localhost:3000";

export const useUserAdminStore = create((set, get) => ({
  Users: [],
  loading: false,
  error: null,

  // Fetch user's User products
  fetchUsers: async () => {
    set({ loading: true, error: null });
    try {
      const response = await axios.get(`${BaseUrl}/User/getUsers`);
      set({ Users: response.data, loading: false });
    } catch (error) {
      console.log("Error fetching Users:", error);
      set({ error: error.response?.data?.error || "Error fetching Users", loading: false });
      toast.error("Failed to load Users");
    }
  },

  addUser: async (UserForm) => {
    console.log(UserForm);
    try {
      const res = await axios.post(`${BaseUrl}/User/CreateUser`, UserForm );
      toast.success("User Added ");
    } catch (error) {
      console.log("Error adding User:",error);
      toast.error("Failed to add  User");
    }
  },
  updateUser: async (UserId, formData) => {
        set({loading: true, error: null});
        try {
            await axios.put(`${BaseUrl}/User/updateUser/${UserId}`, formData);
            await get().fetchUsers();
            toast.success("User updated successfully");
        } catch (error) {
            console.log("Error updating User:", error);
            set({ error: "Error updating User", loading: false });
            toast.error("Failed to update User");
            throw error;
        } finally {
            set({ loading: false });
        }
    },

  // Remove product from Users
  removeUser: async (UserId) => {
    try {
      await axios.delete(`${BaseUrl}/User/deleteUser/${UserId}` );
      toast.success("User Removed ");
    } catch (error) {
      console.log("Error removing User:", error);
      toast.error(error.response?.data?.error || "Failed to remove User");
      throw error;
    }
  }
  
})); 