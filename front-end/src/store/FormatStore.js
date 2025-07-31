import { create } from 'zustand';
import axios from "axios";
import { toast } from "react-hot-toast";

const BaseUrl = "http://localhost:3000";

export const useFormatStore = create((set, get) => ({
    formats: [],
    loading: false,
    error: null,

    addFormat: async (formData) => {
        set({loading: true, error: null});
        try {
            await axios.post(`${BaseUrl}/Format/createFormat`, formData);
            await get().fetchFormats();
            toast.success("Format added successfully");
        } catch (error) {
            console.log("Error adding format:", error);
            toast.error("Failed to add format");
        } finally {
            set({loading: false});
        }
    },

    updateFormat: async (id, formData) => {
        set({loading: true, error: null});
        try {
            await axios.put(`${BaseUrl}/Format/updateFormat/${id}`, formData);
            await get().fetchFormats();
            toast.success("Format updated successfully");
        } catch (error) {
            console.log("Error updating format:", error);
            toast.error("Failed to update format");
        } finally {
            set({loading: false});
        }
    },

    deleteFormat: async (id) => {
        set({loading: true, error: null});
        try {
            await axios.delete(`${BaseUrl}/Format/deleteFormat/${id}`);
            await get().fetchFormats();
            toast.success("Format deleted successfully");
        } catch (error) {
            console.log("Error deleting format:", error);
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data.error || "Cannot delete format. There are products using this format.");
            } else {
                toast.error("Failed to delete format");
            }
        } finally {
            set({loading: false});
        }
    },

    fetchFormats: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/Format/getFormats`);
            set({formats: response.data, loading: false});
        } catch (error) {
            console.log("Error fetching formats", error);
            set({error: error.message, loading: false});
            toast.error("Failed to load formats");
        }
    },
}));
