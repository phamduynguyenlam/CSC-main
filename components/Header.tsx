import React, { useState, useRef, useEffect } from 'react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onProfileClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, onThemeToggle, isDarkMode, onProfileClick }) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [unread, setUnread] = useState<boolean>(true);
  const notifRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 bg-white dark:bg-slate-800 h-16 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-slate-700 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick} 
          className="md:hidden text-gray-600 dark:text-gray-400 mr-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{title}</h1>
          {title === 'Dashboard' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Real-time sentiment analysis and customer insights
            </p>
          )}
          {title === 'Live Call Analysis' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Real-time sentiment monitoring and guidance
            </p>
          )}
          {title === 'Social Media Monitoring' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Track and analyze customer sentiment across platforms
            </p>
          )}
          {title === 'Analytics & Diagnostics' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Deep insights into customer sentiment and behavior
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={onThemeToggle}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
          title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDarkMode ? (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          ) : (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
          )}
          <span className="sr-only">Toggle theme</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg relative"
            aria-label="Notifications"
            title="Notifications"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
              <div className="p-4">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Notifications</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Welcome to SenseAI!
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="px-3 py-1 rounded-md bg-gray-100 dark:bg-slate-700 text-sm"
                  >
                    Close
                  </button>
                  <button
                    onClick={() => { setUnread(false); setShowNotifications(false); }}
                    className="px-3 py-1 rounded-md bg-blue-600 text-white text-sm"
                  >
                    Mark as read
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <button
            onClick={onProfileClick}
            title="Open profile"
            className="w-8 h-8 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center hover:ring-2 hover:ring-offset-1 hover:ring-gray-200 dark:hover:ring-slate-700 focus:outline-none"
            aria-label="Open profile"
          >
            <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">AJ</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;