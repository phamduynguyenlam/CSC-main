const API_BASE_URL = import.meta.env?.VITE_API_URL || 'http://localhost:3001';

export interface SentimentAnalysis {
    emotion: string;
    suggestion: string;
    sentimentScore?: number;
    intensity?: string;
    keyIndicators?: string[];
    priority?: string;
    recommendedTone?: string;
    coachingTips?: string[];
    phraseExamples?: string[];
    warningFlags?: string[];
    score?: number;
    suggestions?: string[];
}

export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
    timestamp?: string;
}

export interface EnhancedChatResponse {
    success: boolean;
    response: string;
    sentiment: SentimentAnalysis;
    context: {
        userEmotion: string;
        confidenceScore: number;
        priority: string;
        keyIndicators: string[];
        suggestions: string[];
    };
    metadata: {
        timestamp: string;
        model: string;
        responseLength: number;
        conversationLength: number;
        fallback?: boolean;
    };
    error?: string;
}

export interface ChatRequest {
    message: string;
    conversationHistory?: ChatMessage[];
    userContext?: {
        mood?: string;
        role?: string;
        preferences?: any;
    };
}

export interface AskApiResponse {
    answer: string;
    category: string;
    confidence: string;
    timestamp: string;
    metadata: {
        questionType: string;
        responseLength: number;
        hasActionableItems: boolean;
        hasMetrics: boolean;
        relevanceScore: number;
        isFallback?: boolean;
    };
    relatedTopics?: string[];
    suggestedFollowUps?: string[];
}

export interface AskApiRequest {
    question: string;
    context?: string;
    category?: 'analytics' | 'sentiment' | 'strategy' | 'operations' | 'forecasting' | 'general';
    history?: Array<{ role: string; parts: string[] }>;
}

type Content = {
    role: string;
    parts: string[];
};

export async function askSenseAI(request: ChatRequest): Promise<EnhancedChatResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gemini/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(request)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }

        const data: EnhancedChatResponse = await response.json();
        return data;
    } catch (error) {
        console.error('Error asking SenseAI:', error);
        
        return {
            success: false,
            response: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
            sentiment: {
                emotion: 'Neutral',
                suggestion: 'Try again later',
                score: 5,
                priority: 'low',
                keyIndicators: [],
                suggestions: []
            },
            context: {
                userEmotion: 'Neutral',
                confidenceScore: 5,
                priority: 'low',
                keyIndicators: [],
                suggestions: []
            },
            metadata: {
                timestamp: new Date().toISOString(),
                model: 'fallback',
                responseLength: 0,
                conversationLength: 0,
                fallback: true
            },
            error: error instanceof Error ? error.message : 'Unknown error'
        };
    }
}

export async function askGeminiQuestion(request: AskApiRequest): Promise<AskApiResponse> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gemini/ask`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: request.question,
                conversationHistory: request.history?.map(h => ({
                    role: h.role === 'user' ? 'user' : 'assistant',
                    content: h.parts.join(' ')
                })) || [],
                userContext: {
                    category: request.category,
                    context: request.context
                }
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: EnhancedChatResponse = await response.json();
        
        return {
            answer: data.response,
            category: request.category || 'general',
            confidence: data.success ? 'high' : 'low',
            timestamp: data.metadata.timestamp,
            metadata: {
                questionType: request.category || 'general',
                responseLength: data.metadata.responseLength,
                hasActionableItems: data.response.includes('action') || data.response.includes('recommend'),
                hasMetrics: /\d+%|\$[\d,]+|\d+[\w\s]*score/i.test(data.response),
                relevanceScore: data.context.confidenceScore / 10,
                isFallback: data.metadata.fallback
            },
            relatedTopics: data.context.keyIndicators || [],
            suggestedFollowUps: data.context.suggestions || []
        };
    } catch (error) {
        console.error('Error asking Gemini question:', error);
        throw error;
    }
}

export async function analyzeTranscriptForSuggestions(transcript: string): Promise<SentimentAnalysis> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gemini/analyze-transcript`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            emotion: data.emotion || 'Unknown',
            suggestion: data.suggestion || 'Continue monitoring conversation.',
            sentimentScore: data.sentimentScore || 5,
            intensity: data.intensity || 'medium',
            keyIndicators: data.keyIndicators || [],
            priority: data.priority || 'medium',
            recommendedTone: data.recommendedTone || 'professional',
            coachingTips: data.coachingTips || [
                'Listen actively and acknowledge the customer concern',
                'Use empathetic language to build rapport',
                'Focus on solutions rather than problems'
            ],
            phraseExamples: data.phraseExamples || [
                'I understand your concern and I am here to help',
                'Let me look into this for you right away',
                'I can see why this would be frustrating'
            ],
            warningFlags: data.warningFlags || []
        };
    } catch (error) {
        console.error('Error analyzing transcript:', error);
        
        return {
            emotion: 'Neutral',
            suggestion: 'Monitor the conversation and maintain professional tone.',
            sentimentScore: 5,
            intensity: 'medium',
            keyIndicators: [],
            priority: 'medium',
            recommendedTone: 'professional',
            coachingTips: [
                'Listen actively to understand the customer needs',
                'Respond with empathy and professionalism',
                'Focus on providing clear, actionable solutions'
            ],
            phraseExamples: [
                'I understand your situation',
                'Let me help you with that',
                'Thank you for bringing this to my attention'
            ],
            warningFlags: ['Monitor for service availability']
        };
    }
}

export async function getAssistantResponse(prompt: string, history: Content[] = []): Promise<string> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gemini/assistant`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, history })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.response || 'I apologize, but I could not generate a response at this time.';
    } catch (error) {
        console.error('Error getting assistant response:', error);
        return 'I am currently unable to process your request. Please try again later.';
    }
}

export async function quickSentimentCheck(text: string): Promise<SentimentAnalysis> {
    try {
        const chatResponse = await askSenseAI({
            message: text,
            conversationHistory: []
        });

        return chatResponse.sentiment;
    } catch (error) {
        console.error('Error in quick sentiment check:', error);
        return {
            emotion: 'Neutral',
            suggestion: 'Unable to analyze sentiment at this time',
            score: 5,
            priority: 'low',
            keyIndicators: [],
            suggestions: []
        };
    }
}
