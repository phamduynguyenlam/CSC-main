import React from 'react';

const SocialFeedbackView: React.FC = () => {
  const mentions = [
    {
      user: "@fashionista_jane",
      time: "2h ago",
      sentiment: "positive",
      content: "Absolutely love the new collection! The quality is amazing and shipping was super fast 😍",
      likes: 234,
      comments: 45
    },
    {
      user: "@style_hunter", 
      time: "4h ago",
      sentiment: "negative",
      content: "The product looks different from the photos. A bit disappointed 😕",
      likes: 89,
      comments: 23
    },
    {
      user: "@shopping_queen",
      time: "6h ago", 
      sentiment: "neutral",
      content: "Just received my order. Packaging is nice, trying it out now!",
      likes: 156,
      comments: 12
    },
    {
      user: "@trend_setter",
      time: "8h ago",
      sentiment: "positive", 
      content: "Best customer service ever! They helped me with my size issue immediately 🌟",
      likes: 312,
      comments: 67
    }
  ];

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20';
      case 'negative': return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20';
      default: return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/20';
    }
  };

  const getSentimentDot = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return 'bg-green-500';
      case 'negative': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-green-600 dark:text-green-400">78%</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Positive Mentions</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">2,847</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Total Mentions</div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 text-center">
          <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">4.2/5</div>
          <div className="text-gray-600 dark:text-gray-400 mt-1">Avg. Sentiment</div>
        </div>
      </div>

      {/* Recent Mentions */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Mentions</h2>
        </div>
        
        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {mentions.map((mention, index) => (
            <div key={index} className="p-6">
              <div className="flex items-start space-x-4">
                {/* Avatar */}
                <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center flex-shrink-0">
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
                      {mention.sentiment}
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