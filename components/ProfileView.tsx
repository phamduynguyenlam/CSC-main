import React from 'react';
import { User } from 'lucide-react';

interface ProfileViewProps {
  managerMode: boolean;
  loggedIn: boolean;
  switchingAccount: boolean;
  onLogin: () => void;
  onToggleManagerMode: () => void;
  onStartSwitchAccount: () => void;
  onSetManagerMode: (value: boolean) => void;
  onCancelSwitchAccount: () => void;
  onLogout: () => void;
}

const ProfileView: React.FC<ProfileViewProps> = ({
  managerMode,
  loggedIn,
  switchingAccount,
  onLogin,
  onToggleManagerMode,
  onStartSwitchAccount,
  onSetManagerMode,
  onCancelSwitchAccount,
  onLogout
}) => {

  const user = {
    name: managerMode ? 'Lê Minh Anh' : 'Nguyễn Văn Nam',
    email: managerMode ? 'anh.lm@company.com' : 'nam.nv@company.com',
    role: managerMode ? 'CX Manager' : 'CX Analyst',
    department: 'Customer Experience',
    joinDate: 'Tháng Ba, 2024',
    avatar: '/api/placeholder/128/128'
  };

  const stats = [
    { label: 'Cuộc gọi đã phân tích', value: '2,847' },
    { label: 'Số lượng insight', value: '156' },
    { label: 'Vấn đề đã giải quyết', value: '89' },
    { label: 'Thời gian phản hồi trung bình', value: '2.3 phút' }
  ];

  if (!loggedIn) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bạn đã đăng xuất</h1>
        <button
          onClick={onLogin}
          className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-sky-400"
        >
          Đăng nhập lại
        </button>
      </div>
    );
  }

  if (switchingAccount) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Đổi tài khoản</h1>
        <p className="text-gray-600 dark:text-gray-400">Chọn một tài khoản khác để tiếp tục.</p>
        <div className="space-x-4">
          <button
            onClick={() => { onSetManagerMode(false); onCancelSwitchAccount(); }}
            className="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-sky-400"
          >
            Analyst (Nguyễn Văn Nam)
          </button>
          <button
            onClick={() => { onSetManagerMode(true); onCancelSwitchAccount(); }}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Manager (Lê Minh Anh)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 relative">

      {/* Profile Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <div className="flex items-start space-x-6">
            <div className="w-24 h-24 bg-sky-300 rounded-full flex items-center justify-center">
              <span className="text-3xl font-bold text-sky-900">
                {user.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user.name}</h2>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Vai trò</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Bộ phận</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.department}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Thời gian gia nhập</label>
                  <p className="mt-1 text-gray-900 dark:text-white">{user.joinDate}</p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-3">
                <button className="px-4 py-2 font-medium bg-blue-500 text-white rounded-lg hover:bg-blue-700">
                  Chỉnh sửa hồ sơ
                </button>
                <button
                  onClick={onStartSwitchAccount}
                  className="px-4 py-2 font-medium bg-slate-200 text-slate-900 rounded-lg hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600">
                  Đổi tài khoản
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            {managerMode ? 'Tổng quan hiệu suất nhóm' : 'Thống kê của bạn'}
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
