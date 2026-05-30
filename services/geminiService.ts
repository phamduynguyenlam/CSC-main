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

export interface CustomerAssistRequest {
    transcript: string;
    customerId?: number;
    callLogId?: number;
    conversationHistory?: ChatMessage[];
}

export interface CompactCustomerContext {
    customer_profile: {
        customer_id: number;
        full_name: string;
        phone_number: string;
        email?: string | null;
        address?: string | null;
        notes?: string | null;
    };
    account_summary: {
        total_orders: number;
        total_logged_calls: number;
        total_previous_calls: number;
        unresolved_issue_count: number;
    };
    recent_orders: Array<Record<string, unknown>>;
    recent_calls: Array<Record<string, unknown>>;
    unresolved_issues: Array<Record<string, unknown>>;
}

export interface CustomerAssistResponse {
    success: boolean;
    response: string;
    customerContext: CompactCustomerContext;
    metadata: {
        model: string;
        usedFallback: boolean;
        customerId: number;
        source: string;
        timestamp: string;
        usage?: unknown;
        rag?: {
            enabled: boolean;
            matchCount: number;
            vectorIdPrefix?: string | null;
        };
    };
}

export interface CustomerContextResponse {
    success: boolean;
    customerContext: CompactCustomerContext;
    metadata: {
        source: string;
        customerId: number;
        timestamp: string;
    };
}

export interface CompleteCallRequest {
    customerId: number;
    transcript: string;
    summary?: string;
    agentName?: string;
    callType?: string;
    suggestion?: string;
    emotion?: string;
    keyIndicators?: string[];
    priority?: string;
    sentimentScore?: number;
}

export interface CompleteCallResponse {
    success: boolean;
    callLogId: number;
    callSummary: string;
    customerContext: CompactCustomerContext;
    metadata: {
        source: string;
        customerId: number;
        timestamp: string;
    };
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
        console.error('Lỗi khi gửi câu hỏi đến CSCopilot:', error);
        
        return {
            success: false,
            response: "Tôi xin lỗi, hiện tại kết nối đang gặp sự cố. Vui lòng thử lại trong giây lát.",
            sentiment: {
                emotion: 'Trung tính',
                suggestion: 'Thử lại sau',
                score: 5,
                priority: 'Thấp',
                keyIndicators: [],
                suggestions: []
            },
            context: {
                userEmotion: 'Trung tính',
                confidenceScore: 5,
                priority: 'Thấp',
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
        console.error('Lỗi khi gửi câu hỏi đến Gemini:', error);
        throw error;
    }
}

export async function analyzeTranscriptForSuggestions(
    transcript: string,
    options?: { phoneNumber?: string }
): Promise<SentimentAnalysis> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/gemini/analyze-transcript`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ transcript, phoneNumber: options?.phoneNumber })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return {
            emotion: data.emotion || 'Unknown',
            suggestion: data.suggestion || 'Tiếp tục giám sát cuộc hội thoại.',
            sentimentScore: data.sentimentScore || 5,
            intensity: data.intensity || 'Trung bình',
            keyIndicators: data.keyIndicators || [],
            priority: data.priority || 'Trung bình',
            recommendedTone: data.recommendedTone || 'Chuyên nghiệp',
            coachingTips: data.coachingTips || [
                'Lắng nghe tích cực và ghi nhận mối bận tâm của khách hàng',
                'Sử dụng ngôn ngữ đồng cảm để xây dựng mối quan hệ',
                'Lắng nghe tích cực và ghi nhận mối bận tâm của khách hàng'
            ],
            phraseExamples: data.phraseExamples || [
                'Tôi hiểu mối quan tâm của anh/chị và tôi đang ở đây để hỗ trợ.',
                'Để tôi kiểm tra ngay cho anh/chị.',
                'Tôi hiểu vì sao tình huống này khiến anh/chị khó chịu.'
            ],
            warningFlags: data.warningFlags || []
        };
    } catch (error) {
        console.error('Error analyzing transcript:', error);
        
        return {
            emotion: 'Trung tính',
            suggestion: 'Giám sát cuộc hội thoại và duy trì tác phong chuyên nghiệp.',
            sentimentScore: 5,
            intensity: 'Trung bình',
            keyIndicators: [],
            priority: 'Trung bình',
            recommendedTone: 'Chuyên nghiệp',
            coachingTips: [
                'Lắng nghe tích cực để thấu hiểu nhu cầu của khách hàng',
                'Phản hồi bằng sự thấu hiểu và chuyên nghiệp',
                'Tập trung vào việc đưa ra các giải pháp rõ ràng và có thể thực hiện ngay'
            ],
            phraseExamples: [
                'Tôi hiểu tình huống của anh/chị.',
                'Để tôi hỗ trợ anh/chị việc này.',
                'Cảm ơn anh/chị đã thông báo để tôi kiểm tra.'
            ],
            warningFlags: ['Giám sát tính khả dụng của dịch vụ']
        };
    }
}

export async function getAssistantResponse(prompt: string, history: Content[] = [], _context?: unknown): Promise<string> {
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
        return data.response || 'Tôi xin lỗi, hiện tại tôi không thể tạo phản hồi vào lúc này.';
    } catch (error) {
        console.error('Lỗi khi tải phản hồi từ trợ lý AI:', error);
        return 'Tôi hiện chưa thể xử lý yêu cầu của bạn. Vui lòng thử lại sau.';
    }
}

export async function getCustomerAssistResponse(request: CustomerAssistRequest): Promise<CustomerAssistResponse> {
    const response = await fetch(`${API_BASE_URL}/api/customer-assist/respond`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as CustomerAssistResponse;
}

export async function getCustomerContext(options: { customerId?: number; callLogId?: number }): Promise<CustomerContextResponse> {
    const searchParams = new URLSearchParams();

    if (typeof options.customerId === 'number') {
        searchParams.set('customerId', String(options.customerId));
    }

    if (typeof options.callLogId === 'number') {
        searchParams.set('callLogId', String(options.callLogId));
    }

    const response = await fetch(`${API_BASE_URL}/api/customer-assist/context?${searchParams.toString()}`);
    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as CustomerContextResponse;
}

export async function completeCustomerCall(request: CompleteCallRequest): Promise<CompleteCallResponse> {
    const response = await fetch(`${API_BASE_URL}/api/customer-assist/complete-call`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data as CompleteCallResponse;
}

export async function quickSentimentCheck(text: string): Promise<SentimentAnalysis> {
    try {
        const chatResponse = await askSenseAI({
            message: text,
            conversationHistory: []
        });

        return chatResponse.sentiment;
    } catch (error) {
        console.error('Lỗi khi nhận diện cảm xúc:', error);
        return {
            emotion: 'Trung tính',
            suggestion: 'Không thể phân tích cảm xúc vào lúc này',
            score: 5,
            priority: 'High',
            keyIndicators: [],
            suggestions: []
        };
    }
}
