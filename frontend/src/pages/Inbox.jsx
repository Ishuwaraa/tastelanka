import Navbar from "../components/shared/Navbar";
import { useChatStore } from "../store/useChatStore";
import { useEffect } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ChatContainer from "../components/ChatContainer";
import DummyPic from "../assets/dummy.jpg";
import NoChatSelected from "../assets/nochat.png";

const Inbox = () => {
    const { getUsers, users, setSelectedUser, selectedUser } = useChatStore();
    const { onlineUsers, authUser } = useAuthStore();
    
    useEffect(() => {
        getUsers();
    }, [])

    return ( 
        <>
        <Navbar />

        <div className="page">
            <div className="flex min-h-screen border border-gray-200">
                {/* Left Sidebar - Chats List */}
                <div className="w-64 border-r border-gray-200">
                    <div className="p-4 font-bold text-xl">Chats</div>
                    
                    {/* Chat List */}
                    <div>
                        {(users && users?.length > 0) ? users.map((user, index) => (
                            <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50 hover: cursor-pointer" key={index} onClick={() => setSelectedUser({id: user._id, name: user?.name, profilePic: user?.profilePic})}>
                                <img src={user?.profilePic ? user?.profilePic : DummyPic} alt="User" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p>{user?.name}</p>
                                </div>
                            </div>
                        )) : (
                            <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                                <img src={DummyPic} alt="User" className="w-10 h-10 rounded-full mr-3" />
                                <div>
                                    <p>No users</p>
                                </div>
                            </div>
                        )}                        
                    </div>
                </div>
                
                {/* Right Content - Chat View */}
                <div className="flex-1 flex flex-col">
                    {selectedUser ? (
                        <ChatContainer/>
                    ) : (
                        <div className="flex flex-col items-center justify-center h-full">
                            <img src={NoChatSelected} alt="no chat selected" className="w-52 mb-4"/>
                            <p className="text-gray-500 text-center">Select a chat to start a conversation!</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </>
     );
}
 
export default Inbox;