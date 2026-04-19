import { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import { fetchMessages, sendMessage, clearAllMessages, uploadFile } from '../services/messageService'; 

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    const getMessages = async () => {
      try {
        const data = await fetchMessages();
        setMessages(data);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };
    getMessages();
  }, []);

  const handleSendMessage = async (text, file) => {
    try {
      let fileData = {};
      if (file) {
        fileData = await uploadFile(file);
      }
      const newMessage = await sendMessage({ text, ...fileData });
      setMessages([...messages, newMessage]); 
    } catch (error) {
      console.error("Failed to send message:", error);
    }
  };

  const handleClearChat = async () => {
    if (window.confirm("Are you sure you want to clear your entire chat history?")) {
      try {
        await clearAllMessages();
        setMessages([]); 
      } catch (error) {
        console.error("Failed to clear chat:", error);
      }
    }
  };

  const filteredMessages = messages.filter((msg) => 
    msg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    /* CHANGE 1: Used h-[100dvh] to fix mobile browser address bar scaling issues */
    <div className="flex h-[100dvh] w-screen bg-gray-200 dark:bg-gray-900 transition-colors duration-300 overflow-hidden relative">
      
      {/* --- RESPONSIVE SIDEBAR --- */}
      <div className={`
        fixed inset-y-0 left-0 z-50 w-72 bg-white dark:bg-gray-800 transform 
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        transition-transform duration-300 ease-in-out
        md:relative md:translate-x-0 md:flex border-r border-gray-300 dark:border-gray-700
      `}>
        <Sidebar user={user} closeMobileMenu={() => setIsSidebarOpen(false)} />
      </div>

      {/* --- MAIN CHAT AREA --- */}
      <div className="flex flex-col flex-1 bg-slate-50 dark:bg-gray-900 relative min-w-0">
        
        {/* MOBILE OVERLAY TOGGLE (Hamburger) */}
        <div className="md:hidden flex items-center p-2 bg-white dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 text-gray-500 hover:text-gray-700 dark:hover:text-white"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
          <span className="ml-2 font-bold dark:text-white text-sm truncate">Chat with {user?.username}</span>
        </div>

        <ChatHeader 
          user={user} 
          searchQuery={searchQuery} 
          setSearchQuery={setSearchQuery} 
          onClearChat={handleClearChat} 
        />
        
        <div className="flex-1 overflow-y-auto">
          <MessageList messages={filteredMessages} setMessages={setMessages} />
        </div>

        {/* CHANGE 2: Added pb-10 on mobile to lift the button above the phone's navigation bar */}
        <div className="p-4 pb-10 md:pb-4 bg-white dark:bg-gray-800 border-t border-gray-300 dark:border-gray-700">
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>

      {/* --- MOBILE OVERLAY BACKGROUND --- */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default Home;