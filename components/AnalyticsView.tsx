import React, { useState } from 'react';

const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('surveys');

  const tabs = [
    { id: 'surveys', label: 'Survey Analysis' },
    { id: 'keywords', label: 'Keywords' },
    { id: 'reviews', label: 'Product Reviews' },
    { id: 'actions', label: 'Action Items' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Analytics & Diagnostics</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Deep insights into customer sentiment and behavior</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6">
        {activeTab === 'surveys' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Survey Results Distribution
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-800 dark:text-green-400">Positive</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">72%</p>
                <p className="text-sm text-green-600 dark:text-green-400">+5% from last month</p>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Neutral</h4>
                <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">18%</p>
                <p className="text-sm text-yellow-600 dark:text-yellow-400">-2% from last month</p>
              </div>
              <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-lg">
                <h4 className="font-medium text-red-800 dark:text-red-400">Negative</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">10%</p>
                <p className="text-sm text-red-600 dark:text-red-400">-3% from last month</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'keywords' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Top Keywords Analysis
            </h3>
            <div className="space-y-3">
              {[
                { word: 'excellent', sentiment: 'positive', count: 234 },
                { word: 'slow', sentiment: 'negative', count: 89 },
                { word: 'helpful', sentiment: 'positive', count: 156 },
                { word: 'confusing', sentiment: 'negative', count: 67 }
              ].map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${
                      keyword.sentiment === 'positive' ? 'bg-green-400' : 'bg-red-400'
                    }`}></span>
                    <span className="font-medium text-gray-900 dark:text-white">{keyword.word}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{keyword.count} mentions</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'reviews' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Product Reviews Summary
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Detailed product review analysis coming soon...
            </p>
          </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Recommended Actions
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              AI-generated action items based on sentiment analysis...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;