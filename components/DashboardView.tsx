import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const DashboardView: React.FC = () => {
  const liveUpdates = [
    "🎉 500th visitor milestone reached!",
    "💰 New order $1,250 from Store #3",
    "📊 Store #1: $4,320 in last hour",
    "🎉 1000th visitor milestone reached!",
    "💰 Premium order $2,100 from Store #5",
    "🎉 500th visitor milestone reached!",
    "💰 New order $1,250 from Store #3",
    "📊 Store #1: $4,320 in last hour"
  ];

  const sentimentData = [
    { name: 'Mon', sentiment: 4.5 },
    { name: 'Tue', sentiment: 4.6 },
    { name: 'Wed', sentiment: 4.2 },
    { name: 'Thu', sentiment: 4.8 },
    { name: 'Fri', sentiment: 4.9 },
    { name: 'Sat', sentiment: 4.7 },
    { name: 'Sun', sentiment: 5.0 },
  ];

  return (
    <div className="space-y-6">
      {/* Live Updates - Marquee Ticker */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Live Updates</h3>
        <div className="relative overflow-hidden bg-gray-50 dark:bg-slate-700 rounded-lg p-3">
          <div className="flex animate-marquee whitespace-nowrap">
            <div className="flex space-x-8">
              {liveUpdates.map((update, index) => (
                <span key={index} className="text-sm text-gray-700 dark:text-gray-300 font-medium">
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
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Active Calls</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">24</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">+12%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">from last hour</div>
            </div>
          </div>
        </div>

        {/* Avg. Sentiment */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Avg. Sentiment</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-purple-600 dark:text-purple-400">7.8</span>
            <span className="text-lg text-gray-500 dark:text-gray-400">/10</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">+0.5</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">from yesterday</div>
            </div>
          </div>
        </div>

        {/* Total Logins */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Logins</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">2,847</span>
            <div className="ml-2">
              <div className="text-sm text-green-600 dark:text-green-400 font-medium">+23%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">YoY</div>
            </div>
          </div>
        </div>

        {/* Products Reviewed */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Products Reviewed</h3>
          <div className="flex items-center">
            <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">1,234</span>
            <div className="ml-2">
              <div className="text-sm text-blue-600 dark:text-blue-400 font-medium">67%</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">of orders</div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sentiment Trends */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sentiment Trends</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={sentimentData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.3} />
              <XAxis dataKey="name" stroke="#6B7280" />
              <YAxis domain={[4, 5.5]} stroke="#6B7280" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: 'none', 
                  borderRadius: '0.5rem',
                  color: '#F9FAFB'
                }} 
              />
              <Line 
                type="monotone" 
                dataKey="sentiment" 
                stroke="#8B5CF6" 
                strokeWidth={3} 
                dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Productive Calls */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Productive Calls (YoY)</h3>
          <div className="flex items-center justify-center h-48">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 dark:text-green-400 mb-2">+18%</div>
              <div className="text-sm text-gray-500 dark:text-gray-400">vs. last year same period</div>
            </div>
          </div>
        </div>
      </div>

      {/* Login Growth */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Login Growth</h3>
        <div className="flex items-center">
          <span className="text-3xl font-bold text-blue-600 dark:text-blue-400">+23%</span>
          <span className="ml-2 text-gray-500 dark:text-gray-400">vs. last year</span>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;