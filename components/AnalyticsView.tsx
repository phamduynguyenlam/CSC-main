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
                  ? 'border-[#0077b6] text-[#0077b6] dark:text-[#90e0ef]'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="bg-white dark:bg-[#0A2540] rounded-lg shadow p-6">
        {activeTab === 'surveys' && (
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Phân bố kết quả khảo sát
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white dark:bg-[#52b788]/20 p-4 rounded-lg">
                <h4 className="font-medium text-[#52b788] dark:text-[#52b788]">Tích cực</h4>
                <p className="text-2xl font-bold text-[#52b788] dark:text-[#52b788]">72%</p>
                <p className="text-sm text-[#52b788] dark:text-[#52b788]">+5% so với tháng trước</p>
              </div>
              <div className="bg-white dark:bg-[#f4a261]/20 p-4 rounded-lg">
                <h4 className="font-medium text-[#f4a261] dark:text-[#f4a261]">Trung tính</h4>
                <p className="text-2xl font-bold text-[#f4a261] dark:text-[#f4a261]">18%</p>
                <p className="text-sm text-[#f4a261] dark:text-[#f4a261]">-2% so với tháng trước</p>
              </div>
              <div className="bg-white dark:bg-[#e63946]/20 p-4 rounded-lg">
                <h4 className="font-medium text-[#e63946] dark:text-[#e63946]">Tiêu cực</h4>
                <p className="text-2xl font-bold text-[#e63946] dark:text-[#e63946]">10%</p>
                <p className="text-sm text-[#e63946] dark:text-[#e63946]">-3% so với tháng trước</p>
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
                <div key={index} className="flex items-center justify-between p-3 bg-white dark:bg-[#0077b6] rounded">
                  <div className="flex items-center space-x-3">
                    <span className={`w-3 h-3 rounded-full ${
                      keyword.sentiment === 'Tích cực' ? 'bg-[#52b788]' : 'bg-[#e63946]'
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