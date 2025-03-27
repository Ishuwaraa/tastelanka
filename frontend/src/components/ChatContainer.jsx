import { useEffect, useState } from "react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import DummyPic from "../assets/dummy.jpg";

const ChatContainer = () => {
    const [text, setText] = useState('');
    const { onlineUsers, authUser } = useAuthStore();
    const { messages, getMessages, sendMessage, selectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

    const handleMessageSubmit = async (e) => {
        e.preventDefault();

        try {
            await sendMessage({ text });
            setText('');
        } catch (err) {
            console.log(err.message);
        }
    }

    useEffect(() => {
        getMessages(selectedUser.id);

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [selectedUser.id, getMessages, subscribeToMessages, unsubscribeFromMessages])

    return ( 
        <>
        {/* Chat Header */}
        <div className="bg-primary text-white p-3 flex items-center">
            <img src={selectedUser?.profilePic ? selectedUser?.profilePic : DummyPic} alt="User" className="w-8 h-8 rounded-full mr-3" />
            <h2 className="font-medium">{selectedUser?.name}</h2>
        </div>
        
        {/* Messages Container */}
        <div className="flex-1 p-4 overflow-y-auto max-h-screen">
            {messages.map((message, index) => {
                return (message?.sender?._id === authUser?.id) ? (
                    <div className="flex justify-end mb-4" key={index}>
                        <div className="flex gap-5 items-center">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <p>{message?.text}</p>
                            </div>
                            <div className="">
                                <img src={message?.sender?.profilePic ? message?.sender?.profilePic : DummyPic} alt="Admin" className="w-8 h-8 rounded-full" />
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="flex mb-4" key={index}>
                        <div className="max-w-xs">
                            <div className="flex items-center">
                                <img src={message?.receiver?.profilePic ? message?.receiver?.profilePic : DummyPic} alt="User" className="w-8 h-8 rounded-full mr-2" />
                                <div className="bg-gray-100 p-3 rounded-lg">
                                    <p>{message?.text}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            })}            
        </div>
        
        {/* Message Input */}
        <div className="border-t border-gray-200 p-3 flex">
            <form action="" onSubmit={handleMessageSubmit} className="flex w-full gap-2">
                <textarea
                    rows="2"
                    className="flex-grow p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                    placeholder="Write a message..."
                    required
                    onChange={(e) => setText(e.target.value)}
                    value={text}
                ></textarea>
                <button className="ml-2 px-4 py-2 bg-primary text-white rounded-md">Send</button>
            </form>
        </div>
        </>
     );
}
 
export default ChatContainer;