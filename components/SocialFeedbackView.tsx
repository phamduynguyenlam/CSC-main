import React from 'react';

const SocialFeedbackView: React.FC = () => {
  const mentions = [
    {
      user: "@nglinh",
      time: "2 giờ trước",
      sentiment: "positive",
      content: "Mình mê bộ sưu tập mới lắm! Chất lượng tốt mà giao hàng còn siêu nhanh nữa.",
      likes: 234,
      comments: 45
    },
    {
      user: "@ming_nt",
      time: "4 giờ trước",
      sentiment: "negative",
      content: "Sản phẩm trông khác so với ảnh trên web khá nhiều. Mình hơi thất vọng.",
      likes: 89,
      comments: 23
    },
    {
      user: "@changchang",
      time: "6 giờ trước",
      sentiment: "neutral",
      content: "Vừa nhận được đơn hàng. Đóng gói chắc chắn, đang dùng thử xem sao.",
      likes: 156,
      comments: 12
    },
    {
      user: "@hphuong",
      time: "8 giờ trước",
      sentiment: "positive",
      content: "Dịch vụ chăm sóc khách hàng tốt nhất mình từng gặp! Hỗ trợ đổi size ngay lập tức, rất hài lòng!",
      likes: 312,
      comments: 67
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-500 bg-green-600/10 dark:bg-green-600/20';
      case 'negative': return 'text-red-500 bg-red-600/10 dark:bg-red-600/20';
      default: return 'text-yellow-500 bg-yellow-400/10 dark:bg-yellow-400/20';
    }
  };

  const getSentimentLabel = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'Tích cực';
      case 'negative': return 'Tiêu cực';
      default: return 'Trung tính';
    }
  };

  const getSentimentDot = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-600';
      case 'negative': return 'bg-red-600';
      default: return 'bg-yellow-400';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-500 dark:text-sky-400">88%</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Lượt đề cập tích cực</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-500 dark:text-sky-400">2.847</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Tổng lượt đề cập</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6 text-center">
          <div className="text-3xl font-bold text-blue-500 dark:text-sky-400">8.3</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Sentiment Score</div>
        </div>
      </div>

      {/* Recent Mentions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Lượt đề cập gần đây</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mentions.map((mention, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-slate-300 dark:bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300">
                    {mention.user.charAt(1).toUpperCase()}
                  </span>
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="font-medium text-gray-900 dark:text-white">{mention.user}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{mention.time}</span>
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getSentimentColor(mention.sentiment)}`}>
                      <span className={`w-2 h-2 rounded-full mr-1 ${getSentimentDot(mention.sentiment)}`}></span>
                      {getSentimentLabel(mention.sentiment)}
                    </span>
                  </div>
                  
                  <p className="text-gray-700 dark:text-gray-300 mb-3">
                    {mention.content}
                  </p>
                  
                  {/* Engagement */}
                  <div className="flex items-center space-x-4 text-gray-500 dark:text-gray-400">
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-sm">{mention.likes}</span>
                    </div>
                    
                    <div className="flex items-center space-x-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <span className="text-sm">{mention.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SocialFeedbackView;