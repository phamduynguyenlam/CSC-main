import React, { useState, useRef, useEffect } from 'react';
import { Settings, LogOut, BarChart3, User, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  onMenuClick: () => void;
  onThemeToggle: () => void;
  isDarkMode: boolean;
  onProfileClick: () => void;
  managerMode: boolean;
  onSettingsClick: () => void;
  onToggleManagerMode: () => void;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({ title, onMenuClick, onThemeToggle, isDarkMode, onProfileClick, managerMode, onSettingsClick, onToggleManagerMode, onLogout }) => {
  const [showNotifications, setShowNotifications] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [unread, setUnread] = useState<boolean>(true);
  const notifRef = useRef<HTMLDivElement | null>(null);
  const profileRef = useRef<HTMLDivElement | null>(null);

  const localizedTitle = {
    'Dashboard': 'Dashboard',
    'Live Call Analysis': 'Phân tích cuộc gọi trực tiếp',
    'Social Media Monitoring': 'Giám sát mạng xã hội',
    'Business Intelligence & SWOT Analysis': 'Phân tích kinh doanh',
    'Ask AI': 'Hỏi AI',
    'Settings': 'Cài đặt',
    'Profile': 'Tài khoản'
  }[title] || title;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="flex-shrink-0 bg-white dark:bg-[#0A2540] h-20 flex items-center justify-between px-4 md:px-6 border-b border-gray-200 dark:border-white/10 shadow-sm">
      <div className="flex items-center">
        <button 
          onClick={onMenuClick} 
          className="md:hidden text-gray-600 dark:text-gray-400 mr-4 p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-[#0077b6]"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">Toggle Sidebar</span>
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{localizedTitle}</h1>
          {title === 'Dashboard' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Cập nhật tiến độ & theo dõi trải nghiệm khách hàng
            </p>
          )}
          {title === 'Live Call Analysis' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Nhận diện cảm xúc khách hàng & hướng dẫn xử lý tình huống
            </p>
          )}
          {title === 'Social Media Monitoring' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Theo dõi và phân tích thái độ khách hàng đa nền tảng
            </p>
          )}
          {title === 'Business Intelligence & SWOT Analysis' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Theo dõi chỉ số hiệu suất và báo cáo trực quan
            </p>
          )}
          {title === 'Ask AI' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Trợ lý CSCopilot: Giải đáp, tóm tắt và phân tích tức thì
            </p>
          )}
          {title === 'Settings' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Tùy chỉnh trải nghiệm và cấu hình cá nhân
            </p>
          )}
          {title === 'Profile' && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Xem và cập nhật hồ sơ của bạn
            </p>
          )}
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button 
          onClick={onThemeToggle}
          className="p-2 text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#0077b6] rounded-lg transition-colors"
          title={isDarkMode ? 'Chế độ sáng' : 'Chế độ tối'}
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
          <span className="sr-only">Theme</span>
        </button>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 text-gray-600 dark:text-gray-400 hover:bg-slate-100 dark:hover:bg-[#0077b6] rounded-lg relative"
            aria-label="Thông báo"
            title="Thông báo"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            {unread && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-[#0A2540] text-gray-800 dark:text-gray-200 rounded-lg shadow-md border border-gray-200 dark:border-[#00b4d8] z-50">
              <div className="p-4">
                <h4 className="font-semibold text-sm text-gray-900 dark:text-white mb-2">Thông báo</h4>
                <div className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                  Chào mừng đến với CSC!
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="px-3 py-1 rounded-md bg-slate-100 dark:bg-[#0077b6] text-sm"
                  >
                    Đóng
                  </button>
                  <button
                    onClick={() => { setUnread(false); setShowNotifications(false); }}
                    className="px-3 py-1 rounded-md bg-[#0077b6] text-white text-sm"
                  >
                    Đánh dấu đã đọc
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => setShowProfileMenu(prev => !prev)}
            title="Tài khoản"
            aria-expanded={showProfileMenu}
            className="flex items-center gap-2 px-3 py-2 text-slate-700 dark:text-slate-200 focus:outline-none"
            aria-label="Tài khoản"
          >
            <span className="w-8 h-8 rounded-full bg-slate-200 dark:bg-[#0077b6] flex items-center justify-center text-xs font-semibold text-slate-700 dark:text-slate-100">
              {managerMode ? 'LA' : 'NN'}
            </span>
            <ChevronDown className="h-4 w-4" />
          </button>
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#0A2540] text-gray-800 dark:text-gray-200 rounded-2xl shadow-xl border border-gray-200 dark:border-[#00b4d8] z-50 overflow-hidden">
              <button
                className="group flex items-center w-full px-4 py-3 text-left gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0077b6] transition"
                onClick={() => { onProfileClick(); setShowProfileMenu(false); }}
              >
                <User className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-100" />
                Hồ sơ
              </button>
              <button
                className="group flex items-center w-full px-4 py-3 text-left gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0077b6] transition"
                onClick={() => { onSettingsClick(); setShowProfileMenu(false); }}
              >
                <Settings className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-100" />
                Cài đặt
              </button>
              <button
                className="group flex items-center w-full px-4 py-3 text-left gap-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#0077b6] transition"
                onClick={() => { onToggleManagerMode(); setShowProfileMenu(false); }}
              >
                <BarChart3 className="h-4 w-4 text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:group-hover:text-slate-100" />
                Đổi sang chế độ {managerMode ? 'Analyst' : 'Manager'}
              </button>
              <div className="border-t border-gray-200 dark:border-[#00b4d8]" />
              <button
                className="group flex items-center w-full px-4 py-3 text-left gap-3 text-sm text-red-600 hover:bg-slate-100 dark:hover:bg-[#0077b6] transition"
                onClick={() => { onLogout(); setShowProfileMenu(false); }}
              >
                <LogOut className="h-4 w-4 text-red-600" />
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;