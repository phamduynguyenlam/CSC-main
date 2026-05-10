import React, { useState, useEffect } from 'react';
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
      // Send conversation history to OpenAI for intelligent responses
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
          businessData // Include real-time business context
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
      
      // Check if it's a configuration error
      if (error.response?.status === 503 && error.response?.data?.fallback) {
        const configErrorMessage = { 
          role: 'assistant' as const, 
          content: `🔧 **Setup Required**: ${error.response.data.fallback.response}\n\n📋 **Quick Setup Steps:**\n1. Copy \`backend/.env.example\` to \`backend/.env\`\n2. Add your OpenAI API key (get one at platform.openai.com)\n3. Restart the backend server\n\n💡 Check the README.md for detailed instructions!`,
          metadata: {
            configurationError: true,
            timestamp: new Date().toISOString()
          }
        };
        setConversation(prev => [...prev, configErrorMessage]);
        setIsLoading(false);
        return;
      }
      
      // Fallback to intelligent local response if OpenAI fails
      try {
        const fallbackResponse = await generateDataDrivenResponse(question, businessData);
        const assistantMessage = { 
          role: 'assistant' as const, 
          content: `⚠️ AI service temporarily unavailable. Using local intelligence:\n\n${fallbackResponse}`,
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
          content: "I'm sorry, both AI services are temporarily unavailable. Please try again in a moment! 🤖"
        };
        setConversation(prev => [...prev, errorMessage]);
      }
      
      setIsLoading(false);
    }
  };

  const generateDataDrivenResponse = async (question: string, data: BusinessData | null): Promise<string> => {
    if (!data) {
      return "Hey! 👋 I'm SenseAI, your business intelligence assistant. Looks like I can't access your real-time data right now, but I'm still here to help! Try asking me about customer experience, metrics analysis, or business improvements. What would you like to explore?";
    }

    const lowerQuestion = question.toLowerCase();
    const { kpis, recentFeedback, frustrationDrivers, sentimentTrend } = data;
    
    // Calculate dynamic insights
    const avgWeekSentiment = sentimentTrend.reduce((sum, day) => sum + day.sentiment, 0) / sentimentTrend.length;
    const totalWeekCalls = sentimentTrend.reduce((sum, day) => sum + day.calls, 0);
    const topFrustration = frustrationDrivers[0];
    const recentPositiveFeedback = recentFeedback.filter(f => ['Delight', 'Satisfaction'].includes(f.emotion));
    const recentNegativeFeedback = recentFeedback.filter(f => ['Anger', 'Frustration'].includes(f.emotion));

    // Conversation starters and personality
    const greetings = ['hello', 'hi', 'hey', 'what\'s up', 'how are you', 'good morning', 'good afternoon'];
    const isGreeting = greetings.some(greeting => lowerQuestion.includes(greeting));
    
    const personalityResponses = [
      "Hey there! 🚀 I'm SenseAI, and I'm pumped to help you understand your business better!",
      "Hello! 😊 Ready to dive into some awesome business insights together?",
      "Hi! 👋 I'm your friendly neighborhood AI analyst. What business mysteries can we solve today?",
      "Hey! 🎯 I love helping businesses grow. What would you like to explore in your data?",
      "Hello there! ⚡ I'm SenseAI, and I'm excited to help you make sense of your customer experience data!"
    ];

    if (isGreeting && question.length < 20) {
      const randomGreeting = personalityResponses[Math.floor(Math.random() * personalityResponses.length)];
      return `${randomGreeting}\n\n**What I can help you with:**\n• 📊 Real-time business metrics and KPIs\n• 💭 Customer sentiment analysis\n• 🎯 Actionable improvement recommendations\n• 📈 Trend analysis and insights\n• 🔍 Deep-dives into specific business areas\n\nWhat would you like to explore first?`;
    }

    // Business metrics queries
    if (lowerQuestion.includes('metric') || lowerQuestion.includes('performance') || lowerQuestion.includes('kpi')) {
      return `📊 **Current Business Metrics Performance (LIVE DATA):**

**Real-Time KPIs:**
- 🔥 **${kpis.activeCalls} Active Calls** (${kpis.callsGrowth > 0 ? '+' : ''}${kpis.callsGrowth}% from last hour)
- 😊 **Sentiment Score: ${kpis.avgSentiment}/10** (${kpis.sentimentGrowth > 0 ? '+' : ''}${kpis.sentimentGrowth} improvement this week)  
- 👥 **${kpis.totalLogins.toLocaleString()} Total Logins** (${kpis.loginsGrowth > 0 ? '+' : ''}${kpis.loginsGrowth}% growth)
- 📝 **${kpis.productsReviewed.toLocaleString()} Products Reviewed** (${kpis.reviewsPercentage}% completion rate)

**7-Day Performance:**
- � **Average Weekly Sentiment: ${avgWeekSentiment.toFixed(1)}/5** 
- 📞 **Total Weekly Calls: ${totalWeekCalls}**
- 🎯 **Top Issue: ${topFrustration.name}** (${topFrustration.percentage}% of complaints)

**Trending:** ${kpis.sentimentGrowth > 0 ? 'POSITIVE' : 'NEEDS ATTENTION'} - Sentiment ${kpis.sentimentGrowth > 0 ? 'improved' : 'declined'} by ${Math.abs(kpis.sentimentGrowth)} points this week.`;
    }

    // Sentiment analysis queries  
    if (lowerQuestion.includes('sentiment') || lowerQuestion.includes('emotion') || lowerQuestion.includes('feeling')) {
      const bestDay = sentimentTrend.reduce((best, day) => day.sentiment > best.sentiment ? day : best);
      const worstDay = sentimentTrend.reduce((worst, day) => day.sentiment < worst.sentiment ? day : worst);
      
      return `💭 **Customer Sentiment Analysis (LIVE DATA):**

**Current Sentiment Overview:**
- 📈 **Current Score: ${kpis.avgSentiment}/10** (${kpis.sentimentGrowth > 0 ? '+' : ''}${kpis.sentimentGrowth} this week)
- � **Weekly Average: ${avgWeekSentiment.toFixed(1)}/5**
- 🌟 **Best Day: ${bestDay.name}** (${bestDay.sentiment}/5 with ${bestDay.calls} calls)
- � **Worst Day: ${worstDay.name}** (${worstDay.sentiment}/5 with ${worstDay.calls} calls)

**Real Customer Emotions Today:**
${recentFeedback.map((feedback, i) => 
  `${i + 1}. **${feedback.emotion}** - "${feedback.text}" (${feedback.source})`
).join('\n')}

**Action Needed:** ${topFrustration.name} issues are driving ${topFrustration.percentage}% of negative sentiment - immediate attention required.`;
    }

    // Customer feedback queries
    if (lowerQuestion.includes('feedback') || lowerQuestion.includes('customer') || lowerQuestion.includes('review')) {
      return `� **Customer Feedback Analysis (LIVE DATA):**

**Recent Customer Comments:**
${recentFeedback.map(feedback => 
  `- ${feedback.emotion === 'Delight' ? '😍' : feedback.emotion === 'Satisfaction' ? '�' : feedback.emotion === 'Anger' ? '😤' : '😐'} **"${feedback.text}"** (${feedback.source}, ${new Date(feedback.timestamp).toLocaleTimeString()})`
).join('\n')}

**Feedback Analytics:**
- � **Total Feedback Sources:** Chat, Email, Survey, Social
- 😊 **Positive Feedback:** ${recentPositiveFeedback.length}/${recentFeedback.length} (${Math.round((recentPositiveFeedback.length/recentFeedback.length)*100)}%)
- 😕 **Negative Feedback:** ${recentNegativeFeedback.length}/${recentFeedback.length} (${Math.round((recentNegativeFeedback.length/recentFeedback.length)*100)}%)

**Top Issues by Volume:**
${frustrationDrivers.map((driver, i) => `${i + 1}. **${driver.name}:** ${driver.value} complaints (${driver.percentage}%)`).join('\n')}`;
    }

    // Actions and recommendations based on real data
    if (lowerQuestion.includes('action') || lowerQuestion.includes('recommend') || lowerQuestion.includes('improve') || lowerQuestion.includes('fix')) {
      const criticalIssues = frustrationDrivers.filter(d => d.percentage > 20);
      
      return `🎯 **Data-Driven Action Recommendations:**

**Immediate Priority Actions (Based on Current Data):**
${criticalIssues.map((issue, i) => 
  `${i + 1}. � **Address ${issue.name} Issues** (${issue.percentage}% of customer frustrations - ${issue.value} complaints)`
).join('\n')}

**Performance Opportunities:**
- � **Sentiment Optimization:** Current ${kpis.avgSentiment}/10 → Target 9.0+ (${(9.0 - kpis.avgSentiment).toFixed(1)} point improvement needed)
- � **Call Efficiency:** ${kpis.activeCalls} active calls → Reduce by optimizing ${topFrustration.name} resolution
- 📝 **Review Completion:** Current ${kpis.reviewsPercentage}% → Target 85%+

**Predicted Impact:**
- Fixing ${topFrustration.name} issues could improve sentiment by ~0.5 points
- Reducing call volume by 15% through proactive issue resolution
- Increasing customer satisfaction by addressing top 3 pain points

**Next 24 Hours:** Focus on ${topFrustration.name} (${topFrustration.percentage}% of issues) for maximum impact.`;
    }

    // Specific data analysis
    if (lowerQuestion.includes('trend') || lowerQuestion.includes('pattern') || lowerQuestion.includes('analysis')) {
      const trendDirection = kpis.sentimentGrowth > 0 ? 'improving' : kpis.sentimentGrowth < 0 ? 'declining' : 'stable';
      const callTrend = kpis.callsGrowth > 0 ? 'increasing' : kpis.callsGrowth < 0 ? 'decreasing' : 'stable';
      
      return `📈 **Trend Analysis (LIVE DATA):**

**7-Day Sentiment Pattern:**
${sentimentTrend.map(day => `**${day.name}:** ${day.sentiment}/5 (${day.calls} calls)`).join('\n')}

**Key Trends Identified:**
- 📊 **Sentiment is ${trendDirection}** (${kpis.sentimentGrowth > 0 ? '+' : ''}${kpis.sentimentGrowth} change)
- � **Call volume is ${callTrend}** (${kpis.callsGrowth > 0 ? '+' : ''}${kpis.callsGrowth}% change)
- � **Login activity up ${kpis.loginsGrowth}%** (${kpis.totalLogins.toLocaleString()} total)

**Correlation Insights:**
- Days with higher sentiment scores tend to have fewer total calls
- ${topFrustration.name} issues spike on certain days
- Review completion correlates with customer satisfaction

**Predictive Indicators:**
- If current trend continues, expect sentiment to reach ${(kpis.avgSentiment + (kpis.sentimentGrowth * 4)).toFixed(1)}/10 next month
- Call volume may ${callTrend === 'increasing' ? 'strain resources' : 'normalize'} if pattern persists`;
    }

    // Add conversational intelligence for varied responses
    const helpRequests = ['help', 'support', 'assist', 'guide', 'what can you do', 'how do you work'];
    const isHelpRequest = helpRequests.some(term => lowerQuestion.includes(term));
    
    const complimentKeywords = ['awesome', 'great', 'amazing', 'cool', 'nice', 'good job', 'thanks', 'thank you'];
    const isCompliment = complimentKeywords.some(word => lowerQuestion.includes(word));
    
    const questionsKeywords = ['what', 'how', 'why', 'when', 'where', 'which', 'can you', 'do you'];
    const isQuestion = questionsKeywords.some(word => lowerQuestion.startsWith(word)) || lowerQuestion.includes('?');

    if (isCompliment) {
      const appreciationResponses = [
        "Aww, thanks! 😊 That makes my circuits happy! I love helping you understand your business better.",
        "You're too kind! 🚀 I'm just doing what I love - turning data into actionable insights!",
        "Thank you! 🎯 I'm passionate about helping businesses like yours succeed. What else can we explore?",
        "That means a lot! ⭐ I'm designed to be helpful and I love seeing businesses grow with good data.",
        "Thanks! 💪 I get excited about finding patterns in your data that can drive real improvements!"
      ];
      const randomAppreciation = appreciationResponses[Math.floor(Math.random() * appreciationResponses.length)];
      return `${randomAppreciation}\n\n**Current business snapshot:**\n📊 ${kpis.activeCalls} active calls, ${kpis.avgSentiment}/10 sentiment\n🎯 Main focus area: ${topFrustration.name} (${topFrustration.percentage}% of issues)\n\nWhat would you like to dive deeper into?`;
    }

    if (isHelpRequest) {
      return `🎯 **I'm SenseAI - Your Smart Business Intelligence Assistant!**

I'm like having a data analyst friend who's always excited to help! Here's what I can do:

**🔥 Real-Time Analysis:**
- Break down your current business metrics in plain English
- Explain what your ${kpis.avgSentiment}/10 sentiment score really means
- Identify why you have ${kpis.activeCalls} active calls right now

**💡 Smart Insights:**
- Spot trends before they become problems (like your ${topFrustration.name} issues)
- Predict where your business is heading based on current patterns
- Find hidden opportunities in your customer feedback

**🎬 Actionable Recommendations:**
- Tell you exactly what to fix first for maximum impact
- Suggest specific improvements based on your real data
- Help prioritize tasks that will boost customer satisfaction

**💬 Conversational & Fun:**
- I explain complex data in simple, engaging ways
- I adapt my responses to what you're curious about
- I remember our conversation context (unlike boring static responses!)

Try asking me things like:
• "What's our biggest customer pain point right now?"
• "How can we improve our sentiment score?"
• "What trends should I be worried about?"
• "Give me 3 specific actions to take today"

What interests you most about your business right now?`;
    }

    // Intelligent general response that varies based on business performance
    const performanceVariations = [
      {
        condition: kpis.avgSentiment >= 8,
        responses: [
          `🔥 **Your business is absolutely crushing it right now!** With a ${kpis.avgSentiment}/10 sentiment score, your customers are loving what you're doing!`,
          `⭐ **Wow, ${kpis.avgSentiment}/10 sentiment?** That's incredible! Your customers are clearly having amazing experiences.`,
          `🚀 **Your business is in fantastic shape!** A ${kpis.avgSentiment}/10 sentiment score shows you're doing something very right.`
        ]
      },
      {
        condition: kpis.avgSentiment >= 6,
        responses: [
          `📈 **Your business is performing well** with a solid ${kpis.avgSentiment}/10 sentiment score. There's definitely room to take it to the next level!`,
          `⚡ **Good momentum!** Your ${kpis.avgSentiment}/10 sentiment shows customers are generally happy, and I can see opportunities to push even higher.`,
          `💪 **Solid performance** at ${kpis.avgSentiment}/10 sentiment! Let's identify what's working well and amplify it.`
        ]
      },
      {
        condition: true, // default case
        responses: [
          `🎯 **Let's turn this around together!** Your ${kpis.avgSentiment}/10 sentiment shows there's huge potential for improvement.`,
          `💡 **Opportunity alert!** With ${kpis.avgSentiment}/10 sentiment, I can see clear paths to boost customer satisfaction quickly.`,
          `🔧 **Time to optimize!** Your ${kpis.avgSentiment}/10 sentiment tells me exactly where to focus for maximum impact.`
        ]
      }
    ];

    const matchingVariation = performanceVariations.find(v => v.condition);
    const randomResponse = matchingVariation.responses[Math.floor(Math.random() * matchingVariation.responses.length)];

    return `${randomResponse}

**Right Now in Your Business:**
- 📞 **${kpis.activeCalls} active calls** (${kpis.callsGrowth > 0 ? 'trending up' : kpis.callsGrowth < 0 ? 'decreasing' : 'stable'})
- 🎯 **#1 Issue:** ${topFrustration.name} - affecting ${topFrustration.percentage}% of customers
- 👥 **${kpis.totalLogins.toLocaleString()} logins** with ${kpis.loginsGrowth > 0 ? '+' : ''}${kpis.loginsGrowth}% growth

**Latest Customer Voice:**
${recentFeedback.slice(0, 2).map(f => `💬 "${f.text}" (feeling ${f.emotion.toLowerCase()})`).join('\n')}

**I'm here to help you:**
- Understand what these numbers mean for your business
- Find quick wins to improve customer experience  
- Spot trends and patterns you might miss
- Give you specific actions to take right now

What aspect of your business would you like to explore? I love diving deep into the data! 🤓`;
  };

  const sampleQuestions = [
    "What are our current KPIs and how are they trending?",
    "Analyze today's customer sentiment and feedback patterns",
    "What actions should we take based on current frustration data?", 
    "Show me the customer feedback trends and analysis",
    "What patterns do you see in our 7-day performance data?"
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Ask AI</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">
          Get instant insights from your customer experience data
        </p>
      </div>

      {/* Live Data Connection Status */}
      <div className={`p-3 rounded-lg border ${businessData ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'}`}>
        <div className="flex items-center space-x-2">
          <div className={`w-2 h-2 rounded-full ${businessData ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
          <span className={`text-sm font-medium ${businessData ? 'text-green-700 dark:text-green-300' : 'text-yellow-700 dark:text-yellow-300'}`}>
            {businessData ? 'Connected to Live Business Data' : 'Connecting to Business Data...'}
          </span>
          {businessData && (
            <span className="text-xs text-green-600 dark:text-green-400">
              Last updated: {new Date().toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-lg shadow">
        {/* Conversation Area */}
        <div className="p-6 min-h-[400px] max-h-[500px] overflow-y-auto">
          {conversation.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path>
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Hi! I'm SenseAI, your LIVE Data Analytics Assistant
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6">
                I'm connected to your real business data and can analyze current KPIs, sentiment trends, customer feedback, and provide actionable insights based on your actual performance metrics.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {sampleQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(q)}
                    className="p-3 text-left bg-gray-50 dark:bg-slate-700 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-600 transition-colors"
                  >
                    <span className="text-sm text-gray-700 dark:text-gray-300">{q}</span>
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
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-white'
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
                        Using live business data
                      </div>
                    )}
                    {message.role === 'assistant' && message.metadata?.sentiment && (
                      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                        User sentiment: {message.metadata.sentiment.emotion} ({message.metadata.context.confidenceScore}/10)
                      </div>
                    )}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 dark:bg-slate-700 px-4 py-2 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-gray-200 dark:border-gray-700 p-4">
          <form onSubmit={handleSubmit} className="flex space-x-3">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything about your customer data..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!question.trim() || isLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AskAIView;