import { create } from 'zustand';
import axios from "axios";
import { toast } from "react-hot-toast";

const BaseUrl = "http://localhost:3000";

export const useLogicielStore = create((set, get) => ({
    logiciels: [],
    loading: false,
    error: null,

    addLogiciel: async (formData) => {
        set({loading: true, error: null});
        try {
            await axios.post(`${BaseUrl}/Logiciel/createLogiciel`, formData);
            await get().fetchLogiciels();
            toast.success("Logiciel added successfully");
        } catch (error) {
            console.log("Error adding logiciel:", error);
            toast.error("Failed to add logiciel");
        } finally {
            set({loading: false});
        }
    },

    updateLogiciel: async (id, formData) => {
        set({loading: true, error: null});
        try {
            await axios.put(`${BaseUrl}/Logiciel/updateLogiciel/${id}`, formData);
            await get().fetchLogiciels();
            toast.success("Logiciel updated successfully");
        } catch (error) {
            console.log("Error updating logiciel:", error);
            toast.error("Failed to update logiciel");
        } finally {
            set({loading: false});
        }
    },

    deleteLogiciel: async (id) => {
        set({loading: true, error: null});
        try {
            await axios.delete(`${BaseUrl}/Logiciel/deleteLogiciel/${id}`);
            await get().fetchLogiciels();
            toast.success("Logiciel deleted successfully");
        } catch (error) {
            console.log("Error deleting logiciel:", error);
            if (error.response && error.response.status === 409) {
                toast.error(error.response.data.error || "Cannot delete logiciel. There are products using this logiciel.");
            } else {
                toast.error("Failed to delete logiciel");
            }
        } finally {
            set({loading: false});
        }
    },

    fetchLogiciels: async () => {
        set({loading: true, error: null});
        try {
            const response = await axios.get(`${BaseUrl}/Logiciel/getLogiciels`);
            set({logiciels: response.data, loading: false});
        } catch (error) {
            console.log("Error fetching logiciels", error);
            set({error: error.message, loading: false});
            toast.error("Failed to load logiciels");
        }
    },
}));
