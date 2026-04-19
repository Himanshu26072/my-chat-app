import { useState, useEffect } from 'react';
import Sidebar from '../components/Layout/Sidebar';
import ChatHeader from '../components/Chat/ChatHeader';
import MessageList from '../components/Chat/MessageList';
import MessageInput from '../components/Chat/MessageInput';
import { fetchMessages, sendMessage, clearAllMessages, uploadFile } from '../services/messageService'; 

const Home = () => {
  const [messages, setMessages] = useState([]);
  const [searchQuery, setSearchQuery] = useState(''); 
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

  // Updated to handle both text and files
  const handleSendMessage = async (text, file) => {
    try {
      let fileData = {};
      
      // If a file was selected, upload it first to get the URL
      if (file) {
        fileData = await uploadFile(file);
      }

      // Create the message in the database with the text and file URL
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
    <div className="flex h-screen w-screen bg-gray-200 dark:bg-gray-900 p-4 transition-colors duration-300">
      <div className="flex w-full max-w-6xl mx-auto bg-white dark:bg-gray-800 shadow-lg overflow-hidden rounded-lg">
        <Sidebar user={user} />
        <div className="flex flex-col flex-1 bg-slate-50 dark:bg-gray-900 relative border-l border-gray-300 dark:border-gray-700">
          <ChatHeader 
            user={user} 
            searchQuery={searchQuery} 
            setSearchQuery={setSearchQuery} 
            onClearChat={handleClearChat} 
          />
          <MessageList messages={filteredMessages} setMessages={setMessages} />
          <MessageInput onSendMessage={handleSendMessage} />
        </div>
      </div>
    </div>
  );
};

export default Home;