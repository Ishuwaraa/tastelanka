import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import { io } from 'socket.io-client';

const BASE_URL = 'http://localhost:4000';

export const useAuthStore = create((set, get) => ({
    authUser: null,
    isCheckingAuth: true,
    onlineUsers: [],
    socket: null,
    
    checkAuth: async () => {
        try {
            const res = await axiosInstance.get('/user/check');
            set({ authUser: res.data });
            get().connectSocket();
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
            get().connectSocket();
        } catch (err) {
            set({ authUser: null });
            console.log(err.message)
        }
    },
    logout: async () => {
        try {
            await axiosInstance.get('/user/logout');
            set({ authUser: null });
            get().disconnectSocket();
        } catch (err) {
            console.log(err.message)
        }
    },
    login: async (formData) => {
        set({ isLoggingIn: true });

        try {
            const res = await axiosInstance.post("/user/login", formData);
            set({ authUser: res.data });
            get().connectSocket();
        } catch (err) {
            console.log(err.message);
        }
    },
    connectSocket: () => {
        const { authUser } = get();
        console.log('socket: ', authUser);
        if (!authUser || get().socket?.connected) return;   //if not logged in or already has a connection

        const socket = io(BASE_URL, {
            query: {
                userId: authUser?.id
            }
        });
        socket.connect();

        set({ socket: socket });
    },
    disconnectSocket: () => {
        //after logout if there's a connection, disconnect
        if (get().socket?.connected) get().socket.disconnect();
    }
}))