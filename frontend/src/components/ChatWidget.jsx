import { useEffect, useState } from 'react';
import { useChatStore } from '../store/useChatStore';
import { useAuthStore } from '../store/useAuthStore';
import DummyPic from "../assets/dummy.jpg";

const ChatWidget = ({ restaurantName, ownerId, profilePic }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [text, setText] = useState('');
    const { onlineUsers, authUser } = useAuthStore();
    const { messages, getMessages, sendMessage, selectedUser, setSelectedUser, subscribeToMessages, unsubscribeFromMessages } = useChatStore();

    const toggleChat = () => {
        setIsOpen(!isOpen);
    };

    const handleSendMessage =  async (e) => {
        e.preventDefault();
        
        try {
            await sendMessage({ text });
            setText('');
        } catch (err) {
            console.log(err.message);
        }
    };

    useEffect(() => {
        getMessages(ownerId);

        subscribeToMessages();

        return () => unsubscribeFromMessages();
    }, [ownerId, getMessages, subscribeToMessages, unsubscribeFromMessages])

    return (
        <div className="fixed bottom-4 right-4 z-50" onClick={() => setSelectedUser({ id: ownerId })}>            
            {!isOpen && (
                <button onClick={toggleChat} className="bg-primary text-white py-2 px-4 rounded-md shadow-lg">
                    Chat with us 
                </button>
            )}
            
            {isOpen && (
                <div className="w-80 flex flex-col shadow-xl border border-gray-300 rounded-t-md bg-white">
                {/* Header with toggle */}
                <div className="bg-red-600 text-white p-3 rounded-t-md flex justify-between items-center cursor-pointer" onClick={toggleChat}>
                    <div className="font-medium">Messaging</div>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                    </svg>
                </div>

                {/* Restaurant Info */}
                <div className="p-3 flex items-center border-b">
                    <div className="mr-3">
                        <img src={profilePic} alt="Restaurant" className="w-10 h-10 rounded-full" />
                    </div>
                    <div className="font-bold">{restaurantName}</div>
                </div>

                {/* Messages Container */}
                <div className="h-64 overflow-y-auto p-3 bg-gray-50">
                    {messages.map((message, index) => {
                        return (message?.sender?._id === authUser?.id || message?.sender === authUser?.id) ? (
                            <div className="mb-4" key={index}>
                                <div className="flex items-start">
                                    <img src={message?.sender?.profilePic ? message?.sender?.profilePic : DummyPic} alt="User" className="w-8 h-8 rounded-full mr-2" />
                                    <div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2">You</span>
                                            <span className="text-xs text-gray-500">8:24 PM</span>
                                        </div>
                                        <p className="text-sm mt-1">{message?.text}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="mb-4" key={index}>
                                <div className="flex items-start">
                                    <img src={profilePic} alt="Restaurant" className="w-8 h-8 rounded-full mr-2" />
                                    <div>
                                        <div className="flex items-center">
                                            <span className="font-medium mr-2">{restaurantName}</span>
                                            <span className="text-xs text-gray-500">7:24 PM</span>
                                        </div>
                                        <p className="text-sm mt-1">{message?.text}</p>
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Message Input */}
                <div className="p-3 bg-gray-100">
                    <form onSubmit={handleSendMessage} className="flex">
                        <input
                            type="text"
                            placeholder="Write a message...."
                            className="flex-1 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-red-500"
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                        <button type="submit" className="ml-2 bg-primary text-white px-4 py-1 rounded-md">
                            Send
                        </button>
                    </form>
                </div>
                </div>
            )}
        </div>
    );
};

export default ChatWidget;