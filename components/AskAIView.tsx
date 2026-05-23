import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// Define interfaces for the real business data
interface DashboardKPIs {
  activeCalls: number;
  avgSentiment: number;
  totalLogins: number;
  productsReviewed: number;
  callsGrowth: number;
  sentimentGrowth: number;
  loginsGrowth: number;
  reviewsPercentage: number;
}

interface FeedbackData {
  text: string;
  emotion: string;
  source: string;
  timestamp: string;
  userId: string;
}

interface FrustrationDriver {
  name: string;
  value: number;
  percentage: number;
}

interface SentimentTrend {
  name: string;
  sentiment: number;
  calls: number;
}

interface BusinessData {
  kpis: DashboardKPIs;
  recentFeedback: FeedbackData[];
  frustrationDrivers: FrustrationDriver[];
  sentimentTrend: SentimentTrend[];
}

const AskAIView: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [conversation, setConversation] = useState<Array<{role: 'user' | 'assistant', content: string, metadata?: any}>>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [businessData, setBusinessData] = useState<BusinessData | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll khi có tin nhắn mới hoặc đang loading
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isLoading]);

  // Fetch real business data on component mount
  useEffect(() => {
    const fetchBusinessData = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/dashboard/overview');
        if (response.ok) {
          const result = await response.json();
          setBusinessData(result.data);
        }
      } catch (error) {
        console.error('Failed to fetch business data:', error);
      }
    };

    fetchBusinessData();
    // Refresh data every 30 seconds
    const interval = setInterval(fetchBusinessData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    const userMessage = { role: 'user' as const, content: question };
    setConversation(prev => [...prev, userMessage]);
    setQuestion('');
    setIsLoading(true);

    try {
      const messages = [
        ...conversation.map(msg => ({ role: msg.role, content: msg.content })),
        { role: 'user', content: question }
      ];

      const response = await fetch('http://localhost:3001/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          messages,
          businessData
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const assistantMessage = { 
        role: 'assistant' as const, 
        content: data.response,
        metadata: {
          openAIUsed: true,
          businessDataProvided: true,
          timestamp: new Date().toISOString(),
          dataSource: 'openai_with_business_context'
        }
      };
      
      setConversation(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    } catch (error: any) {
      console.error('Error getting AI response:', error);
      
      if (error.response?.status === 503 && error.response?.data?.fallback) {
        const configErrorMessage = { 
          role: 'assistant' as const, 
          content: `🔧 **Cần thiết lập thêm**: ${error.response.data.fallback.response}\n\n📋 **Các bước thiết lập nhanh:**\n1. Sao chép \`backend/.env.example\` thành \`backend/.env\`\n2. Thêm API key của bạn (lấy tại platform.openai.com)\n3. Khởi động lại máy chủ backend\n\n💡 Xem README.md để biết hướng dẫn chi tiết!`,
          metadata: {
            configurationError: true,
            timestamp: new Date().toISOString()
          }
        };
        setConversation(prev => [...prev, configErrorMessage]);
        setIsLoading(false);
        return;
      }
      
      try {
        const fallbackResponse = await generateDataDrivenResponse(question, businessData);
        const assistantMessage = { 
          role: 'assistant' as const, 
          content: `⚠️ Dịch vụ AI tạm thời không khả dụng. Đang sử dụng phân tích nội bộ:\n\n${fallbackResponse}`,
          metadata: {
            fallbackUsed: true,
            businessDataUsed: true,
            timestamp: new Date().toISOString()
          }
        };
        setConversation(prev => [...prev, assistantMessage]);
      } catch (fallbackError) {
        const errorMessage = { 
          role: 'assistant' as const, 
          content: "Xin lỗi, cả hai dịch vụ AI đều tạm thời không khả dụng. Vui lòng thử lại sau! 🤖"
        };
        setConversation(prev => [...prev, errorMessage]);
      }
      
      setIsLoading(false);
    }
  };

  const generateDataDrivenResponse = async (question: string, data: BusinessData | null): Promise<string> => {
    if (!data) {
      return "Xin chào! 👋 Tôi là CSCopilot, trợ lý phân tích kinh doanh của bạn. Có vẻ như tôi chưa truy cập được dữ liệu thời gian thực lúc này, nhưng tôi vẫn sẵn sàng hỗ trợ! Hãy hỏi tôi về trải nghiệm khách hàng, phân tích chỉ số hoặc cải thiện kinh doanh nhé. Bạn muốn khám phá điều gì?";
    }

    const lowerQuestion = question.toLowerCase();
    const { kpis, recentFeedback, frustrationDrivers, sentimentTrend } = data;
    
    const avgWeekSentiment = sentimentTrend.reduce((sum, day) => sum + day.sentiment, 0) / sentimentTrend.length;
    const totalWeekCalls = sentimentTrend.reduce((sum, day) => sum + day.calls, 0);
    const topFrustration = frustrationDrivers[0];
    const recentPositiveFeedback = recentFeedback.filter(f => ['Delight', 'Satisfaction'].includes(f.emotion));
    const recentNegativeFeedback = recentFeedback.filter(f => ['Anger', 'Frustration'].includes(f.emotion));

    const greetings = ['xin chào', 'chào', 'hello', 'hi', 'hey', 'bạn khỏe không'];
    const isGreeting = greetings.some(greeting => lowerQuestion.includes(greeting));
    
    const personalityResponses = [
      "Xin chào! 🚀 Tôi là CSCopilot, rất vui được giúp bạn hiểu rõ hơn về hoạt động kinh doanh!",
      "Chào bạn! 😊 Sẵn sàng cùng nhau khám phá những phân tích kinh doanh thú vị chưa?",
      "Xin chào! 👋 Tôi là trợ lý phân tích AI của bạn. Hôm nay chúng ta sẽ giải quyết bài toán kinh doanh nào đây?",
      "Chào! 🎯 Tôi yêu thích việc giúp doanh nghiệp phát triển. Bạn muốn khám phá dữ liệu nào?",
      "Xin chào! ⚡ Tôi là CSCopilot, rất hào hứng được hỗ trợ bạn phân tích dữ liệu trải nghiệm khách hàng!"
    ];

    if (isGreeting && question.length < 20) {
      const randomGreeting = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
      return `${randomGreeting}\n\n**Tôi có thể giúp bạn:**\n• 📊 Chỉ số kinh doanh và KPI theo thời gian thực\n• 💭 Phân tích Sentiment Score khách hàng\n• 🎯 Đề xuất hành động cải thiện cụ thể\n• 📈 Phân tích xu hướng và gợi ý\n• 🔍 Phân tích chuyên sâu từng mảng kinh doanh\n\nBạn muốn bắt đầu từ đâu?`;
    }

    if (lowerQuestion.includes('chỉ số') || lowerQuestion.includes('hiệu suất') || lowerQuestion.includes('kpi') || lowerQuestion.includes('metric') || lowerQuestion.includes('performance')) {
      return `📊 **Hiệu suất chỉ số kinh doanh hiện tại (DỮ LIỆU THỰC):**

**KPI theo thời gian thực:**
- 🔥 **${kpis.activeCalls} cuộc gọi đang hoạt động** (${kpis.callsGrowth > 0 ? '+' : ''}${kpis.callsGrowth}% so với giờ trước)
- 😊 **Sentiment Score: ${kpis.avgSentiment}/10** (${kpis.sentimentGrowth > 0 ? '+' : ''}${kpis.sentimentGrowth} cải thiện tuần này)  
- 👥 **${kpis.totalLogins.toLocaleString()} lượt đăng nhập** (tăng trưởng ${kpis.loginsGrowth > 0 ? '+' : ''}${kpis.loginsGrowth}%)
- 📝 **${kpis.productsReviewed.toLocaleString()} sản phẩm đã đánh giá** (tỷ lệ hoàn thành ${kpis.reviewsPercentage}%)

**Hiệu suất 7 ngày:**
- 📊 **Sentiment Score trung bình: ${avgWeekSentiment.toFixed(1)}/5** 
- 📞 **Tổng cuộc gọi trong tuần: ${totalWeekCalls}**
- 🎯 **Vấn đề hàng đầu: ${topFrustration.name}** (${topFrustration.percentage}% khiếu nại)

**Xu hướng:** ${kpis.sentimentGrowth > 0 ? 'TÍCH CỰC' : 'CẦN CHÚ Ý'} - Sentiment Score ${kpis.sentimentGrowth > 0 ? 'cải thiện' : 'giảm'} ${Math.abs(kpis.sentimentGrowth)} điểm tuần này.`;
    }

    if (lowerQuestion.includes('sentiment') || lowerQuestion.includes('cảm xúc') || lowerQuestion.includes('cảm nhận')) {
      const bestDay = sentimentTrend.reduce((best, day) => day.sentiment > best.sentiment ? day : best);
      const worstDay = sentimentTrend.reduce((worst, day) => day.sentiment < worst.sentiment ? day : worst);
      
      return `💭 **Phân tích Sentiment Score khách hàng (DỮ LIỆU THỰC):**

**Tổng quan Sentiment Score hiện tại:**
- 📈 **Điểm hiện tại: ${kpis.avgSentiment}/10** (${kpis.sentimentGrowth > 0 ? '+' : ''}${kpis.sentimentGrowth} tuần này)
- 📊 **Trung bình tuần: ${avgWeekSentiment.toFixed(1)}/5**
- 🌟 **Ngày tốt nhất: ${bestDay.name}** (${bestDay.sentiment}/5 với ${bestDay.calls} cuộc gọi)
- 📉 **Ngày thấp nhất: ${worstDay.name}** (${worstDay.sentiment}/5 với ${worstDay.calls} cuộc gọi)

**Phản hồi từ khách hàng trong hôm nay:**
${recentFeedback.map((feedback, i) => 
  `${i + 1}. **${feedback.emotion}** - "${feedback.text}" (${feedback.source})`
).join('\n')}

**Cần xử lý ngay:** Vấn đề ${topFrustration.name} đang gây ra ${topFrustration.percentage}% phản hồi tiêu cực - cần ưu tiên giải quyết.`;
    }

    if (lowerQuestion.includes('phản hồi') || lowerQuestion.includes('khách hàng') || lowerQuestion.includes('feedback') || lowerQuestion.includes('đánh giá')) {
      return `💬 **Phân tích phản hồi từ khách hàng (DỮ LIỆU THỰC):**

**Phản hồi gần đây từ khách hàng:**
${recentFeedback.map(feedback => 
  `- ${feedback.emotion === 'Delight' ? '😍' : feedback.emotion === 'Satisfaction' ? '😊' : feedback.emotion === 'Anger' ? '😤' : '😐'} **"${feedback.text}"** (${feedback.source}, ${new Date(feedback.timestamp).toLocaleTimeString()})`
).join('\n')}

**Thống kê phản hồi:**
- 📋 **Nguồn phản hồi:** Chat, Email, Khảo sát, Mạng xã hội
- 😊 **Phản hồi tích cực:** ${recentPositiveFeedback.length}/${recentFeedback.length} (${Math.round((recentPositiveFeedback.length/recentFeedback.length)*100)}%)
- 😕 **Phản hồi tiêu cực:** ${recentNegativeFeedback.length}/${recentFeedback.length} (${Math.round((recentNegativeFeedback.length/recentFeedback.length)*100)}%)

**Vấn đề theo khối lượng:**
${frustrationDrivers.map((driver, i) => `${i + 1}. **${driver.name}:** ${driver.value} khiếu nại (${driver.percentage}%)`).join('\n')}`;
    }

    if (lowerQuestion.includes('hành động') || lowerQuestion.includes('đề xuất') || lowerQuestion.includes('cải thiện') || lowerQuestion.includes('action') || lowerQuestion.includes('recommend') || lowerQuestion.includes('improve')) {
      const criticalIssues = frustrationDrivers.filter(d => d.percentage > 20);
      
      return `🎯 **Đề xuất hành động dựa trên dữ liệu:**

**Ưu tiên xử lý ngay (dựa trên dữ liệu hiện tại):**
${criticalIssues.map((issue, i) => 
  `${i + 1}. 🚨 **Giải quyết vấn đề ${issue.name}** (${issue.percentage}% phản hồi tiêu cực - ${issue.value} khiếu nại)`
).join('\n')}

**Cơ hội cải thiện:**
- 📈 **Tối ưu Sentiment Score:** Hiện tại ${kpis.avgSentiment}/10 → Mục tiêu 9.0+ (cần cải thiện ${(9.0 - kpis.avgSentiment).toFixed(1)} điểm)
- 📞 **Tối ưu cuộc gọi:** ${kpis.activeCalls} cuộc gọi đang hoạt động → Giảm tải bằng cách cải thiện quy trình xử lý ${topFrustration.name}
- 📝 **Tỷ lệ hoàn thành đánh giá:** Hiện tại ${kpis.reviewsPercentage}% → Mục tiêu 85%+

**Tác động dự kiến:**
- Giải quyết vấn đề ${topFrustration.name} có thể cải thiện Sentiment Score ~0.5 điểm
- Giảm 15% lượng cuộc gọi thông qua xử lý chủ động
- Tăng mức độ hài lòng bằng cách giải quyết 3 Pain Point hàng đầu

**24 giờ tới:** Tập trung vào ${topFrustration.name} (${topFrustration.percentage}% vấn đề) để đạt hiệu quả tối đa.`;
    }

    if (lowerQuestion.includes('xu hướng') || lowerQuestion.includes('trend') || lowerQuestion.includes('phân tích') || lowerQuestion.includes('pattern')) {
      const trendDirection = kpis.sentimentGrowth > 0 ? 'cải thiện' : kpis.sentimentGrowth < 0 ? 'giảm' : 'ổn định';
      const callTrend = kpis.callsGrowth > 0 ? 'tăng' : kpis.callsGrowth < 0 ? 'giảm' : 'ổn định';
      
      return `📈 **Phân tích xu hướng (dựa trên dữ liệu thực):**

**Diễn biến Sentiment Score 7 ngày:**
${sentimentTrend.map(day => `**${day.name}:** ${day.sentiment}/5 (${day.calls} cuộc gọi)`).join('\n')}

**Xu hướng chính:**
- 📊 **Sentiment Score đang ${trendDirection}** (thay đổi ${kpis.sentimentGrowth > 0 ? '+' : ''}${kpis.sentimentGrowth})
- 📞 **Lượng cuộc gọi đang ${callTrend}** (${kpis.callsGrowth > 0 ? '+' : ''}${kpis.callsGrowth}%)
- 👥 **Lượt đăng nhập tăng ${kpis.loginsGrowth}%** (${kpis.totalLogins.toLocaleString()} tổng)

**Nhận định tương quan:**
- Ngày có Sentiment Score cao thường có ít cuộc gọi hơn
- Vấn đề ${topFrustration.name} có xu hướng tăng vào một số ngày nhất định
- Tỷ lệ hoàn thành tương quan với mức độ hài lòng khách hàng

**Dự báo:**
- Nếu xu hướng hiện tại tiếp tục, Sentiment Score dự kiến đạt ${(kpis.avgSentiment + (kpis.sentimentGrowth * 4)).toFixed(1)}/10 tháng tới
- Lượng cuộc gọi có thể ${callTrend === 'tăng' ? 'gây áp lực lên nguồn lực' : 'dần ổn định'} nếu xu hướng này tiếp diễn`;
    }

    const helpRequests = ['giúp', 'hỗ trợ', 'help', 'hướng dẫn', 'bạn làm được gì', 'bạn có thể làm gì'];
    const isHelpRequest = helpRequests.some(term => lowerQuestion.includes(term));
    
    const complimentKeywords = ['tuyệt', 'giỏi', 'hay', 'tốt', 'cảm ơn', 'thank'];
    const isCompliment = complimentKeywords.some(word => lowerQuestion.includes(word));

    if (isCompliment) {
      const appreciationResponses = [
        "Cảm ơn bạn! 😊 Điều đó thật sự truyền cảm hứng cho tôi! Tôi rất thích giúp bạn hiểu rõ hơn về dữ liệu kinh doanh.",
        "Bạn quá khen! 🚀 Tôi chỉ đang làm điều mình yêu thích - biến dữ liệu thành hành động cụ thể!",
        "Cảm ơn bạn! 🎯 Tôi luôn mong muốn góp phần giúp doanh nghiệp phát triển. Còn gì muốn khám phá không?",
        "Thật vui khi được bạn đánh giá cao! ⭐ Tôi được thiết kế để hỗ trợ bạn phát triển kinh doanh hiệu quả hơn.",
        "Cảm ơn! 💪 Tôi luôn hào hứng tìm kiếm các xu hướng trong dữ liệu để tạo ra cải thiện thực sự!"
      ];
      const randomAppreciation = appreciationResponses[Math.floor(Math.random() * appreciationResponses.length)];
      return `${randomAppreciation}\n\n**Snapshot kinh doanh hiện tại:**\n📊 ${kpis.activeCalls} cuộc gọi đang hoạt động, Sentiment Score ${kpis.avgSentiment}/10\n🎯 Vấn đề ưu tiên: ${topFrustration.name} (${topFrustration.percentage}% vấn đề)\n\nBạn muốn tìm hiểu sâu hơn về điều gì?`;
    }

    if (isHelpRequest) {
      return `🎯 **Tôi là CSCopilot - Trợ lý phân tích kinh doanh thông minh của bạn!**

Tôi như người bạn phân tích dữ liệu luôn sẵn sàng hỗ trợ! Đây là những gì tôi có thể làm:

**🔥 Phân tích thời gian thực:**
- Giải thích các chỉ số kinh doanh hiện tại bằng ngôn ngữ đơn giản
- Làm rõ ý nghĩa Sentiment Score ${kpis.avgSentiment}/10 của bạn
- Xác định nguyên nhân của ${kpis.activeCalls} cuộc gọi đang hoạt động

**💡 Nhận định thông minh:**
- Phát hiện xu hướng trước khi chúng trở thành vấn đề (như vấn đề ${topFrustration.name} hiện tại)
- Dự báo hướng phát triển kinh doanh dựa trên xu hướng hiện tại
- Tìm cơ hội tiềm ẩn trong phản hồi khách hàng

**🎬 Đề xuất hành động cụ thể:**
- Chỉ ra chính xác cần ưu tiên xử lý gì để đạt hiệu quả tối đa
- Đề xuất cải thiện cụ thể dựa trên dữ liệu thực
- Hỗ trợ sắp xếp ưu tiên công việc để nâng cao sự hài lòng của khách hàng

**💬 Trao đổi thân thiện:**
- Giải thích dữ liệu phức tạp theo cách dễ hiểu
- Phản hồi linh hoạt theo từng chủ đề bạn quan tâm
- Ghi nhớ ngữ cảnh cuộc trò chuyện để hỗ trợ liên tục

Thử hỏi tôi:
• "Pain Point lớn nhất của khách hàng hiện tại là gì?"
• "Làm thế nào để cải thiện Sentiment Score?"
• "Xu hướng nào tôi cần lưu ý?"
• "Đưa ra 3 hành động cụ thể cần làm hôm nay"

Bạn đang quan tâm nhất đến khía cạnh nào của kinh doanh?`;
    }

    const performanceVariations = [
      {
        condition: kpis.avgSentiment >= 8,
        responses: [
          `🔥 **Doanh nghiệp của bạn đang hoạt động xuất sắc!** Với Sentiment Score ${kpis.avgSentiment}/10, khách hàng đang rất hài lòng!`,
          `⭐ **Wow, Sentiment Score ${kpis.avgSentiment}/10?** Thật ấn tượng! Khách hàng của bạn đang có trải nghiệm tuyệt vời.`,
          `🚀 **Kinh doanh đang trong trạng thái lý tưởng!** Sentiment Score ${kpis.avgSentiment}/10 cho thấy bạn đang làm rất đúng hướng.`
        ]
      },
      {
        condition: kpis.avgSentiment >= 6,
        responses: [
          `📈 **Doanh nghiệp đang hoạt động tốt** với Sentiment Score ${kpis.avgSentiment}/10. Vẫn còn nhiều dư địa để phát triển hơn nữa!`,
          `⚡ **Đà tốt!** Sentiment Score ${kpis.avgSentiment}/10 cho thấy khách hàng khá hài lòng, và tôi thấy nhiều cơ hội để đẩy cao hơn.`,
          `💪 **Hiệu suất ổn định** ở mức ${kpis.avgSentiment}/10! Hãy xác định những gì đang hoạt động tốt và nhân rộng nó.`
        ]
      },
      {
        condition: true,
        responses: [
          `🎯 **Hãy cùng cải thiện!** Sentiment Score ${kpis.avgSentiment}/10 cho thấy còn rất nhiều tiềm năng để khai thác.`,
          `💡 **Cơ hội lớn!** Với Sentiment Score ${kpis.avgSentiment}/10, tôi thấy những con đường rõ ràng để tăng nhanh sự hài lòng của khách hàng.`,
          `🔧 **Đã đến lúc tối ưu!** Sentiment Score ${kpis.avgSentiment}/10 cho tôi biết chính xác cần tập trung vào đâu để đạt hiệu quả cao nhất.`
        ]
      }
    ];

    const matchingVariation = performanceVariations.find(v => v.condition);
    const randomResponse = matchingVariation.responses[Math.floor(Math.random() * matchingVariation.responses.length)];

    return `${randomResponse}

**Tình hình kinh doanh hiện tại:**
- 📞 **${kpis.activeCalls} cuộc gọi đang hoạt động** (${kpis.callsGrowth > 0 ? 'đang tăng' : kpis.callsGrowth < 0 ? 'đang giảm' : 'ổn định'})
- 🎯 **Vấn đề #1:** ${topFrustration.name} - ảnh hưởng ${topFrustration.percentage}% khách hàng
- 👥 **${kpis.totalLogins.toLocaleString()} lượt đăng nhập** với tăng trưởng ${kpis.loginsGrowth > 0 ? '+' : ''}${kpis.loginsGrowth}%

**Tiếng nói khách hàng gần đây:**
${recentFeedback.slice(0, 2).map(f => `💬 "${f.text}" (cảm xúc: ${f.emotion.toLowerCase()})`).join('\n')}

**Tôi có thể giúp bạn:**
- Hiểu ý nghĩa của các con số này với doanh nghiệp
- Tìm các cải thiện nhanh để nâng cao trải nghiệm khách hàng
- Phát hiện xu hướng và quy luật tiềm ẩn
- Đưa ra hành động cụ thể cần thực hiện ngay

Bạn muốn tìm hiểu sâu hơn về khía cạnh nào? 🤓`;
  };

  const sampleQuestions = [
    "Các KPI hiện tại của chúng ta đang như thế nào?",
    "Phân tích Sentiment Score và phản hồi khách hàng hôm nay",
    "Đề xuất hành động dựa trên dữ liệu khiếu nại hiện tại",
    "Cho tôi xem xu hướng hiện tại và phân tích phản hồi khách hàng",
    "Bạn nhận thấy xu hướng gì trong dữ liệu 7 ngày qua?"
  ];

  return (
    <div className="flex flex-col h-[calc(100dvh-112px)] gap-4">

      {/* Live Data Connection Status */}
      <div className={`shrink-0 p-3 rounded-lg border ${businessData ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${businessData ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-sm font-medium ${businessData ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
            {businessData ? 'Đã kết nối với dữ liệu kinh doanh thời gian thực' : 'Đang kết nối với dữ liệu kinh doanh...'}
          </span>
          {businessData && (
            <span className="text-xs text-green-600 dark:text-green-400">
              Cập nhật lúc: {new Date().toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 min-h-0 bg-white dark:bg-slate-800 rounded-lg shadow flex flex-col">
        {/* Conversation Area */}
        <div className="flex-1 min-h-0 px-6 overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-12 h-12 text-blue-500 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Xin chào! Tôi là CSCopilot, trợ lý phân tích dữ liệu thời gian thực của bạn
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                Tôi được kết nối với dữ liệu kinh doanh thực của bạn và có thể phân tích KPI hiện tại, xu hướng Sentiment Score, phản hồi khách hàng, đồng thời đưa ra các gợi ý hành động dựa trên chỉ số hiệu suất thực tế.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(q)}
                    className="p-3 text-left bg-slate-50 dark:bg-slate-700 rounded-lg hover:bg-slate-100 dark:hover:bg-sky-950"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-200">{q}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {conversation.map((message, index) => (
                <div key={index} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-gray-900 dark:text-white'
                  }`}>
                    <div className="whitespace-pre-wrap prose dark:prose-invert">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {message.content}
                      </ReactMarkdown>
                    </div>
                    {message.role === 'assistant' && message.metadata?.businessDataUsed && (
                      <div className="mt-2 flex items-center text-xs text-gray-500 dark:text-gray-400">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        Đang sử dụng dữ liệu kinh doanh thời gian thực
                      </div>
                    )}
                    {message.role === 'assistant' && message.metadata?.sentiment && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        Cảm xúc người dùng: {message.metadata.sentiment.emotion} ({message.metadata.context.confidenceScore}/10)
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-slate-100 dark:bg-blue-900 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Hỏi bất cứ điều gì về dữ liệu khách hàng của bạn..."
              className="flex-1 border border-gray-300 dark:border-gray-800 rounded-lg px-4 py-2 bg-blue-50 dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-600"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-sky-200 dark:focus:ring-sky-600 focus:ring-offset-2 flex items-center justify-center"
              aria-label="Gửi"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskAIView;