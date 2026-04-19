import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../services/authService';

const ChatHeader = ({ user, searchQuery, setSearchQuery, onClearChat }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem('theme') === 'dark');
  const navigate = useNavigate();

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };

  const handleClear = () => {
    setIsMenuOpen(false); 
    onClearChat();
  };

  const setLightMode = () => {
    setIsDarkMode(false);
    setIsMenuOpen(false);
  };

  const setDarkMode = () => {
    setIsDarkMode(true);
    setIsMenuOpen(false);
  };

  const initial = user?.username ? user.username.charAt(0).toUpperCase() : 'U';

  return (
    <div className="h-16 bg-gray-100 dark:bg-gray-800 flex items-center justify-between px-4 border-b border-gray-300 dark:border-gray-700 relative transition-colors duration-300">
      
      <div className="flex items-center">
        {/* NEW: Profile Picture rendering (Cloudinary compatible) */}
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold shrink-0 overflow-hidden bg-green-500">
          {user?.profilePic ? (
            <img src={user.profilePic} alt="DP" className="w-full h-full object-cover" />
          ) : (
            initial
          )}
        </div>
        <div className="ml-4">
          <h2 className="font-semibold text-gray-800 dark:text-white">{user?.username || 'User'}'s Notes</h2>
          <p className="text-xs text-gray-500 dark:text-gray-400">online</p>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <input 
          type="text" 
          placeholder="Search..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)}
          className="text-sm px-3 py-1.5 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-1 focus:ring-green-500 w-40 transition-all focus:w-56 mr-2 bg-white dark:bg-gray-700 dark:text-white dark:placeholder-gray-400"
        />
        
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition duration-150"
          title="Menu"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>

        {isMenuOpen && (
          <div className="absolute right-4 top-14 mt-1 w-44 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* NEW: Explicit Light and Dark Mode buttons */}
            <button onClick={setLightMode} className={`block w-full text-left px-4 py-2 text-sm transition ${!isDarkMode ? 'bg-gray-200 dark:bg-gray-600 font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              🌞 Light Mode
            </button>
            <button onClick={setDarkMode} className={`block w-full text-left px-4 py-2 text-sm transition ${isDarkMode ? 'bg-gray-200 dark:bg-gray-600 font-bold text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
              🌙 Dark Mode
            </button>
            <div className="h-px bg-gray-200 dark:bg-gray-700 my-1"></div>
            <button onClick={handleClear} className="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Clear Chat
            </button>
            <button onClick={handleLogout} className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition">
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatHeader;