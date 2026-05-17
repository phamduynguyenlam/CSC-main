import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area } from 'recharts';

const SWOTAnalysisView: React.FC = () => {
  const [currentAlert, setCurrentAlert] = useState<string | null>(null);

  // Enhanced KPI data with year-over-year comparisons
  const kpiMetrics = {
    // Login metrics - last year vs current year
    loginMetrics: {
      currentYear: 45678,
      lastYear: 38942,
      growth: 17.3
    },
    // Productive calls - last year vs current year  
    productiveCalls: {
      currentYear: 12450,
      lastYear: 10890,
      growth: 14.3
    },
    conversionRate: 4.1,
    totalPurchases: 1931,
    avgOrderValue: 127.50,
    customerSatisfaction: 87.3,
    revenue: 246202,
    monthlyGrowth: 12.5,
    // Products reviewed vs ordered
    productMetrics: {
      reviewed: 8945,
      ordered: 2178,
      conversionFromReview: 24.3
    }
  };

  // Amazon dataset analytics for e-commerce insights
  const amazonDataset = {
    overview: {
      totalProducts: 568234,
      activeCategories: 28,
      avgRating: 4.2,
      totalReviews: 15670982,
      priceRange: { min: 0.99, max: 89999.99, avg: 127.89 }
    },
    topCategories: [
      { name: 'Electronics', products: 142589, avgRating: 4.1, avgPrice: 299.99, reviews: 4251789, id: 'electronics' },
      { name: 'Home & Kitchen', products: 89234, avgRating: 4.3, avgPrice: 67.45, reviews: 2983467, id: 'home-kitchen' },
      { name: 'Books', products: 76891, avgRating: 4.4, avgPrice: 15.99, reviews: 1876234, id: 'books' },
      { name: 'Fashion', products: 65432, avgRating: 3.9, avgPrice: 45.99, reviews: 2134567, id: 'fashion' },
      { name: 'Sports & Outdoors', products: 54321, avgRating: 4.2, avgPrice: 89.99, reviews: 1567890, id: 'sports' },
      { name: 'Beauty & Personal Care', products: 43210, avgRating: 4.0, avgPrice: 32.99, reviews: 1234567, id: 'beauty' }
    ],
    sentimentAnalysis: {
      positive: 68.4,
      neutral: 19.3,
      negative: 12.3,
      averageStars: 4.2,
      monthlyTrend: 2.1
    },
    priceDistribution: [
      { range: '$0-25', count: 234567, percentage: 41.3, id: 'price-0-25' },
      { range: '$25-50', count: 156789, percentage: 27.6, id: 'price-25-50' },
      { range: '$50-100', count: 98765, percentage: 17.4, id: 'price-50-100' },
      { range: '$100-250', count: 54321, percentage: 9.6, id: 'price-100-250' },
      { range: '$250-500', count: 17890, percentage: 3.1, id: 'price-250-500' },
      { range: '$500+', count: 6902, percentage: 1.2, id: 'price-500-plus' }
    ],
    competitorInsights: {
      marketShare: 38.7,
      competitorComparison: [
        { competitor: 'Amazon', rating: 4.2, priceCompetitiveness: 89, marketShare: 38.7 },
        { competitor: 'eBay', rating: 3.9, priceCompetitiveness: 92, marketShare: 22.1 },
        { competitor: 'Walmart', rating: 4.0, priceCompetitiveness: 95, marketShare: 18.3 },
        { competitor: 'Target', rating: 4.1, priceCompetitiveness: 87, marketShare: 11.2 },
        { competitor: 'Others', rating: 3.8, priceCompetitiveness: 85, marketShare: 9.7 }
      ]
    }
  };

  // Monthly segmentation data for seasonality analysis
  const seasonalityData = [
    { month: 'Jan', logins: 3820, calls: 980, sales: 145, reviews: 720, orders: 165 },
    { month: 'Feb', logins: 3654, calls: 920, sales: 132, reviews: 689, orders: 158 },
    { month: 'Mar', logins: 4125, calls: 1095, sales: 178, reviews: 834, orders: 195 },
    { month: 'Apr', logins: 3987, calls: 1050, sales: 165, reviews: 798, orders: 182 },
    { month: 'May', logins: 4456, calls: 1180, sales: 198, reviews: 912, orders: 220 },
    { month: 'Jun', logins: 4890, calls: 1290, sales: 225, reviews: 987, orders: 245 },
    { month: 'Jul', logins: 5124, calls: 1340, sales: 245, reviews: 1045, orders: 268 },
    { month: 'Aug', logins: 4798, calls: 1265, sales: 235, reviews: 978, orders: 255 },
    { month: 'Sep', logins: 4234, calls: 1120, sales: 189, reviews: 856, orders: 198 },
    { month: 'Oct', logins: 3956, calls: 1045, sales: 172, reviews: 802, orders: 185 },
    { month: 'Nov', logins: 3789, calls: 1005, sales: 168, reviews: 765, orders: 178 },
    { month: 'Dec', logins: 4568, calls: 1225, sales: 198, reviews: 924, orders: 215 }
  ];

  // Survey results data (1-5 stars)
  const surveyResults = [
    { stars: 5, count: 1892, percentage: 45.2, label: 'Excellent', id: 'excellent' },
    { stars: 4, count: 1345, percentage: 32.1, label: 'Good', id: 'good' },
    { stars: 3, count: 578, percentage: 13.8, label: 'Average', id: 'average' },
    { stars: 2, count: 234, percentage: 5.6, label: 'Poor', id: 'poor' },
    { stars: 1, count: 138, percentage: 3.3, label: 'Very Poor', id: 'very-poor' }
  ];

  // Keywords analysis data
  const keywordsData = [
    { keyword: 'easy to use', frequency: 847, sentiment: 'positive', impact: 'high', id: 'easy-to-use' },
    { keyword: 'fast delivery', frequency: 723, sentiment: 'positive', impact: 'high', id: 'fast-delivery' },
    { keyword: 'great support', frequency: 612, sentiment: 'positive', impact: 'medium', id: 'great-support' },
    { keyword: 'expensive', frequency: 445, sentiment: 'negative', impact: 'medium', id: 'expensive' },
    { keyword: 'confusing', frequency: 234, sentiment: 'negative', impact: 'high', id: 'confusing' },
    { keyword: 'slow response', frequency: 198, sentiment: 'negative', impact: 'high', id: 'slow-response' },
    { keyword: 'love it', frequency: 567, sentiment: 'positive', impact: 'high', id: 'love-it' },
    { keyword: 'recommend', frequency: 489, sentiment: 'positive', impact: 'high', id: 'recommend' }
  ];

  // AFI (Areas for Improvement) triggers
  const afiTriggers = [
    { 
      area: 'Response Time', 
      currentScore: 3.2, 
      target: 4.5, 
      priority: 'High',
      action: 'Implement automated chat responses for common queries',
      id: 'response-time'
    },
    { 
      area: 'Product Discovery', 
      currentScore: 3.8, 
      target: 4.2, 
      priority: 'Medium',
      action: 'Enhance search algorithm and recommendation engine',
      id: 'product-discovery'
    },
    { 
      area: 'Checkout Process', 
      currentScore: 4.1, 
      target: 4.6, 
      priority: 'High',
      action: 'Simplify checkout flow and add guest checkout option',
      id: 'checkout-process'
    },
    { 
      area: 'Mobile Experience', 
      currentScore: 3.9, 
      target: 4.4, 
      priority: 'Medium',
      action: 'Optimize mobile app performance and UI',
      id: 'mobile-experience'
    }
  ];

  // Top performing agents data
  const topAgents = [
    { name: 'Sarah Chen', calls: 47, resolution: 94, satisfaction: 4.8, availability: 98, id: 'sarah-chen' },
    { name: 'Michael Rodriguez', calls: 52, resolution: 91, satisfaction: 4.7, availability: 96, id: 'michael-rodriguez' },
    { name: 'Emily Johnson', calls: 43, resolution: 89, satisfaction: 4.6, availability: 94, id: 'emily-johnson' },
    { name: 'David Thompson', calls: 39, resolution: 87, satisfaction: 4.5, availability: 92, id: 'david-thompson' },
    { name: 'Lisa Wang', calls: 41, resolution: 93, satisfaction: 4.7, availability: 95, id: 'lisa-wang' }
  ];

  // Call Categories data for analytics
  const callCategoriesData = [
    { category: 'Technical Support', calls: 892, percentage: 31, id: 'tech-support' },
    { category: 'Billing Inquiries', calls: 654, percentage: 23, id: 'billing' },
    { category: 'Product Information', calls: 487, percentage: 17, id: 'product-info' },
    { category: 'Order Status', calls: 398, percentage: 14, id: 'order-status' },
    { category: 'Returns/Refunds', calls: 289, percentage: 10, id: 'returns' },
    { category: 'Complaints', calls: 127, percentage: 5, id: 'complaints' }
  ];

  // Positive trends for sustainable goals
  const positiveGoals = [
    {
      goal: 'Customer Retention Rate',
      current: 84.2,
      target: 90.0,
      trend: '+5.3% YoY',
      sustainability: 'Green Initiative: Eco-friendly packaging'
    },
    {
      goal: 'Employee Satisfaction',
      current: 87.8,
      target: 92.0,
      trend: '+8.1% YoY',
      sustainability: 'Remote work flexibility and mental health support'
    },
    {
      goal: 'Carbon Footprint Reduction',
      current: 23.4,
      target: 40.0,
      trend: '+12.8% reduction',
      sustainability: 'Renewable energy and sustainable sourcing'
    }
  ];

  // Store-wise sales data for ticker
  const storeWiseSales = [
    { store: 'Downtown', sales: 15420, growth: '+12%', id: 'downtown' },
    { store: 'Mall Plaza', sales: 18750, growth: '+8%', id: 'mall-plaza' },
    { store: 'Online', sales: 45890, growth: '+25%', id: 'online' },
    { store: 'Westside', sales: 12340, growth: '+5%', id: 'westside' }
  ];

  // Ticker alerts system
  const tickerAlerts = [
    '🎉 500th visitor milestone reached! Welcome bonus activated.',
    '💰 High-value order alert: $1,247 purchase from Premium customer!',
    '📊 Downtown store: $2,450 in last hour (+15% vs yesterday)',
    '🔥 Flash sale update: 234 items sold in past 60 minutes',
    '⭐ New 5-star review: "Outstanding customer service experience!"',
    '📈 Mall Plaza store: $3,120 hourly sales (Best performing location)',
    '🚀 Conversion rate spike: 6.2% in past hour (above target!)',
    '💳 Large order processed: $1,890 enterprise customer purchase'
  ];

  // Rotating ticker effect
  useEffect(() => {
    let alertIndex = 0;
    const interval = setInterval(() => {
      setCurrentAlert(tickerAlerts[alertIndex]);
      alertIndex = (alertIndex + 1) % tickerAlerts.length;
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const conversionData = [
    { month: 'Jan', rate: 2.4, purchases: 245 },
    { month: 'Feb', rate: 2.8, purchases: 287 },
    { month: 'Mar', rate: 3.2, purchases: 324 },
    { month: 'Apr', rate: 2.9, purchases: 295 },
    { month: 'May', rate: 3.6, purchases: 362 },
    { month: 'Jun', rate: 4.1, purchases: 418 },
  ];

  const futureGoals = [
    { goal: 'Increase Conversion Rate', current: 4.1, target: 6.0, progress: 68, id: 'conversion-rate' },
    { goal: 'Monthly Sales Volume', current: 418, target: 600, progress: 70, id: 'sales-volume' },
    { goal: 'Customer Satisfaction', current: 87.3, target: 95.0, progress: 92, id: 'customer-satisfaction' },
    { goal: 'Average Order Value', current: 127.50, target: 150.00, progress: 85, id: 'order-value' }
  ];

  const productCategories = [
    { name: 'Electronics', value: 35, color: '#3B82F6' },
    { name: 'Clothing', value: 28, color: '#10B981' },
    { name: 'Home & Garden', value: 22, color: '#F59E0B' },
    { name: 'Books', value: 15, color: '#EF4444' }
  ];

  const swotData = {
    strengths: [
      'Strong brand reputation and customer loyalty',
      'Advanced AI-powered sentiment analysis',
      'Real-time customer feedback integration',
      'High customer satisfaction scores (87.3%)',
      'Growing conversion rates (+12.5% monthly)'
    ],
    weaknesses: [
      'Limited mobile app presence',
      'High customer acquisition costs',
      'Seasonal revenue fluctuations',
      'Limited international market penetration'
    ],
    opportunities: [
      'Expand to mobile commerce platform',
      'Implement personalized recommendation engine',
      'Enter emerging international markets',
      'Develop subscription-based services',
      'Partner with influencers and content creators'
    ],
    threats: [
      'Increased competition from major e-commerce platforms',
      'Economic downturn affecting consumer spending',
      'Supply chain disruptions',
      'Data privacy regulation changes',
      'Rising digital advertising costs'
    ]
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value}%`;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Moving Ticker Alerts */}
        <div className="mb-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white p-3 rounded-lg shadow-lg overflow-hidden">
          <div className="flex items-center">
            <span className="bg-white text-blue-600 px-2 py-1 rounded text-sm font-semibold mr-4">LIVE</span>
            <div className="marquee whitespace-nowrap">
              <span className="text-lg font-medium">{currentAlert}</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Business Intelligence Dashboard
        </h1>

        {/* Enhanced KPI Metrics Section with Year-over-Year */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Logins (YoY)</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{kpiMetrics.loginMetrics.currentYear.toLocaleString()}</p>
            <p className="text-green-600 dark:text-green-400 text-sm">+{formatPercentage(kpiMetrics.loginMetrics.growth)} vs {kpiMetrics.loginMetrics.lastYear.toLocaleString()} last year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Productive Calls (YoY)</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{kpiMetrics.productiveCalls.currentYear.toLocaleString()}</p>
            <p className="text-green-600 dark:text-green-400 text-sm">+{formatPercentage(kpiMetrics.productiveCalls.growth)} vs {kpiMetrics.productiveCalls.lastYear.toLocaleString()} last year</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Products Reviewed</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{kpiMetrics.productMetrics.reviewed.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">{kpiMetrics.productMetrics.ordered.toLocaleString()} orders ({formatPercentage(kpiMetrics.productMetrics.conversionFromReview)} conversion)</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Conversion Rate</h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">{formatPercentage(kpiMetrics.conversionRate)}</p>
            <p className="text-green-600 dark:text-green-400 text-sm">+{formatPercentage(kpiMetrics.monthlyGrowth)} from last month</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Total Purchases</h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">{kpiMetrics.totalPurchases.toLocaleString()}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Last 6 months</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Revenue</h3>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">{formatCurrency(kpiMetrics.revenue)}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">YTD</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Avg Order Value</h3>
            <p className="text-3xl font-bold text-orange-600 dark:text-orange-400">{formatCurrency(kpiMetrics.avgOrderValue)}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Per transaction</p>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Customer Satisfaction</h3>
            <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{formatPercentage(kpiMetrics.customerSatisfaction)}</p>
            <p className="text-gray-500 dark:text-gray-400 text-sm">Based on sentiment analysis</p>
          </div>
        </div>

        {/* Seasonality Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Monthly Trends - Seasonality Analysis</h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={seasonalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="month" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px',
                    color: '#F9FAFB'
                  }} 
                />
                <Area type="monotone" dataKey="logins" stackId="1" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.6} />
                <Area type="monotone" dataKey="calls" stackId="2" stroke="#10B981" fill="#10B981" fillOpacity={0.6} />
                <Area type="monotone" dataKey="sales" stackId="3" stroke="#F59E0B" fill="#F59E0B" fillOpacity={0.6} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Store-wise Performance</h3>
            <div className="space-y-4">
              {storeWiseSales.map((store) => (
                <div key={`store-${store.id}`} className="flex justify-between items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{store.store}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Hourly average</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">{formatCurrency(store.sales)}</p>
                    <p className="text-sm text-green-600 dark:text-green-400">{store.growth}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Future Goals Section */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Future Goals & Targets</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureGoals.map((goal) => (
              <div key={`goal-${goal.id}`} className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{goal.goal}</h4>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Current: {typeof goal.current === 'number' && goal.current > 100 ? goal.current.toLocaleString() : goal.current}</span>
                  <span>Target: {typeof goal.target === 'number' && goal.target > 100 ? goal.target.toLocaleString() : goal.target}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{goal.progress}% complete</p>
              </div>
            ))}
          </div>
        </div>

        {/* Survey Results (1-5 Stars) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Survey Results</h3>
            <div className="space-y-4">
              {surveyResults.map((result) => (
                <div key={`survey-${result.id}`} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={`star-${result.label}-${i}`} 
                          className={`text-lg ${i < result.stars ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">({result.label})</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-32 bg-gray-200 dark:bg-gray-600 rounded-full h-2 mr-3">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900 dark:text-white w-16 text-right">
                      {result.count} ({result.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords Analysis */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Keywords Analysis</h3>
            <div className="space-y-3">
              {keywordsData.map((keyword) => (
                <div key={`keyword-${keyword.id}`} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{keyword.keyword}</span>
                    <div className="flex items-center mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        keyword.sentiment === 'positive' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                      }`}>
                        {keyword.sentiment}
                      </span>
                      <span className={`ml-2 px-2 py-1 rounded text-xs ${
                        keyword.impact === 'high' 
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-800 dark:text-orange-100'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100'
                      }`}>
                        {keyword.impact} impact
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{keyword.frequency}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">mentions</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AFI Triggers and Positive Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AFI (Areas for Improvement) Triggers */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🎯 AFI Strategy Triggers</h3>
            <div className="space-y-4">
              {afiTriggers.map((afi) => (
                <div key={`afi-${afi.id}`} className="p-4 border-l-4 border-orange-500 bg-orange-50 dark:bg-orange-900/20 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{afi.area}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      afi.priority === 'High' 
                        ? 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                    }`}>
                      {afi.priority} Priority
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Current: {afi.currentScore}/5</span>
                      <span className="text-gray-600 dark:text-gray-400">Target: {afi.target}/5</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${(afi.currentScore / afi.target) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{afi.action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Positive Trends for Sustainable Goals */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🌱 Sustainable Goals Progress</h3>
            <div className="space-y-4">
              {positiveGoals.map((goal) => (
                <div key={`positive-goal-${goal.goal.toLowerCase().replace(/\s+/g, '-')}`} className="p-4 border-l-4 border-green-500 bg-green-50 dark:bg-green-900/20 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{goal.goal}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Current: {goal.current}% | Target: {goal.target}%
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{goal.trend}</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${(goal.current / goal.target) * 100}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300 italic">{goal.sustainability}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call Center Analytics Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">📞</span>
            Call Center Analytics Dashboard
          </h2>

          {/* Call Center KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Total Calls Today</h3>
              <p className="text-3xl font-bold">2,847</p>
              <p className="text-teal-100 text-sm">↑ 12% vs yesterday</p>
            </div>

            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Average Handle Time</h3>
              <p className="text-3xl font-bold">4:32</p>
              <p className="text-emerald-100 text-sm">↓ 8% improvement</p>
            </div>

            <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">First Call Resolution</h3>
              <p className="text-3xl font-bold">89.3%</p>
              <p className="text-cyan-100 text-sm">Target: 85%</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Customer Satisfaction</h3>
              <p className="text-3xl font-bold">4.6/5</p>
              <p className="text-blue-100 text-sm">1,234 surveys today</p>
            </div>
          </div>

          {/* Call Center Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hourly Call Volume */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hourly Call Volume (Today)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={[
                  { hour: '9 AM', calls: 89, resolved: 78, abandoned: 8 },
                  { hour: '10 AM', calls: 145, resolved: 132, abandoned: 6 },
                  { hour: '11 AM', calls: 234, resolved: 209, abandoned: 12 },
                  { hour: '12 PM', calls: 298, resolved: 267, abandoned: 18 },
                  { hour: '1 PM', calls: 187, resolved: 171, abandoned: 9 },
                  { hour: '2 PM', calls: 256, resolved: 231, abandoned: 14 },
                  { hour: '3 PM', calls: 312, resolved: 284, abandoned: 16 },
                  { hour: '4 PM', calls: 289, resolved: 261, abandoned: 15 },
                  { hour: '5 PM', calls: 198, resolved: 179, abandoned: 11 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="calls" stroke="#06B6D4" strokeWidth={3} name="Total Calls" />
                  <Line type="monotone" dataKey="resolved" stroke="#10B981" strokeWidth={2} name="Resolved" />
                  <Line type="monotone" dataKey="abandoned" stroke="#EF4444" strokeWidth={2} name="Abandoned" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Performance */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Performing Agents</h3>
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <div key={`agent-${agent.id}-${index}`} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                      <div className="grid grid-cols-4 gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300">
                        <span>Calls: {agent.calls}</span>
                        <span>FCR: {agent.resolution}%</span>
                        <span>CSAT: {agent.satisfaction}</span>
                        <span>Avail: {agent.availability}%</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-green-600 dark:text-green-400">#{index + 1}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Call Categories & Sentiment Analysis */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Call Categories */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Call Categories (Today)</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={callCategoriesData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="calls"
                  >
                    {callCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${entry.id}-${index}`} fill={['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899'][index % 6]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Calls']} />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Real-time Sentiment Analysis */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Live Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">😊</span>
                    <div>
                      <p className="font-semibold text-green-800 dark:text-green-300">Positive</p>
                      <p className="text-sm text-green-600 dark:text-green-400">Happy customers</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">68.4%</p>
                    <p className="text-sm text-green-500">1,947 calls</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">😐</span>
                    <div>
                      <p className="font-semibold text-yellow-800 dark:text-yellow-300">Neutral</p>
                      <p className="text-sm text-yellow-600 dark:text-yellow-400">Standard inquiries</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-600">19.3%</p>
                    <p className="text-sm text-yellow-500">549 calls</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">😠</span>
                    <div>
                      <p className="font-semibold text-red-800 dark:text-red-300">Negative</p>
                      <p className="text-sm text-red-600 dark:text-red-400">Issues & complaints</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-600">12.3%</p>
                    <p className="text-sm text-red-500">351 calls</p>
                  </div>
                </div>
              </div>

              {/* Live Call Feed */}
              <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-3">🔴 Live Call Feed</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-green-600">Agent Sarah:</span>
                    <span className="text-gray-600 dark:text-gray-300">"Thank you for your patience..."</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-blue-600">Agent Michael:</span>
                    <span className="text-gray-600 dark:text-gray-300">"I can help resolve that issue..."</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-orange-600">Agent Emily:</span>
                    <span className="text-gray-600 dark:text-gray-300">"Let me escalate this for you..."</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Queue Management & Wait Times */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📋 Queue Status</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Calls in Queue:</span>
                  <span className="text-2xl font-bold text-blue-600">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Avg Wait Time:</span>
                  <span className="text-2xl font-bold text-orange-600">2:14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Longest Wait:</span>
                  <span className="text-2xl font-bold text-red-600">5:47</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">👥 Agent Availability</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-green-600">Available:</span>
                  <span className="text-2xl font-bold text-green-600">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-yellow-600">On Call:</span>
                  <span className="text-2xl font-bold text-yellow-600">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">On Break:</span>
                  <span className="text-2xl font-bold text-gray-600">7</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">🎯 SLA Compliance</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Answer Rate:</span>
                  <span className="text-2xl font-bold text-green-600">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Quick Answer:</span>
                  <span className="text-2xl font-bold text-blue-600">87.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Abandon Rate:</span>
                  <span className="text-2xl font-bold text-orange-600">3.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon Dataset Business Intelligence Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            <span className="text-4xl mr-3">📦</span>
            Amazon Marketplace Intelligence
          </h2>

          {/* Amazon Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Total Products</h3>
              <p className="text-3xl font-bold">{amazonDataset.overview.totalProducts.toLocaleString()}</p>
              <p className="text-orange-100 text-sm">Across {amazonDataset.overview.activeCategories} categories</p>
            </div>

            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Average Rating</h3>
              <p className="text-3xl font-bold">{amazonDataset.overview.avgRating} ⭐</p>
              <p className="text-blue-100 text-sm">{amazonDataset.overview.totalReviews.toLocaleString()} total reviews</p>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Average Price</h3>
              <p className="text-3xl font-bold">${amazonDataset.overview.priceRange.avg}</p>
              <p className="text-green-100 text-sm">Range: ${amazonDataset.overview.priceRange.min} - ${amazonDataset.overview.priceRange.max.toLocaleString()}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-semibold mb-2">Market Position</h3>
              <p className="text-3xl font-bold">{amazonDataset.competitorInsights.marketShare}%</p>
              <p className="text-purple-100 text-sm">Market share leader</p>
            </div>
          </div>

          {/* Amazon Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Categories Chart */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Top Product Categories</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={amazonDataset.topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Products']} />
                  <Bar dataKey="products" fill="#FF9500" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Price Distribution */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Price Distribution</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={amazonDataset.priceDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={(entry) => `${entry.range}: ${entry.percentage}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="count"
                  >
                    {amazonDataset.priceDistribution.map((entry) => (
                      <Cell key={`price-cell-${entry.id}`} fill={['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'][amazonDataset.priceDistribution.indexOf(entry) % 6]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Products']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amazon Sentiment Analysis & Competitor Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sentiment Analysis */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Customer Sentiment Analysis</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-green-600 font-semibold">Positive</span>
                  <span className="text-2xl font-bold text-green-600">{amazonDataset.sentimentAnalysis.positive}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: `${amazonDataset.sentimentAnalysis.positive}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-semibold">Neutral</span>
                  <span className="text-2xl font-bold text-gray-600">{amazonDataset.sentimentAnalysis.neutral}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div className="bg-gray-500 h-3 rounded-full" style={{ width: `${amazonDataset.sentimentAnalysis.neutral}%` }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-red-600 font-semibold">Negative</span>
                  <span className="text-2xl font-bold text-red-600">{amazonDataset.sentimentAnalysis.negative}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-3">
                  <div className="bg-red-500 h-3 rounded-full" style={{ width: `${amazonDataset.sentimentAnalysis.negative}%` }}></div>
                </div>
                
                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    <strong>Monthly Trend:</strong> +{amazonDataset.sentimentAnalysis.monthlyTrend}% improvement in positive sentiment
                  </p>
                </div>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Competitive Analysis</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={amazonDataset.competitorInsights.competitorComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="competitor" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marketShare" fill="#FF9500" name="Market Share %" />
                  <Bar dataKey="rating" fill="#007AFF" name="Rating" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amazon Category Performance Table */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Category Performance Analysis</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-gray-50 dark:bg-gray-700">
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-semibold">Category</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-semibold">Products</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-semibold">Avg Rating</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-semibold">Avg Price</th>
                    <th className="px-4 py-2 text-left text-gray-900 dark:text-white font-semibold">Total Reviews</th>
                  </tr>
                </thead>
                <tbody>
                  {amazonDataset.topCategories.map((category) => (
                    <tr key={`amazon-category-${category.id}`} className="border-b border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700">
                      <td className="px-4 py-2 font-medium text-gray-900 dark:text-white">{category.name}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{category.products.toLocaleString()}</td>
                      <td className="px-4 py-2">
                        <span className="inline-flex items-center">
                          {category.avgRating} ⭐
                        </span>
                      </td>
                      <td className="px-4 py-2 text-green-600 font-semibold">${category.avgPrice}</td>
                      <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{category.reviews.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* SWOT Analysis Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg border border-green-200 dark:border-green-800">
            <h2 className="text-xl font-bold text-green-800 dark:text-green-300 mb-4">💪 Strengths</h2>
            <ul className="space-y-2">
              {swotData.strengths.map((item, index) => (
                <li key={`strength-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-green-700 dark:text-green-200 flex items-start">
                  <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-red-50 dark:bg-red-900/20 p-6 rounded-lg border border-red-200 dark:border-red-800">
            <h2 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4">⚠️ Weaknesses</h2>
            <ul className="space-y-2">
              {swotData.weaknesses.map((item, index) => (
                <li key={`weakness-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-red-700 dark:text-red-200 flex items-start">
                  <span className="text-red-600 dark:text-red-400 mr-2">−</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-lg border border-blue-200 dark:border-blue-800">
            <h2 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4">🚀 Opportunities</h2>
            <ul className="space-y-2">
              {swotData.opportunities.map((item, index) => (
                <li key={`opportunity-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-blue-700 dark:text-blue-200 flex items-start">
                  <span className="text-blue-600 dark:text-blue-400 mr-2">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-orange-50 dark:bg-orange-900/20 p-6 rounded-lg border border-orange-200 dark:border-orange-800">
            <h2 className="text-xl font-bold text-orange-800 dark:text-orange-300 mb-4">⚡ Threats</h2>
            <ul className="space-y-2">
              {swotData.threats.map((item, index) => (
                <li key={`threat-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-orange-700 dark:text-orange-200 flex items-start">
                  <span className="text-orange-600 dark:text-orange-400 mr-2">!</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-8 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-6 rounded-lg border border-purple-200 dark:border-purple-800">
          <h2 className="text-2xl font-bold text-purple-800 dark:text-purple-300 mb-4">📈 Strategic Recommendations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Short-term (0-6 months)</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Optimize mobile experience</li>
                <li>• Implement A/B testing for conversion</li>
                <li>• Enhance customer support</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Medium-term (6-18 months)</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Launch mobile app</li>
                <li>• Expand product categories</li>
                <li>• Implement subscription model</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg">
              <h4 className="font-semibold text-purple-700 dark:text-purple-300 mb-2">Long-term (18+ months)</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• International expansion</li>
                <li>• AI-powered personalization</li>
                <li>• Strategic partnerships</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWOTAnalysisView;