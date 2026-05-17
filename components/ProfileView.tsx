import React, { useState } from 'react';
import { Settings, LogOut, BarChart3, User, RefreshCw } from 'lucide-react';

const ProfileView: React.FC = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [managerMode, setManagerMode] = useState(false);
  const [loggedIn, setLoggedIn] = useState(true);
  const [switchingAccount, setSwitchingAccount] = useState(false);

  const user = {
    name: managerMode ? 'Taylor Smith' : 'Alex Johnson',
    email: managerMode ? 'taylor.smith@company.com' : 'alex.johnson@company.com',
    role: managerMode ? 'CX Manager' : 'CX Analyst',
    department: 'Customer Experience',
    joinDate: 'March 2024',
    avatar: '/api/placeholder/128/128'
  };

  const stats = [
    { label: 'Calls Analyzed', value: '2,847' },
    { label: 'Insights Generated', value: '156' },
    { label: 'Issues Resolved', value: '89' },
    { label: 'Avg Response Time', value: '2.3 min' }
  ];

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">You have logged out</h1>
        <button
          onClick={() => setLoggedIn(true)}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Log Back In
        </button>
      </div>
    );
  }

  if (switchingAccount) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Switch Accounts</h1>
        <p className="text-gray-600 dark:text-gray-400">Select a different account to continue.</p>
        <div className="space-x-4">
          <button
            onClick={() => { setManagerMode(false); setSwitchingAccount(false); }}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Analyst (Alex Johnson)
          </button>
          <button
            onClick={() => { setManagerMode(true); setSwitchingAccount(false); }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Manager (Taylor Smith)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your account information and preferences
          </p>
        </div>
        <div className="relative">
          <button
            className="w-12 h-12 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700"
            onClick={() => setShowMenu(!showMenu)}
          >
            <User className="h-5 w-5" />
          </button>
          {showMenu && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50">
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={() => alert('Opening settings...')}
              >
                <Settings className="h-4 w-4 mr-2" /> Settings
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={() => setManagerMode(!managerMode)}
              >
                <BarChart3 className="h-4 w-4 mr-2" /> Switch to {managerMode ? 'Analyst' : 'Manager'} Mode
              </button>
              <button
                className="flex items-center w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={() => setSwitchingAccount(true)}
              >
                <RefreshCw className="h-4 w-4 mr-2" /> Switch Accounts
              </button>
              <button
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100 dark:hover:bg-slate-700"
                onClick={() => setLoggedIn(false)}
              >
                <LogOut className="h-4 w-4 mr-2" /> Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Role</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Joined</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.joinDate}</p>
                </div>
              </div>
              <div className="mt-6">
                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {managerMode ? 'Team Performance Summary' : 'Your Stats'}
          </h3>
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</span>
                <span className="font-semibold text-gray-900 dark:text-white">{stat.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
