import { create } from "zustand";
import { axiosInstance } from "../lib/axios";

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/user/check');
            set({ authUser: res.data });            
        } catch (err) {
            set({ authUser: null });
            console.log(err.message);
        } finally {
            set({ isCheckingAuth: false });
        }
    },
    signup: async (formData) => {
        try {
          const res = await axiosInstance.post("/user/register", formData);
          set({ authUser: res.data });          
        } catch (error) {
          console.log(err.message)
        }
    },
    logout: async () => {
        try {
            await axiosInstance.get('/user/logout');
            set({ authUser: null });
        } catch (err) {
            console.log(err.message)
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/user/login", formData);
            set({ authUser: res.data });
        } catch (err) {
            console.log(err.message);
        }
    }
}))