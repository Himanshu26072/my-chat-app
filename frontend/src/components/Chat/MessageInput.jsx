import { useState, useRef } from 'react';

const MessageInput = ({ onSendMessage }) => {
  const [text, setText] = useState('');
  const [file, setFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() && !file) return;

    await onSendMessage(text, file);
    
    setText('');
    setFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-800 flex flex-col px-4 py-2 border-t border-gray-300 dark:border-gray-700 min-h-[64px] justify-center transition-colors duration-300">
      
      {file && (
        <div className="flex items-center gap-2 mb-2 text-sm text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-700 p-2 rounded shadow-sm w-max border dark:border-gray-600">
          <span className="truncate max-w-[200px]">{file.name}</span>
          <button onClick={() => setFile(null)} className="text-red-500 dark:text-red-400 font-bold ml-2">X</button>
        </div>
      )}

      <form onSubmit={handleSend} className="flex w-full items-center gap-2">
        <button 
          type="button" 
          onClick={() => fileInputRef.current.click()}
          className="p-2 text-gray-500 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition"
          title="Attach File"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M18.375 12.739l-7.693 7.693a4.5 4.5 0 01-6.364-6.364l10.94-10.94A3 3 0 1119.5 7.372L8.552 18.32m.009-.01l-.01.01m5.699-9.941l-7.81 7.81a1.5 1.5 0 002.112 2.13" />
          </svg>
        </button>

        <input 
          type="file" ref={fileInputRef} onChange={(e) => setFile(e.target.files[0])}
          className="hidden" accept="image/*,application/pdf"
        />

        <input
          type="text" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..."
          className="flex-1 py-2 px-4 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        <button type="submit" className="bg-green-500 text-white px-6 py-2 rounded-full hover:bg-green-600 transition font-semibold">
          Send
        </button>
      </form>
    </div>
  );
};

export default MessageInput;