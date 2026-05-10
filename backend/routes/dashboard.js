import express from 'express';

const router = express.Router();

// Generate mock data for dashboard
function generateMockData() {
  return {
    sentimentData: [
      { name: 'Mon', sentiment: 4.5, calls: 120 },
      { name: 'Tue', sentiment: 4.6, calls: 135 },
      { name: 'Wed', sentiment: 4.2, calls: 98 },
      { name: 'Thu', sentiment: 4.8, calls: 156 },
      { name: 'Fri', sentiment: 4.9, calls: 189 },
      { name: 'Sat', sentiment: 4.7, calls: 145 },
      { name: 'Sun', sentiment: 5.0, calls: 98 },
    ],
    frustrationData: [
      { name: 'Billing', value: 400, percentage: 32.1 },
      { name: 'UI/UX', value: 300, percentage: 24.1 },
      { name: 'Support', value: 200, percentage: 16.1 },
      { name: 'Bugs', value: 278, percentage: 22.3 },
      { name: 'Features', value: 189, percentage: 15.2 },
    ],
    churnData: [{ value: 78 }],
    kpiData: {
      activeCalls: 24,
      avgSentiment: 7.8,
      totalLogins: 2847,
      productsReviewed: 1234,
      callsGrowth: 12,
      sentimentGrowth: 0.5,
      loginsGrowth: 23,
      reviewsPercentage: 67
    },
    feedbackData: [
      { 
        text: "The new checkout process is confusing and I was double-charged!", 
        emotion: "Anger", 
        source: "Email",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        userId: "user_001"
      },
      { 
        text: "Absolutely love the new reporting feature, it's a game changer for my team.", 
        emotion: "Delight", 
        source: "Chat",
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        userId: "user_002"
      },
      { 
        text: "Why can't I export my data to CSV? This is a basic feature.", 
        emotion: "Frustration", 
        source: "Social",
        timestamp: new Date(Date.now() - 1800000).toISOString(),
        userId: "user_003"
      },
      {
        text: "Customer service was amazing! They resolved my issue in under 5 minutes.",
        emotion: "Delight",
        source: "Survey",
        timestamp: new Date(Date.now() - 5400000).toISOString(),
        userId: "user_004"
      }
    ]
  };
}

// Get dashboard overview data
router.get('/overview', (req, res) => {
  try {
    const data = generateMockData();
    res.json({
      success: true,
      data: {
        kpis: data.kpiData,
        sentimentTrend: data.sentimentData,
        frustrationDrivers: data.frustrationData,
        churnScore: data.churnData[0],
        recentFeedback: data.feedbackData.slice(0, 3)
      }
    });
  } catch (error) {
    console.error('Error getting dashboard overview:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch dashboard overview'
    });
  }
});

// Get real-time updates
router.get('/live-updates', (req, res) => {
  const updates = [
    "🎉 500th visitor milestone reached!",
    "💰 New order $1,250 from Store #3",
    "📊 Store #1: $4,320 in last hour",
    "🎉 1000th visitor milestone reached!",
    "💰 Premium order $2,100 from Store #5",
    "📈 Sentiment improved by 0.3 points",
    "🔔 New customer feedback received",
    "⭐ 5-star rating from premium customer"
  ];

  res.json({
    success: true,
    updates: updates.map((text, index) => ({
      id: `update_${Date.now()}_${index}`,
      text,
      timestamp: new Date(Date.now() - Math.random() * 3600000).toISOString()
    }))
  });
});

// Get sentiment analytics
router.get('/sentiment-analytics', (req, res) => {
  try {
    const data = generateMockData();
    res.json({
      success: true,
      data: {
        trends: data.sentimentData,
        distribution: [
          { emotion: 'Positive', count: 1245, percentage: 62.3 },
          { emotion: 'Neutral', count: 456, percentage: 22.8 },
          { emotion: 'Negative', count: 298, percentage: 14.9 }
        ],
        topKeywords: [
          { keyword: 'excellent', sentiment: 'positive', frequency: 89 },
          { keyword: 'slow', sentiment: 'negative', frequency: 67 },
          { keyword: 'helpful', sentiment: 'positive', frequency: 54 },
          { keyword: 'confusing', sentiment: 'negative', frequency: 43 }
        ]
      }
    });
  } catch (error) {
    console.error('Error getting sentiment analytics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch sentiment analytics'
    });
  }
});

// Get social media feedback
router.get('/social-feedback', (req, res) => {
  try {
    const data = generateMockData();
    res.json({
      success: true,
      data: {
        feeds: data.feedbackData,
        summary: {
          totalFeedbacks: data.feedbackData.length,
          averageSentiment: 4.2,
          responseRate: 87.5,
          topSources: [
            { source: 'Twitter', count: 156 },
            { source: 'Facebook', count: 89 },
            { source: 'Instagram', count: 67 },
            { source: 'LinkedIn', count: 34 }
          ]
        }
      }
    });
  } catch (error) {
    console.error('Error getting social feedback:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch social feedback'
    });
  }
});

export default router;