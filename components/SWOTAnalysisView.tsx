import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, Legend, AreaChart, Area } from 'recharts';

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
      { name: 'Điện máy', products: 142589, avgRating: 4.1, avgPrice: 299.99, reviews: 4251789, id: 'electronics' },
      { name: 'Nội thất & nhà bếp', products: 89234, avgRating: 4.3, avgPrice: 67.45, reviews: 2983467, id: 'home-kitchen' },
      { name: 'Sách', products: 76891, avgRating: 4.4, avgPrice: 15.99, reviews: 1876234, id: 'books' },
      { name: 'Thời trang', products: 65432, avgRating: 3.9, avgPrice: 45.99, reviews: 2134567, id: 'fashion' },
      { name: 'Thể thao', products: 54321, avgRating: 4.2, avgPrice: 89.99, reviews: 1567890, id: 'sports' },
      { name: 'Chăm sóc cá nhân', products: 43210, avgRating: 4.0, avgPrice: 32.99, reviews: 1234567, id: 'beauty' }
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
    { stars: 5, count: 1892, percentage: 45.2, label: 'Xuất sắc', id: 'excellent' },
    { stars: 4, count: 1345, percentage: 32.1, label: 'Tốt', id: 'good' },
    { stars: 3, count: 578, percentage: 13.8, label: 'Trung bình', id: 'average' },
    { stars: 2, count: 234, percentage: 5.6, label: 'Kém', id: 'poor' },
    { stars: 1, count: 138, percentage: 3.3, label: 'Rất kém', id: 'very-poor' }
  ];

  // Keywords analysis data
  const keywordsData = [
    { keyword: 'dễ sử dụng', frequency: 847, sentiment: 'Tích cực', impact: 'Cao', id: 'easy-to-use' },
    { keyword: 'giao hàng nhanh', frequency: 723, sentiment: 'Tích cực', impact: 'Cao', id: 'fast-delivery' },
    { keyword: 'đắt đỏ', frequency: 445, sentiment: 'Tiêu cực', impact: 'Trung bình', id: 'expensive' },
    { keyword: 'phản hồi chậm', frequency: 198, sentiment: 'Tiêu cực', impact: 'Cao', id: 'slow-response' },
    { keyword: 'đề xuất', frequency: 489, sentiment: 'Tích cực', impact: 'Cao', id: 'recommend' }
  ];

  // AFI (Areas for Improvement) triggers
  const afiTriggers = [
    { 
      area: 'Thời gian phản hồi', 
      currentScore: 3.2, 
      target: 4.5, 
      priority: 'Cao',
      action: 'Triển khai phản hồi tự động cho các câu hỏi thường gặp',
      id: 'response-time'
    },
    { 
      area: 'Khám phá sản phẩm', 
      currentScore: 3.8, 
      target: 4.2, 
      priority: 'Trung bình',
      action: 'Cải thiện thuật toán tìm kiếm và công cụ đề xuất',
      id: 'product-discovery'
    },
    { 
      area: 'Quy trình thanh toán', 
      currentScore: 4.1, 
      target: 4.6, 
      priority: 'Cao',
      action: 'Đơn giản hóa luồng thanh toán và thêm tùy chọn thanh toán không cần tài khoản',
      id: 'checkout-process'
    },
    { 
      area: 'Trải nghiệm di động', 
      currentScore: 3.9, 
      target: 4.4, 
      priority: 'Trung bình',
      action: 'Tối ưu hiệu năng và giao diện ứng dụng di động',
      id: 'mobile-experience'
    }
  ];

  // Top performing agents data
  const topAgents = [
    { name: 'Phạm Yến Vy', calls: 47, resolution: 94, satisfaction: 4.8, availability: 98, id: 'vy-py' },
    { name: 'Lê Minh Hoàng', calls: 52, resolution: 91, satisfaction: 4.7, availability: 96, id: 'hoang-lm' },
    { name: 'Trần Đức Dương', calls: 43, resolution: 89, satisfaction: 4.6, availability: 94, id: 'duong-td' },
    { name: 'Đặng Trung Thắng', calls: 39, resolution: 87, satisfaction: 4.5, availability: 92, id: 'thang-dt' },
    { name: 'Nguyễn Khánh Linh', calls: 41, resolution: 93, satisfaction: 4.7, availability: 95, id: 'linh-nk' }
  ];

  // Call Categories data for analytics
  const callCategoriesData = [
    { category: 'Hỗ trợ kỹ thuật', calls: 892, percentage: 31, id: 'tech-support' },
    { category: 'Thắc mắc thanh toán', calls: 654, percentage: 23, id: 'billing' },
    { category: 'Thông tin sản phẩm', calls: 487, percentage: 17, id: 'product-info' },
    { category: 'Trạng thái đơn hàng', calls: 398, percentage: 14, id: 'order-status' },
    { category: 'Đổi trả/ hoàn tiền', calls: 289, percentage: 10, id: 'returns' },
    { category: 'Khiếu nại', calls: 127, percentage: 5, id: 'complaints' }
  ];

  // Positive trends for sustainable goals
  const positiveGoals = [
    {
      goal: 'Tỷ lệ giữ chân khách hàng',
      current: 84.2,
      target: 90.0,
      trend: '+5.3% YoY',
      sustainability: 'Sáng kiến xanh: Bao bì thân thiện với môi trường'
    },
    {
      goal: 'Mức độ hài lòng nhân viên',
      current: 87.8,
      target: 92.0,
      trend: '+8.1% YoY',
      sustainability: 'Làm việc từ xa linh hoạt và hỗ trợ sức khỏe tinh thần'
    },
    {
      goal: 'Giảm lượng khí thải carbon',
      current: 23.4,
      target: 40.0,
      trend: 'Giảm +12.8%',
      sustainability: 'Năng lượng tái tạo và nguồn cung bền vững'
    }
  ];

  // Store-wise sales data for ticker
  const storeWiseSales = [
    { store: 'Hà Nội', sales: 15420, growth: '+12%', id: 'hanoi' },
    { store: 'TP.HCM', sales: 18750, growth: '+8%', id: 'hcmc' },
    { store: 'Online', sales: 45890, growth: '+25%', id: 'online' },
    { store: 'Đà Lạt', sales: 12340, growth: '+5%', id: 'dalat' }
  ];

  // Ticker alerts system
  const tickerAlerts = [
    '🎉 Đạt mốc 500 lượt truy cập! Kích hoạt ưu đãi chào mừng.',
    '💰 Đơn hàng lớn: Khách Premium vừa mua $1,247!',
    '📈 Cửa hàng tại Hà Nội: $2,450 trong 1 giờ vừa qua (+15% so với hôm qua)',
    '🔥 Flash sale: 234 sản phẩm đã bán trong 60 phút qua',
    '⭐ Đánh giá 5 sao mới: "Dịch vụ khách hàng xuất sắc!"',
    '📈 Cửa hàng tại TP.HCM: $3,120 doanh thu theo giờ',
    '🚀 Tỷ lệ chuyển đổi đạt đến 6.2% trong 1 giờ qua',
    '💰 Đơn hàng lớn: Khách doanh nghiệp mua $1,890'
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
    { goal: 'Tăng tỷ lệ chuyển đổi', current: 4.1, target: 6.0, progress: 68, id: 'conversion-rate' },
    { goal: 'Doanh số hàng tháng', current: 418, target: 600, progress: 70, id: 'sales-volume' },
    { goal: 'Mức độ hài lòng của khách hàng', current: 87.3, target: 95.0, progress: 92, id: 'customer-satisfaction' },
    { goal: 'Giá trị đơn hàng trung bình', current: 127.50, target: 150.00, progress: 85, id: 'order-value' }
  ];

  const productCategories = [
    { name: 'Điện tử', value: 35, color: '#0077b6' },
    { name: 'Thời trang', value: 28, color: '#52b788' },
    { name: 'Nhà & Vườn', value: 22, color: '#f4a261' },
    { name: 'Sách', value: 15, color: '#e63946' }
  ];

  const swotData = {
    strengths: [
      'Thương hiệu mạnh và khách hàng trung thành',
      'Hệ thống phân tích cảm xúc bằng AI tiên tiến',
      'Tích hợp phản hồi khách hàng theo thời gian thực',
      'Điểm hài lòng khách hàng cao (87.3%)',
      'Tỷ lệ chuyển đổi tăng trưởng (+12.5%/tháng)'
    ],
    weaknesses: [
      'Thiếu ứng dụng di động',
      'Chi phí thu hút khách hàng cao',
      'Doanh thu biến động theo mùa',
      'Chưa thâm nhập đủ thị trường quốc tế'
    ],
    opportunities: [
      'Mở rộng sang nền tảng thương mại di động',
      'Triển khai công cụ gợi ý cá nhân hóa',
      'Gia nhập các thị trường quốc tế mới nổi',
      'Phát triển dịch vụ theo mô hình đăng ký',
      'Hợp tác với influencer và nhà sáng tạo nội dung'
    ],
    threats: [
      'Cạnh tranh gia tăng từ các sàn thương mại điện tử lớn',
      'Suy thoái kinh tế ảnh hưởng đến chi tiêu người tiêu dùng',
      'Gián đoạn chuỗi cung ứng',
      'Thay đổi quy định về bảo mật dữ liệu',
      'Chi phí quảng cáo kỹ thuật số tăng cao'
    ]
  };

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatPercentage = (value: number) => `${value}%`;

  // Keyword tag style helpers (match LiveAnalysisView styles)
  const getKeywordSentimentClass = (sentiment: string) => {
    switch (sentiment) {
      case 'Tích cực': 
      case 'Cao':
        return 'text-green-500 bg-[#52b788]/10 dark:bg-[#52b788]/30';
      case 'Tiêu cực': 
      case 'Thấp': 
        return 'text-red-500 bg-[#e63946]/10 dark:bg-[#e63946]/30';
      default: return 'text-orange-500 bg-[#f4a261]/10 dark:bg-[#f4a261]/30';
    }
  };

  // Return a blue shade hex based on percentage (higher % => darker blue)
  const getBlueShade = (percent: number) => {
    if (percent >= 30) return '#1e3a8a'; // blue-900
    if (percent >= 20) return '#1d4ed8'; // blue-700
    if (percent >= 15) return '#3b82f6'; // blue-500
    if (percent >= 10) return '#60a5fa'; // blue-400
    return '#93c5fd'; // blue-300
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Moving Ticker Alerts */}
        <div className="mb-6 bg-gradient-to-r from-[#aca8ff] to-[#668aff] text-white p-3 rounded-lg shadow-md flex items-center">
          <span className="bg-white text-blue-800 px-2 py-1 rounded text-sm font-semibold mr-4">LIVE</span>
          <div className="overflow-hidden flex-1">
            <div className="marquee whitespace-nowrap">
              <span className="text-lg font-medium text-white">{currentAlert}</span>
            </div>
          </div>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-8">
          Dashboard phân tích kinh doanh
        </h1>

        {/* KPI Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Lượt đăng nhập</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {kpiMetrics.loginMetrics.currentYear.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
              +{formatPercentage(kpiMetrics.loginMetrics.growth)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">so với cùng kỳ năm ngoái</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Cuộc gọi hiệu quả</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {kpiMetrics.productiveCalls.currentYear.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
              +{formatPercentage(kpiMetrics.productiveCalls.growth)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">so với cùng kỳ năm ngoái</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Lượt đánh giá</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {kpiMetrics.productMetrics.reviewed.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
              {formatPercentage(kpiMetrics.productMetrics.conversionFromReview)} chuyển đổi
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">từ đánh giá sang đơn hàng</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tỷ lệ chuyển đổi</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {formatPercentage(kpiMetrics.conversionRate)}
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
              +{formatPercentage(kpiMetrics.monthlyGrowth)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">so với tháng trước</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Tổng đơn hàng</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {kpiMetrics.totalPurchases.toLocaleString()}
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
              {kpiMetrics.productMetrics.ordered.toLocaleString()} đã đặt
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">6 tháng gần nhất</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Doanh thu</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {formatCurrency(kpiMetrics.revenue)}
            </p>
            <p className="mt-1 text-sm text-green-600 dark:text-green-400 font-medium">
              +{formatPercentage(kpiMetrics.monthlyGrowth)}
            </p>
            <p className="text-xs text-gray-600 dark:text-gray-400">tính từ đầu năm</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Giá trị trung bình đơn</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {formatCurrency(kpiMetrics.avgOrderValue)}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">mỗi giao dịch</p>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md p-6">
            <h3 className="text-md font-semibold text-gray-900 dark:text-white mb-2">Mức độ hài lòng</h3>
            <p className="text-3xl font-bold text-blue-500 dark:text-sky-400">
              {formatPercentage(kpiMetrics.customerSatisfaction)}
            </p>
            <p className="mt-1 text-xs text-gray-600 dark:text-gray-400">phân tích cảm xúc khách hàng</p>
          </div>
        </div>

        {/* Seasonality Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Thống kê theo tháng</h3>
            <ResponsiveContainer width="95%" height={350}>
              <AreaChart data={seasonalityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="gray" opacity={0.3}/>
                <XAxis dataKey="month" stroke="gray" tick={{ fontSize: 13 }} />
                <YAxis stroke="gray" tick={{ fontSize: 13 }} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#0A2540', 
                    border: 'none',
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} 
                />
                <Area type="monotone" dataKey="logins" stackId="1" stroke="#668aff" fill="#668aff" fillOpacity={0.3} />
                <Area type="monotone" dataKey="calls" stackId="2" stroke="#668aff" fill="#668aff" fillOpacity={0.3} />
                <Area type="monotone" dataKey="sales" stackId="3" stroke="#668aff" fill="#668aff" fillOpacity={0.9} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Hiệu suất theo cửa hàng</h3>
            <div className="space-y-4">
              {storeWiseSales.map((store) => (
                <div key={`store-${store.id}`} className="flex justify-between items-center p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-white">{store.store}</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Trung bình theo giờ</p>
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
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Mục tiêu tương lai</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {futureGoals.map((goal) => (
              <div key={`goal-${goal.id}`} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{goal.goal}</h4>
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-2">
                  <span>Hiện tại: {typeof goal.current === 'number' && goal.current > 100 ? goal.current.toLocaleString() : goal.current}</span>
                  <span>Mục tiêu: {typeof goal.target === 'number' && goal.target > 100 ? goal.target.toLocaleString() : goal.target}</span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                  <div 
                    className="bg-blue-500 dark:bg-sky-400 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${goal.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{goal.progress}% hoàn thành</p>
              </div>
            ))}
          </div>
        </div>

        {/* Survey Results (1-5 Stars) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Kết quả khảo sát khách hàng</h3>
            <div className="space-y-4">
              {surveyResults.map((result) => (
                <div key={`survey-${result.id}`} className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="flex shrink-0">
                      {[...Array(5)].map((_, i) => (
                        <span 
                          key={`star-${result.label}-${i}`} 
                          className={`text-lg ${i < result.stars ? 'text-yellow-500' : 'text-gray-300'}`}
                        >
                          ★
                        </span>
                      ))}
                    </div>
                    <div className="flex-1 min-w-0 bg-slate-200 dark:bg-slate-600 rounded-full h-2">
                      <div 
                        className="bg-blue-500 dark:bg-sky-400 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${result.percentage}%` }}
                      ></div>
                    </div>
                    <span className="shrink-0 w-12 text-sm font-semibold text-gray-900 dark:text-white text-right">
                      {result.count} ({result.percentage}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Keywords Analysis */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân tích từ khóa</h3>
            <div className="space-y-3">
              {keywordsData.map((keyword) => (
                <div key={`keyword-${keyword.id}`} className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <span className="font-medium text-gray-900 dark:text-white">{keyword.keyword}</span>
                    <div className="flex items-center mt-1">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getKeywordSentimentClass(keyword.sentiment)}`}>
                        {keyword.sentiment}
                      </span>
                      <span className={`ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getKeywordSentimentClass(keyword.impact)}`}>
                        Tác động: {keyword.impact}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">{keyword.frequency}</span>
                    <p className="text-xs text-gray-500 dark:text-gray-400">lượt đề cập</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AFI Triggers and Positive Goals */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* AFI (Areas for Improvement) Triggers */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Điểm kích hoạt chiến lược AFI</h3>
            <div className="space-y-4">
              {afiTriggers.map((afi) => (
                <div key={`afi-${afi.id}`} className="p-4 border-l-4 border-orange-400 bg-[#f4a261]/10 dark:bg-[#f4a261]/30 rounded-r-lg">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{afi.area}</h4>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getKeywordSentimentClass(afi.priority)}}`}>
                      Ưu tiên: {afi.priority}
                    </span>
                  </div>
                  <div className="mb-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Hiện tại: {afi.currentScore}/5</span>
                      <span className="text-gray-600 dark:text-gray-400">Mục tiêu: {afi.target}/5</span>
                    </div>
                    <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mt-1">
                      <div 
                        className="bg-orange-400 h-2 rounded-full" 
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
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Tiến độ mục tiêu bền vững</h3>
            <div className="space-y-4">
              {positiveGoals.map((goal) => (
                <div key={`positive-goal-${goal.goal.toLowerCase().replace(/\s+/g, '-')}`} className="p-4 border-l-4 border-green-500 bg-[#52b788]/10 dark:bg-[#52b788]/30 rounded-r-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{goal.goal}</h4>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Hiện tại: {goal.current}% | Mục tiêu: {goal.target}%
                    </span>
                    <span className="text-sm font-medium text-green-600 dark:text-green-400">{goal.trend}</span>
                  </div>
                  <div className="w-full bg-slate-200 dark:bg-slate-600 rounded-full h-2 mb-2">
                    <div 
                      className="bg-green-500 dark:bg-green-400 h-2 rounded-full transition-all duration-300" 
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
            Bảng điều khiển phân tích trung tâm cuộc gọi
          </h2>

          {/* Call Center KPI Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Cuộc gọi hôm nay</h3>
                <p className="text-3xl font-bold dark:text-sky-400">2,847</p>
                <p className="text-sm">↑ 12% so với hôm qua</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Thời gian xử lý TB</h3>
                <p className="text-3xl font-bold dark:text-sky-400">4:32</p>
                <p className="text-sm">Cải thiện 8%</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Xử lý ngay lần đầu</h3>
                <p className="text-3xl font-bold dark:text-sky-400">89.3%</p>
                <p className="text-sm">Mục tiêu: 85%</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Mức độ hài lòng</h3>
                <p className="text-3xl font-bold dark:text-sky-400">4.6/5</p>
                <p className="text-sm">Từ 1,234 khách hàng</p>
              </div>
            </div>
          </div>

          {/* Call Center Performance Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Hourly Call Volume */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Lượng cuộc gọi theo giờ hôm nay</h3>
              <ResponsiveContainer width="100%" height={400}>
                <LineChart data={[
                  { hour: '9h', calls: 89, resolved: 78, abandoned: 8 },
                  { hour: '10h', calls: 145, resolved: 132, abandoned: 6 },
                  { hour: '11h', calls: 234, resolved: 209, abandoned: 12 },
                  { hour: '12h', calls: 298, resolved: 267, abandoned: 18 },
                  { hour: '13h', calls: 187, resolved: 171, abandoned: 9 },
                  { hour: '14h', calls: 256, resolved: 231, abandoned: 14 },
                  { hour: '15h', calls: 312, resolved: 284, abandoned: 16 },
                  { hour: '16h', calls: 289, resolved: 261, abandoned: 15 },
                  { hour: '17h', calls: 198, resolved: 179, abandoned: 11 }
                ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="hour" />
                  <YAxis />
                  <Tooltip 
                    contentStyle={{ 
                    backgroundColor: '#0A2540', 
                    border: 'none', 
                    borderRadius: '0.5rem',
                    color: 'white'
                  }} />
                  <Line type="monotone" dataKey="calls" stroke="#3b82f6" strokeWidth={3} name="Tổng cuộc gọi" />
                  <Line type="monotone" dataKey="resolved" stroke="#22c55e" strokeWidth={2} name="Đã giải quyết" />
                  <Line type="monotone" dataKey="abandoned" stroke="#ef4444" strokeWidth={2} name="Đã từ bỏ" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Agent Performance */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Nhân viên xuất sắc nhất</h3>
              <div className="space-y-4">
                {topAgents.map((agent, index) => (
                  <div key={`agent-${agent.id}-${index}`} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{agent.name}</h4>
                      <div
                        className="grid gap-2 mt-2 text-sm text-gray-600 dark:text-gray-300"
                        style={{ gridTemplateColumns: '1fr 0.8fr 0.8fr 1.4fr' }}
                      >
                        <span>Cuộc gọi: {agent.calls}</span>
                        <span>FCR: {agent.resolution}%</span>
                        <span>CSAT: {agent.satisfaction}</span>
                        <span>Sẵn sàng: {agent.availability}%</span>
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
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân loại cuộc gọi hôm nay</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={callCategoriesData}
                    cx="50%"
                    cy="50%"
                    nameKey="category"
                    labelLine={false}
                    label={(entry) => `${entry.category}: ${entry.percentage}%`}
                    outerRadius={100}
                    dataKey="calls"
                  >
                    {callCategoriesData.map((entry, index) => (
                      <Cell key={`cell-${entry.id}-${index}`} fill={getBlueShade(entry.percentage)} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Real-time Sentiment Analysis */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân tích cảm xúc trực tiếp</h3>
              <div className="space-y-4">
                <div className={`flex items-center justify-between p-3 rounded-lg ${getKeywordSentimentClass('Tích cực')}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">😊</span>
                    <div>
                      <p className="font-semibold">Tích cực</p>
                      <p className="text-sm">Khách hàng hài lòng</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">68.4%</p>
                    <p className="text-sm">1,947 cuộc gọi</p>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${getKeywordSentimentClass('Trung tính')}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">😐</span>
                    <div>
                      <p className="font-semibold">Trung lập</p>
                      <p className="text-sm">Yêu cầu thông thường</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">19.3%</p>
                    <p className="text-sm">549 cuộc gọi</p>
                  </div>
                </div>

                <div className={`flex items-center justify-between p-3 rounded-lg ${getKeywordSentimentClass('Tiêu cực')}`}>
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">😠</span>
                    <div>
                      <p className="font-semibold">Tiêu cực</p>
                      <p className="text-sm">Sự cố & khiếu nại</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">12.3%</p>
                    <p className="text-sm">351 cuộc gọi</p>
                  </div>
                </div>
              </div>


            </div>
          </div>

          {/* Queue Management & Wait Times */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Trạng thái hàng đợi</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Cuộc gọi chờ:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">23</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Thời gian chờ TB:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">2:14</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Chờ lâu nhất:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">5:47</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tình trạng nhân viên</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Sẵn sàng:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">18</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Đang gọi:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">32</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Đang nghỉ:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">7</span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tuân thủ SLA</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Tỷ lệ trả lời:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">94.2%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Trả lời nhanh:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">87.6%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-300">Tỷ lệ từ bỏ:</span>
                  <span className="text-2xl font-bold text-blue-500 dark:text-sky-400">3.1%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Amazon Dataset Business Intelligence Section */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
            Phân tích dữ liệu thị trường Amazon
          </h2>

          {/* Amazon Overview Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Tổng sản phẩm</h3>
                <p className="text-3xl font-bold dark:text-sky-400">{amazonDataset.overview.totalProducts.toLocaleString()}</p>
                <p className="text-sm text-blue-900/80 dark:text-white/80">Trên {amazonDataset.overview.activeCategories} danh mục</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Đánh giá trung bình</h3>
                <p className="text-3xl font-bold dark:text-sky-400">{amazonDataset.overview.avgRating} ⭐</p>
                <p className="text-sm text-blue-900/80 dark:text-white/80">{amazonDataset.overview.totalReviews.toLocaleString()} lượt</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Giá trung bình</h3>
                <p className="text-3xl font-bold dark:text-sky-400">${amazonDataset.overview.priceRange.avg}</p>
                <p className="text-sm text-blue-900/80 dark:text-white/80">Khoảng: ${amazonDataset.overview.priceRange.min} - ${amazonDataset.overview.priceRange.max.toLocaleString()}</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-[#aca8ff]/30 to-[#668aff]/30 text-blue-900 dark:text-white p-6 rounded-lg shadow-md">
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Vị trí thị trường</h3>
                <p className="text-3xl font-bold dark:text-sky-400">{amazonDataset.competitorInsights.marketShare}%</p>
                <p className="text-sm text-blue-900/80 dark:text-white/80">Dẫn đầu thị phần</p>
              </div>
            </div>
          </div>

          {/* Amazon Analytics Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Top Categories Chart */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 text-blue-600 dark:text-sky-400">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Danh mục sản phẩm hàng đầu</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={amazonDataset.topCategories}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip formatter={(value) => [value.toLocaleString(), 'Sản phẩm']} />
                  <Bar dataKey="products" fill="currentColor" />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Price Distribution */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân bố giá</h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={amazonDataset.priceDistribution}
                    cx="50%"
                    cy="50%"
                    nameKey="range"
                    labelLine={false}
                    label={(entry) => `${entry.range}: ${entry.percentage}%`}
                    outerRadius={100}
                    dataKey="count"
                  >
                    {amazonDataset.priceDistribution.map((entry) => (
                      <Cell key={`price-cell-${entry.id}`} fill={getBlueShade(entry.percentage)} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amazon Sentiment Analysis & Competitor Comparison */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Sentiment Analysis */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân tích cảm xúc khách hàng</h3>
              <div className="space-y-4">
                {/* Tích cực */}
                <div className="p-3 rounded-lg bg-[#52b788]/10 dark:bg-[#52b788]/30 border border-[#52b788]/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-green-500 font-semibold">Tích cực</span>
                    <span className="text-2xl font-bold text-green-500">{amazonDataset.sentimentAnalysis.positive}%</span>
                  </div>
                  <div className="w-full bg-[#52b788]/20 dark:bg-[#52b788]/20 rounded-full h-3">
                    <div className="bg-[#52b788] h-3 rounded-full" style={{ width: `${amazonDataset.sentimentAnalysis.positive}%` }}></div>
                  </div>
                </div>

                {/* Trung lập */}
                <div className="p-3 rounded-lg bg-[#f4a261]/10 dark:bg-[#f4a261]/30 border border-[#f4a261]/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-orange-500 font-semibold">Trung lập</span>
                    <span className="text-2xl font-bold text-orange-500">{amazonDataset.sentimentAnalysis.neutral}%</span>
                  </div>
                  <div className="w-full bg-[#f4a261]/20 dark:bg-[#f4a261]/20 rounded-full h-3">
                    <div className="bg-[#f4a261] h-3 rounded-full" style={{ width: `${amazonDataset.sentimentAnalysis.neutral}%` }}></div>
                  </div>
                </div>

                {/* Tiêu cực */}
                <div className="p-3 rounded-lg bg-[#e63946]/10 dark:bg-[#e63946]/30 border border-[#e63946]/30">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-500 font-semibold">Tiêu cực</span>
                    <span className="text-2xl font-bold text-red-500">{amazonDataset.sentimentAnalysis.negative}%</span>
                  </div>
                  <div className="w-full bg-[#e63946]/20 dark:bg-[#e63946]/20 rounded-full h-3">
                    <div className="bg-[#e63946] h-3 rounded-full" style={{ width: `${amazonDataset.sentimentAnalysis.negative}%` }}></div>
                  </div>
                </div>
                
                <div className="mt-4 p-4 bg-white dark:bg-[#0A2540]/80 rounded-lg">
                  <p className="text-sm text-[#0A2540] dark:text-sky-400">
                    <strong>Xu hướng hàng tháng:</strong> +{amazonDataset.sentimentAnalysis.monthlyTrend}% cải thiện cảm xúc tích cực
                  </p>
                </div>
              </div>
            </div>

            {/* Competitor Analysis */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân tích cạnh tranh</h3>
              <ResponsiveContainer width="100%" height={280}>
                <BarChart data={amazonDataset.competitorInsights.competitorComparison} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="competitor" angle={-45} textAnchor="end" height={60} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="marketShare" fill="#3b82f6" name="Thị phần %" />
                  <Bar dataKey="rating" fill="#1e3a8a" name="Đánh giá" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Amazon Category Performance Table */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Phân tích hiệu suất danh mục</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full table-auto">
                <thead>
                  <tr className="bg-blue-50 dark:bg-blue-900/20 border-b-2 border-[#0077b6]/30">
                    <th className="px-4 py-3 text-left text-blue-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-wide">Danh mục</th>
                    <th className="px-4 py-3 text-left text-blue-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-wide">Sản phẩm</th>
                    <th className="px-4 py-3 text-left text-blue-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-wide">Đánh giá TB</th>
                    <th className="px-4 py-3 text-left text-blue-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-wide">Giá TB</th>
                    <th className="px-4 py-3 text-left text-blue-600 dark:text-sky-400 font-semibold text-sm uppercase tracking-wide">Tổng đánh giá</th>
                  </tr>
                </thead>
                <tbody>
                  {amazonDataset.topCategories.map((category, index) => {
                    const ratingColor = category.avgRating >= 4.0 ? 'text-green-600 dark:text-green-400' : category.avgRating >= 3.0 ? 'text-orange-500' : 'text-red-500';
                    return (
                      <tr
                        key={`amazon-category-${category.id}`}
                        className={`border-b border-gray-100 dark:border-gray-700 transition-colors duration-150 hover:bg-[#0077b6]/5 dark:hover:bg-[#0077b6]/10 ${index % 2 === 0 ? 'bg-white dark:bg-slate-800' : 'bg-slate-50/60 dark:bg-slate-700/30'}`}
                      >
                        <td className="px-4 py-3 font-semibold text-gray-900 dark:text-white">{category.name}</td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{category.products.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`font-semibold ${ratingColor}`}>
                            {category.avgRating.toFixed(1)} ⭐
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded-md bg-[#52b788]/10 dark:bg-[#52b788]/30 text-green-700 dark:text-green-400 font-semibold text-sm">
                            ${category.avgPrice}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 dark:text-gray-300">{category.reviews.toLocaleString()}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>


        {/* SWOT Analysis Section */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center">
          Phân tích SWOT
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Strengths */}
          <div className="bg-[#52b788]/10 dark:bg-[#52b788]/30 p-6 rounded-lg border border-[#52b788]/40 dark:border-[#52b788]/50">
            <h2 className="text-xl font-bold text-green-600 dark:text-green-400 mb-4">Điểm mạnh (Strengths - S)</h2>
            <ul className="space-y-2">
              {swotData.strengths.map((item, index) => (
                <li key={`strength-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-green-900 dark:text-green-100 flex items-start">
                  <span className="mr-2 mt-0.5">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Weaknesses */}
          <div className="bg-[#e63946]/10 dark:bg-[#e63946]/30 p-6 rounded-lg border border-[#e63946]/40 dark:border-[#e63946]/50">
            <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-4">Điểm yếu (Weaknesses - W)</h2>
            <ul className="space-y-2">
              {swotData.weaknesses.map((item, index) => (
                <li key={`weakness-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-red-900 dark:text-red-100 flex items-start">
                  <span className="mr-2 mt-0.5">−</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Opportunities */}
          <div className="bg-blue-50 dark:bg-sky-900/30 p-6 rounded-lg border border-[#0077b6]/40 dark:border-[#0077b6]/50">
            <h2 className="text-xl font-bold text-blue-600 dark:text-sky-400 mb-4">Cơ hội (Opportunities - O)</h2>
            <ul className="space-y-2">
              {swotData.opportunities.map((item, index) => (
                <li key={`opportunity-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-blue-900 dark:text-sky-100 flex items-start">
                  <span className="mr-2 mt-0.5">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Threats */}
          <div className="bg-[#f4a261]/10 dark:bg-[#f4a261]/30 p-6 rounded-lg border border-[#f4a261]/40 dark:border-[#f4a261]/50">
            <h2 className="text-xl font-bold text-orange-500 dark:text-orange-400 mb-4">Thách thức (Threats - T)</h2>
            <ul className="space-y-2">
              {swotData.threats.map((item, index) => (
                <li key={`threat-${index}-${item.slice(0, 20).replace(/\s+/g, '-')}`} className="text-orange-900 dark:text-orange-100 flex items-start">
                  <span className="mr-2 mt-0.5">!</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Strategic Recommendations */}
        <div className="mt-8 bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Đề xuất chiến lược</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg ">
              <h4 className="font-semibold text-blue-600 dark:text-sky-400 mb-2">Ngắn hạn (0–6 tháng)</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Tối ưu trải nghiệm di động</li>
                <li>• Triển khai A/B testing để tăng chuyển đổi</li>
                <li>• Nâng cao chất lượng hỗ trợ khách hàng</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg ">
              <h4 className="font-semibold text-blue-600 dark:text-sky-400 mb-2">Trung hạn (6–18 tháng)</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Ra mắt ứng dụng di động</li>
                <li>• Mở rộng danh mục sản phẩm</li>
                <li>• Triển khai mô hình đăng ký</li>
              </ul>
            </div>
            <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg ">
              <h4 className="font-semibold text-blue-600 dark:text-sky-400 mb-2">Dài hạn (18+ tháng)</h4>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                <li>• Mở rộng ra thị trường quốc tế</li>
                <li>• Cá nhân hóa bằng AI</li>
                <li>• Xây dựng quan hệ đối tác chiến lược</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SWOTAnalysisView;