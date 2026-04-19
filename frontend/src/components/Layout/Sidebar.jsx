import { useRef } from 'react';
import { uploadFile } from '../../services/messageService';
import { updateProfile } from '../../services/authService';

const Sidebar = ({ user, setUser }) => {
  const fileInputRef = useRef(null);
  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  const handleAvatarClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      const fileData = await uploadFile(file);
      const updatedUser = await updateProfile(fileData.fileUrl);
      setUser(updatedUser);
    } catch (error) {
      console.error("Failed to update profile picture", error);
      alert("Could not upload image.");
    }
  };

  return (
    <div className="w-1/3 max-w-sm bg-white dark:bg-gray-800 flex flex-col h-full border-r border-gray-300 dark:border-gray-700 transition-colors duration-300">
      <div className="h-16 bg-gray-100 dark:bg-gray-900 flex items-center px-4 border-b border-gray-300 dark:border-gray-700">
        <span className="font-semibold text-lg text-gray-800 dark:text-white">My Chats</span>
      </div>
      <div className="flex-1 overflow-y-auto">
        <div className="flex items-center p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-200 dark:bg-gray-700 transition-colors duration-300">
          
          {/* Clickable Avatar */}
          <div 
            onClick={handleAvatarClick}
            className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl relative group overflow-hidden shrink-0 border-2 border-transparent hover:border-green-500 transition cursor-pointer"
            title="Change Profile Picture"
          >
            {user?.profilePic ? (
              <img src={user.profilePic} alt="DP" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-green-500 flex items-center justify-center">{initial}</div>
            )}
            
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <span className="text-[10px] text-white">EDIT</span>
            </div>
          </div>

          <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />

          <div className="ml-4 flex-1">
            <h3 className="font-semibold text-gray-800 dark:text-white">{user?.username || 'User'} (Notes)</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">Save your messages here...</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;