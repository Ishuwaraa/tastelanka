import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from 'react-hot-toast';
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [],
    selectedUser: null,
    isUsersLoading: false,
    isMessagesLoading: false,

    getUsers: async () => {
        //set({ isUsersLoading: true });
        try {
            const res = await axiosInstance.get('/chat/users');
            set({ users: res.data });
            console.log('users', res.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            //set({ isUsersLoading: false });
        }
    },
    getMessages: async (userId) => {
        //set({ isMessagesLoading: true });
        try {
            const res = await axiosInstance.get(`/chat/${userId}`);
            set({ messages: res.data });
            console.log('messages', res.data);
        } catch (err) {
            console.log(err.message);
        } finally {
            //set({ isMessagesLoading: false })
        }
    },
    sendMessage: async (data) => {
        const { selectedUser, messages } = get();
        console.log('sendMessage: ', selectedUser);
        console.log('sendMessage', messages);
        
        try {
            const res = await axiosInstance.post(`/chat/send/${selectedUser.id}`, data);
            set({ messages: [...messages, res.data] });
        } catch (err) {
            console.log(err.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        // if (!selectedUser) return;  //if no chat selected return

        const socket = useAuthStore.getState().socket;
        socket.on('newMessage', (newMessage) => {
            toast(`New message from ${newMessage.sender}`, {
                style: {
                    background: '#CE3030',
                    color: 'white'
                },
            });
            //if (newMessage.text.sender !== selectedUser.id) return;   //worked fine w/o this line until added the toaster 
            console.log('came here')
            set({ messages: [...get().messages, newMessage.text]})
            //console.log('curr messages: ', [...get().messages, newMessage.text])
        })
    },
    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off('newMessage');   //unsubscribe when logged out or closed the window
    },    
    setSelectedUser: (selectedUser) => set({ selectedUser })
}))
