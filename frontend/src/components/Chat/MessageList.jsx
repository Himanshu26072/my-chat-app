import { useState } from 'react';
import { editMessage, removeMessage } from '../../services/messageService';

const MessageList = ({ messages, setMessages }) => {
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');

  const formatTime = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const handleDelete = async (id) => {
    try {
      await removeMessage(id);
      setMessages((prev) => prev.filter((msg) => msg._id !== id));
    } catch (error) {
      console.error("Failed to delete", error);
    }
  };

  const startEditing = (msg) => {
    setEditingId(msg._id);
    setEditText(msg.text);
  };

  const handleSaveEdit = async (id) => {
    try {
      if (!editText.trim()) return;
      const updatedMsg = await editMessage(id, editText);
      setMessages((prev) => prev.map((msg) => (msg._id === id ? updatedMsg : msg)));
      setEditingId(null); 
    } catch (error) {
      console.error("Failed to edit", error);
    }
  };

  // Function to force cross-origin downloads
  const handleForceDownload = async (fileUrl, fileName) => {
    try {
      // UPDATED: Fetch directly from the full Cloudinary URL
      const response = await fetch(fileUrl);
      const blob = await response.blob(); 
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName; 
      document.body.appendChild(link);
      link.click(); 
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Download failed:", error);
      alert("Failed to download file. Please try again.");
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 bg-[#efeae2] dark:bg-[#0b141a] flex flex-col gap-2 transition-colors duration-300">
      {messages.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400 mt-10 text-sm bg-white/50 dark:bg-gray-800/80 inline-block mx-auto px-4 py-2 rounded-lg">
          No messages found.
        </div>
      ) : (
        messages.map((msg) => (
          <div key={msg._id} className="flex justify-end group">
            <div className="bg-[#d9fdd3] dark:bg-[#005c4b] text-gray-800 dark:text-gray-100 p-2 rounded-lg max-w-[75%] relative shadow-sm flex flex-col min-w-[120px] transition-colors duration-300">
              
              {/* File Handling */}
              {msg.fileUrl && (
                <div className="mb-2">
                  {msg.fileType?.startsWith('image/') ? (
                    <div className="relative group/file">
                      {/* UPDATED: Removed localhost prefix */}
                      <a href={msg.fileUrl} target="_blank" rel="noreferrer" title="Open Image">
                        <img src={msg.fileUrl} alt="attachment" className="max-w-full h-auto rounded-md max-h-64 object-contain" />
                      </a>
                      <button onClick={() => handleForceDownload(msg.fileUrl, msg.fileName)} className="absolute bottom-2 right-2 bg-black/50 text-white p-1.5 rounded-full opacity-0 group-hover/file:opacity-100 transition cursor-pointer hover:bg-black/70">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between gap-3 bg-black/5 dark:bg-black/20 p-2 rounded border border-green-300 dark:border-green-700 hover:bg-black/10 transition w-full">
                      {/* UPDATED: Removed localhost prefix */}
                      <a href={msg.fileUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 flex-1 min-w-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                        <span className="text-sm truncate max-w-[180px] font-medium hover:underline">{msg.fileName}</span>
                      </a>
                      <button onClick={() => handleForceDownload(msg.fileUrl, msg.fileName)} className="p-1.5 bg-white/50 dark:bg-gray-800 hover:bg-white dark:hover:bg-gray-700 rounded-md text-gray-700 dark:text-gray-300 transition shrink-0 shadow-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* Text and Edit Handling */}
              {editingId === msg._id ? (
                <div className="flex flex-col gap-2">
                  <input type="text" value={editText} onChange={(e) => setEditText(e.target.value)} className="p-1 rounded border border-green-300 dark:border-green-600 text-sm outline-none bg-white dark:bg-gray-700 dark:text-white" autoFocus />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingId(null)} className="text-xs text-gray-500 dark:text-gray-300">Cancel</button>
                    <button onClick={() => handleSaveEdit(msg._id)} className="text-xs text-green-700 dark:text-green-400 font-bold">Save</button>
                  </div>
                </div>
              ) : (
                msg.text && <p className="text-sm pr-2 pb-1 whitespace-pre-wrap">{msg.text}</p>
              )}
              
              <div className="flex items-center justify-end gap-1 mt-auto">
                {msg.isEdited && <span className="text-[10px] text-gray-400 dark:text-gray-300 italic">Edited</span>}
                <span className="text-[10px] text-gray-500 dark:text-gray-300">{formatTime(msg.createdAt)}</span>
              </div>

              {/* Popup Menus */}
              {editingId !== msg._id && msg.text && (
                <div className="hidden group-hover:flex absolute top-0 -left-16 gap-2 bg-white/90 dark:bg-gray-800/90 shadow-sm rounded-lg px-2 py-1">
                  <button onClick={() => startEditing(msg)} className="text-xs text-blue-500 dark:text-blue-400 hover:text-blue-700 font-medium">Edit</button>
                  <button onClick={() => handleDelete(msg._id)} className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 font-medium">Del</button>
                </div>
              )}
              {editingId !== msg._id && !msg.text && (
                 <div className="hidden group-hover:flex absolute top-0 -left-10 gap-2 bg-white/90 dark:bg-gray-800/90 shadow-sm rounded-lg px-2 py-1">
                 <button onClick={() => handleDelete(msg._id)} className="text-xs text-red-500 dark:text-red-400 hover:text-red-700 font-medium">Del</button>
               </div>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MessageList;