import React, { useState } from 'react';

const AnalyticsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState('surveys');

  const tabs = [
    { id: 'surveys', label: 'Phân tích khảo sát' },
    { id: 'keywords', label: 'Từ khóa' },
    { id: 'reviews', label: 'Đánh giá sản phẩm' },
    { id: 'actions', label: 'Hành động đề xuất' }
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Phân tích & Chẩn đoán</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Hiểu rõ hơn về cảm xúc và hành vi khách hàng</p>
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
                  ? 'border-blue-700 text-blue-700 dark:text-sky-200'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-slate-900 rounded-lg shadow p-6">
        {activeTab === 'surveys' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Phân bố kết quả khảo sát
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-green-600/20 p-4 rounded-lg">
                <h4 className="font-medium text-green-600 dark:text-green-600">Tích cực</h4>
                <p className="text-2xl font-bold text-green-600 dark:text-green-600">72%</p>
                <p className="text-sm text-green-600 dark:text-green-600">+5% so với tháng trước</p>
              </div>
              <div className="bg-white dark:bg-yellow-400/20 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-500 dark:text-yellow-400">Trung tính</h4>
                <p className="text-2xl font-bold text-yellow-500 dark:text-yellow-400">18%</p>
                <p className="text-sm text-yellow-500 dark:text-yellow-400">-2% so với tháng trước</p>
              </div>
              <div className="bg-white dark:bg-red-600/20 p-4 rounded-lg">
                <h4 className="font-medium text-red-600 dark:text-red-600">Tiêu cực</h4>
                <p className="text-2xl font-bold text-red-600 dark:text-red-600">10%</p>
                <p className="text-sm text-red-600 dark:text-red-600">-3% so với tháng trước</p>
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
                { word: 'excellent', sentiment: 'Tích cực', count: 234 },
                { word: 'slow', sentiment: 'Tiêu cực', count: 89 },
                { word: 'helpful', sentiment: 'Tích cực', count: 156 },
                { word: 'confusing', sentiment: 'Tiêu cực', count: 67 }
              ].map((keyword, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-blue-700 rounded">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${
                      keyword.sentiment === 'Tích cực' ? 'bg-green-600' : 'bg-red-600'
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
              Tóm tắt đánh giá sản phẩm
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Phân tích đánh giá sản phẩm chi tiết sẽ sớm ra mắt...
            </p>
          </div>
        )}

        {activeTab === 'actions' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Hành động đề xuất
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Các hành động do AI đề xuất dựa trên phân tích cảm xúc khách hàng
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalyticsView;