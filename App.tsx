import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import DashboardView from './components/DashboardView';
import LiveAnalysisView from './components/LiveAnalysisView';
import SocialFeedbackView from './components/SocialFeedbackView';
import AnalyticsView from './components/AnalyticsView';
import SWOTAnalysisView from './components/SWOTAnalysisView';
import AskAIView from './components/AskAIView';
import SettingsView from './components/SettingsView';
import ProfileView from './components/ProfileView';
import { View } from './types';

const App: React.FC = () => {
  const [view, setView] = useState<View>('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    // Check for saved theme preference or default to system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      return savedTheme === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply theme to document when isDarkMode changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
  };

  const renderContent = () => {
    switch (view) {
      case 'dashboard':
        return <DashboardView />;
      case 'liveCalls':
        return <LiveAnalysisView />;
      case 'analytics':
        return <AnalyticsView />;
      case 'socialMedia':
        return <SocialFeedbackView />;
      case 'swot':
        return <SWOTAnalysisView />;
      case 'askAI':
        return <AskAIView />;
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      default:
        return <DashboardView />;
    }
  };

  const getPageTitle = () => {
    switch (view) {
      case 'dashboard':
        return 'Dashboard';
      case 'liveCalls':
        return 'Live Call Analysis';
      case 'analytics':
        return 'Analytics & Diagnostics';
      case 'socialMedia':
        return 'Social Media Monitoring';
      case 'swot':
        return 'Business Intelligence & SWOT Analysis';
      case 'askAI':
        return 'Ask AI';
      case 'settings':
        return 'Settings';
      case 'profile':
        return 'Profile';
      default:
        return 'Dashboard';
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar 
        view={view} 
        setView={setView} 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen}
        isDarkMode={isDarkMode}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          title={getPageTitle()} 
          onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)}
          onThemeToggle={toggleTheme}
          isDarkMode={isDarkMode}
          onProfileClick={() => setView('profile')}
        />
        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-900">
          <div className="p-6">
            <div key={view} className="animate-fade-in">
              {renderContent()}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;