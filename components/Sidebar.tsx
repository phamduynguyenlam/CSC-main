import React from 'react';
import { Settings, User } from 'lucide-react';
import { View, SidebarItem } from '../types';
import {
  DashboardIcon,
  LiveAnalysisIcon,
  SocialIcon,
  TrendUpIcon,
  LightbulbIcon,
} from './icons/Icons';
import BrandLogo from './BrandLogo';

interface SidebarProps {
  view: View;
  setView: (view: View) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  isDarkMode?: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ view, setView, isOpen, setIsOpen, isDarkMode = false }) => {
  void isDarkMode;

  const handleItemClick = (newView: View) => {
    setView(newView);
    if (window.innerWidth < 768) {
      setIsOpen(false);
    }
  };

  const menuItems: SidebarItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
    { id: 'liveCalls', label: 'Cuộc gọi trực tiếp', icon: LiveAnalysisIcon },
    { id: 'socialMedia', label: 'Mạng xã hội', icon: SocialIcon },
    { id: 'swot', label: 'Phân tích kinh doanh', icon: TrendUpIcon },
    { id: 'askAI', label: 'Hỏi AI', icon: LightbulbIcon },
    { id: 'settings', label: 'Cài đặt', icon: Settings },
    { id: 'profile', label: 'Tài khoản', icon: User },
  ];

  const sidebarClasses = `
    fixed md:relative inset-y-0 left-0 z-30
    w-64 bg-white dark:bg-slate-900 border-r border-gray-200 dark:border-white/10
    transform transition-transform duration-300 ease-in-out
    ${isOpen ? 'translate-x-0' : '-translate-x-full'}
    md:translate-x-0
    flex flex-col shadow-md
  `;

  return (
    <>
      <div className={sidebarClasses}>
        <div className="flex-shrink-0 px-2 py-4 pt-10">
          <div className="flex items-center justify-center">
            <BrandLogo className="h-auto w-24 text-black dark:text-white" />
          </div>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = view === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-sm transition-all duration-200 group border-l-4 ${
                  isActive
                    ? 'bg-blue-500/10 dark:bg-blue-600/20 text-blue-700 dark:text-sky-400 border-blue-500'
                    : 'text-gray-600 dark:text-gray-300 border-transparent hover:bg-slate-50 dark:hover:bg-sky-950 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5 flex-shrink-0" aria-hidden />
                <span className="font-medium truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-white/10">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setView('profile');
                if (window.innerWidth < 768) setIsOpen(false);
              }}
              title="Open profile"
              aria-label="Open profile"
              className="w-8 h-8 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center hover:ring-2 hover:ring-offset-1 hover:ring-gray-200 dark:hover:ring-ring focus:outline-none"
            >
              <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">NN</span>
            </button>
            <div className="flex-1 min-w-0">
              <button
                onClick={() => {
                  setView('profile');
                  if (window.innerWidth < 768) setIsOpen(false);
                }}
                className="w-full text-left focus:outline-none"
              >
                <p className="text-sm font-medium text-gray-900 dark:text-white truncate">Nguyễn Văn Nam</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 truncate">CX Analyst</p>
              </button>
            </div>
          </div>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;
