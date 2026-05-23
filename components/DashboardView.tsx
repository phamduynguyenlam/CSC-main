import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView: React.FC = () => {
  const liveUpdates = [
    "🎉 Đã đạt mốc 500 khách truy cập!",
    "💰 Đơn hàng mới trị giá $1,250 từ Cửa hàng 3",
    "📊 Doanh thu của Cửa hàng 1 trong giờ qua: $4,320",
    "🎉 Đã đạt mốc 1.000 khách truy cập!",
    "💰 Đơn hàng Premium trị giá $2,100 từ Cửa hàng 5",
    "🎉 Đã đạt mốc 500 khách truy cập!",
    "💰 Đơn hàng mới trị giá $1,250 từ Cửa hàng 3",
    "📊 Doanh thu của Cửa hàng 1 trong 1 giờ qua: $4,320"
  ];

  const sentimentData = [
    { name: 'Mon', score: 7.6 },
    { name: 'Tue', score: 7.8 },
    { name: 'Wed', score: 7.5 },
    { name: 'Thu', score: 8 },
    { name: 'Fri', score: 8.6 },
    { name: 'Sat', score: 8.4 },
    { name: 'Sun', score: 9 },
  ];

  return (
    <div className="space-y-6">
      {/* Live Updates - Marquee Ticker */}
      <div className="mb-6 bg-gradient-to-r from-slate-200 to-slate-400 rounded-lg shadow-md p-3 flex items-center">
        <span className="bg-secondary text-foreground px-2 py-1 rounded text-sm font-semibold mr-4">LIVE</span>
        <div className="overflow-hidden flex-1">
          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex space-x-8">
              {liveUpdates.map((update, index) => (
                <span key={index} className="text-md text-foreground font-medium">
                  {update}
                </span>
              ))}
            </div>
            {/* Duplicate for seamless loop */}
            <div className="flex space-x-8 ml-8">
              {liveUpdates.map((update, index) => (
                <span key={`duplicate-${index}`} className="text-sm text-gray-700 dark:text-gray-300 font-medium">
                  {update}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Calls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Cuộc gọi đang xử lý</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-500 dark:text-sky-400">24</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">+12%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">so với giờ trước</div>
            </div>
          </div>
        </div>

        {/* Avg. Sentiment */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Sentiment Score</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-500 dark:text-sky-400">9</span>
            <span className="text-lg text-gray-600 dark:text-gray-400">/10</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">+0.6</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">so với hôm qua</div>
            </div>
          </div>
        </div>

        {/* Total Logins */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lượt đăng nhập</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-500 dark:text-sky-400">2,847</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">+23%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">so với năm trước</div>
            </div>
          </div>
        </div>

        {/* Products Reviewed */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Lượt đánh giá</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-500 dark:text-sky-400">1,234</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-sky-400 font-medium">67%</div>
              <div className="text-xs text-gray-600 dark:text-gray-400">số đơn hàng</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#a3a3a3" opacity={0.3} />
              <XAxis dataKey="name" stroke="#737373"/>
              <YAxis domain={[6, 10]} stroke="#737373"/>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#262626', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  color: '#FAFAFA'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="score" 
                stroke="#262626" 
                strokeWidth={3} 
                dot={{ fill: '#262626', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Productive Calls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Số cuộc gọi hiệu quả</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">+18%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">so với cùng kỳ năm ngoái</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;