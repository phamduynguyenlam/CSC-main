import express from 'express';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const router = express.Router();

// Initialize OpenAI client
let openai;
try {
  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    console.warn('⚠️  OpenAI API key not configured. See README.md for setup instructions.');
    openai = null;
  } else {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }
} catch (error) {
  console.error('❌ Failed to initialize OpenAI client:', error.message);
  openai = null;
}

// OpenAI Chat endpoint for the Ask AI section
router.post('/chat', async (req, res) => {
  try {
    const { messages, businessData } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: "messages (array) is required" });
    }

    // Check if OpenAI is properly configured
    if (!openai) {
      return res.status(503).json({ 
        error: "OpenAI API not configured", 
        message: "Please add your OpenAI API key to backend/.env file. See README.md for instructions.",
        fallback: {
          response: "👋 Hello! I'm SenseAI, your customer experience assistant. To enable full AI capabilities, please configure your OpenAI API key in the backend/.env file. Check the README.md for setup instructions!",
          source: 'config_error'
        }
      });
    }

    // Create context from real business data if available
    let businessContext = "";
    if (businessData) {
      const { kpis, recentFeedback, frustrationDrivers, sentimentTrend } = businessData;
      businessContext = `

CURRENT BUSINESS CONTEXT (LIVE DATA):
- Active Calls: ${kpis?.activeCalls || 'N/A'} (${kpis?.callsGrowth > 0 ? '+' : ''}${kpis?.callsGrowth || 0}% change)
- Average Sentiment: ${kpis?.avgSentiment || 'N/A'}/10 (${kpis?.sentimentGrowth > 0 ? '+' : ''}${kpis?.sentimentGrowth || 0} this week)
- Total Logins: ${kpis?.totalLogins?.toLocaleString() || 'N/A'} (${kpis?.loginsGrowth || 0}% growth)
- Products Reviewed: ${kpis?.productsReviewed?.toLocaleString() || 'N/A'}

Top Customer Issues:
${frustrationDrivers?.map(driver => `- ${driver.name}: ${driver.percentage}% of complaints (${driver.value} incidents)`).join('\n') || '- No frustration data available'}

Recent Customer Feedback:
${recentFeedback?.slice(0, 3).map(feedback => `- ${feedback.emotion}: "${feedback.text}" (${feedback.source})`).join('\n') || '- No recent feedback available'}

Weekly Sentiment Trend:
${sentimentTrend?.map(day => `${day.name}: ${day.sentiment}/5 (${day.calls} calls)`).join(', ') || 'No trend data available'}

Use this real-time data to provide specific, accurate insights and recommendations.`;
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are SenseAI, an intelligent Customer Experience Analytics Assistant for a comprehensive CX platform. You help analyze business metrics, customer sentiment, and provide actionable insights.

Core Capabilities:
- Analyze customer sentiment and feedback patterns
- Provide business intelligence insights with real data
- Explain metrics and KPIs in simple terms
- Suggest actionable improvements for customer experience
- Help with data interpretation and trend analysis

Context: You're integrated into a real-time CX dashboard that tracks:
- Customer sentiment scores and trends
- Call center performance metrics
- Business KPIs and analytics
- Customer feedback and reviews
- Frustration drivers and pain points

Always be helpful, professional, and focus on providing specific, actionable advice for improving customer experience. When discussing metrics, explain what they mean and how to improve them. Use the provided real-time business data to give accurate, current insights.

${businessContext}`,
        },
        ...messages,
      ],
      temperature: 0.7,
      max_tokens: 600,
    });

    const reply =
      response.choices?.[0]?.message?.content ||
      "Sorry, I couldn't generate a response.";

    res.json({ 
      response: reply,  // Changed from 'reply' to 'response' to match frontend
      success: true,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error("OpenAI Chat error:", err);
    
    // Check if it's an API key issue
    if (err.code === 'invalid_api_key' || err.status === 401) {
      return res.status(500).json({
        error: "AI service configuration issue. Please check API key.",
        fallback: true
      });
    }
    
    res.status(500).json({
      error: "Something went wrong with the AI service.",
      fallback: true
    });
  }
});

// Fallback endpoint for when OpenAI is not available
router.post('/chat/fallback', async (req, res) => {
  const { messages } = req.body;
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // Simple keyword-based responses as fallback
  let reply = "I'm SenseAI, your Customer Experience Analytics Assistant. I can help you understand your business metrics, analyze customer sentiment, and provide insights for improving customer experience.";
  
  const lowerMessage = lastMessage.toLowerCase();
  
  if (lowerMessage.includes('sentiment') || lowerMessage.includes('feeling')) {
    reply = "I can help you analyze customer sentiment! I track emotional patterns from customer interactions, identify satisfaction trends, and suggest ways to improve customer happiness. What specific sentiment insights would you like to explore?";
  } else if (lowerMessage.includes('metric') || lowerMessage.includes('kpi') || lowerMessage.includes('performance')) {
    reply = "I monitor key performance indicators like customer satisfaction scores, response times, resolution rates, and sentiment trends. These metrics help identify areas for improvement. Which metrics would you like me to explain or analyze?";
  } else if (lowerMessage.includes('improve') || lowerMessage.includes('better') || lowerMessage.includes('fix')) {
    reply = "Based on customer data analysis, I can suggest improvements like: reducing response times, addressing common pain points, improving agent training, or enhancing product features. What area would you like to focus on improving?";
  }
  
  res.json({ 
    reply,
    success: true,
    fallback: true,
    timestamp: new Date().toISOString()
  });
});

export default router;