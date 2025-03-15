import Navbar from "../components/shared/Navbar";
import ProfilePic from "../assets/profilepic.png";

const Inbox = () => {
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
                        {/* Chat Item - Active */}
                        <div className="flex items-center p-4 border-b border-gray-200 bg-gray-50">
                            <img src={ProfilePic} alt="User" className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <p>Missaka Rathnapriya</p>
                            </div>
                        </div>
                        
                        {/* Chat Item */}
                        <div className="flex items-center p-4 border-b border-gray-200 hover:bg-gray-50">
                            <img src={ProfilePic} alt="User" className="w-10 h-10 rounded-full mr-3" />
                            <div>
                                <p>Jana Dissanayake</p>
                            </div>
                        </div>                                        
                    </div>
                </div>
                
                {/* Right Content - Chat View */}
                <div className="flex-1 flex flex-col">
                    {/* Chat Header */}
                    <div className="bg-primary text-white p-3 flex items-center">
                        <img src={ProfilePic} alt="User" className="w-8 h-8 rounded-full mr-3" />
                        <h2 className="font-medium">Missaka Rathnapriya</h2>
                    </div>
                    
                    {/* Messages Container */}
                    <div className="flex-1 p-4 overflow-y-auto">
                        {/* Admin Message */}
                        <div className="flex justify-end mb-4">
                            <div className="flex gap-5 items-center">
                                <div className="bg-blue-100 p-3 rounded-lg">
                                    <p>Hi Missaka, thanks for reaching out! Happy to connect with you.</p>
                                </div>
                                <div className="">
                                    <img src={ProfilePic} alt="Admin" className="w-8 h-8 rounded-full" />
                                </div>
                            </div>
                        </div>
                    
                        {/* User Message */}
                        <div className="flex mb-4">
                            <div className="max-w-xs">
                                <div className="flex items-center">
                                    <img src={ProfilePic} alt="User" className="w-8 h-8 rounded-full mr-2" />
                                    <div className="bg-gray-100 p-3 rounded-lg">
                                        <p>Hello How are you?</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Message Input */}
                    <div className="border-t border-gray-200 p-3 flex">                        
                        <textarea
                            rows="2"
                            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-400 resize-none"
                            placeholder="Write a message..."
                        ></textarea>
                        <button className="ml-2 px-4 py-2 bg-primary text-white rounded-md">Send</button>
                    </div>
                </div>
            </div>
        </div>
        </>
     );
}
 
export default Inbox;