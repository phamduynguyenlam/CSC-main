import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

let geminiClient;

function getGeminiApiKey() {
  const key = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!key || key === 'your_google_gemini_api_key_here') {
    return null;
  }

  return key;
}

function getGeminiClient() {
  if (geminiClient !== undefined) {
    return geminiClient;
  }

  const apiKey = getGeminiApiKey();
  geminiClient = apiKey ? new GoogleGenerativeAI(apiKey) : null;
  return geminiClient;
}

function buildSystemPrompt() {
  return [
    'Bạn là cố vấn hỗ trợ khách hàng cấp cao dành cho tổng đài viên.',
    'Nhiệm vụ của bạn là đọc transcript hiện tại và ngữ cảnh khách hàng, sau đó gợi ý phản hồi tốt nhất tiếp theo cho điện thoại viên.',
    'Chỉ dùng lịch sử khách hàng khi nó thực sự giúp cải thiện sự đồng cảm, mức độ ưu tiên hoặc hướng xử lý.',
    'Chỉ dùng call memory được truy xuất khi nó liên quan trực tiếp tới transcript hiện tại.',
    'Không được bịa ra chính sách, thông tin đơn hàng hoặc cam kết ngoài dữ liệu đầu vào.',
    'Nếu ngữ cảnh cho thấy đây là vấn đề lặp lại chưa được giải quyết, hãy nêu rõ và yêu cầu điện thoại viên thừa nhận điều đó.',
    'Hãy trả lời ngắn gọn, cụ thể, có thể hành động ngay bằng Markdown với các mục:',
    '1. Tóm tắt tình huống',
    '2. Gợi ý phản hồi cho điện thoại viên',
    '3. Các bước nên làm tiếp theo',
    '4. Rủi ro cần lưu ý',
    'Toàn bộ câu trả lời phải bằng tiếng Việt tự nhiên, rõ ràng, phù hợp ngữ cảnh chăm sóc khách hàng.',
  ].join(' ');
}

function trimText(text, maxLength) {
  if (!text) {
    return '';
  }

  const normalized = String(text).trim();
  if (normalized.length <= maxLength) {
    return normalized;
  }

  return `${normalized.slice(0, maxLength)}...`;
}

function formatRetrievedContext(retrievedContext = []) {
  if (!Array.isArray(retrievedContext) || retrievedContext.length === 0) {
    return 'No retrieved call memory.';
  }

  return retrievedContext.slice(0, 3).map((match, index) => {
    const reference = match?.metadata?.call_ai_response_id
      ? `call_ai_response_id=${match.metadata.call_ai_response_id}`
      : `match_${index + 1}`;
    const snippet = trimText(match?.document || '', 900);

    return `Match ${index + 1} (${reference}):\n${snippet}`;
  }).join('\n\n');
}

function buildUserPrompt({ transcript, customerContext, conversationHistory = [], retrievedContext = [] }) {
  const historyText = conversationHistory.length
    ? conversationHistory
        .slice(-6)
        .map((entry) => `${entry.role}: ${entry.content}`)
        .join('\n')
    : 'No prior chat history.';

  const retrievedText = formatRetrievedContext(retrievedContext);

  return [
    'TRANSCRIPT HIỆN TẠI:',
    transcript,
    '',
    'NGỮ CẢNH KHÁCH HÀNG:',
    JSON.stringify(customerContext, null, 2),
    '',
    'CALL MEMORY ĐƯỢC TRUY XUẤT (CHỈ DÙNG THAM KHẢO):',
    retrievedText,
    '',
    'LỊCH SỬ HỘI THOẠI GẦN ĐÂY:',
    historyText,
    '',
    'Hãy đưa ra hướng dẫn cho điện thoại viên trong cuộc gọi hiện tại. Câu trả lời phải bám sát khách hàng này và transcript này.',
  ].join('\n');
}

function buildFallbackResponse(customerContext) {
  const customerName = customerContext.customer_profile?.full_name || 'the customer';
  const repeatIssue = customerContext.unresolved_issues?.[0];

  const lines = [
    '**Situation Summary**',
    `The current environment cannot reach the configured LLM, but ${customerName}'s customer context was loaded successfully.`,
    '',
    '**Recommended Agent Response**',
    `Acknowledge the concern clearly, confirm you are reviewing ${customerName}'s recent account history, and avoid making commitments until the issue is verified.`,
    '',
    '**Next Best Actions**',
    '- Confirm the specific order or incident the customer is calling about.',
    '- Check whether the issue matches an unresolved prior case before offering a resolution.',
    '- Explain the next step and timeline in one sentence.',
    '',
    '**Risk Flags**',
  ];

  if (repeatIssue) {
    lines.push(`- Possible repeat unresolved issue: ${repeatIssue.issue_type || 'unknown issue'} (${repeatIssue.resolution || 'status unknown'}).`);
  } else {
    lines.push('- No major risk flag detected from the compact customer context.');
  }

  return lines.join('\n');
}

export async function generateCustomerAdvice({
  transcript,
  customerContext,
  conversationHistory = [],
  retrievedContext = [],
}) {
  const gemini = getGeminiClient();

  if (!gemini) {
    return {
      response: buildFallbackResponse(customerContext),
      metadata: {
        model: 'fallback',
        usedFallback: true,
        ragMatches: Array.isArray(retrievedContext) ? retrievedContext.length : 0,
      },
    };
  }

  const modelName = 'gemini-2.5-flash';
  const model = gemini.getGenerativeModel({ model: modelName });
  const prompt = [
    buildSystemPrompt(),
    '',
    buildUserPrompt({
      transcript,
      customerContext,
      conversationHistory,
      retrievedContext,
    }),
  ].join('\n');

  const result = await model.generateContent({
    generationConfig: {
      temperature: 0.4,
      maxOutputTokens: 700,
    },
    contents: [
      {
        role: 'user',
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  });
  const response = await result.response;
  const responseText = response.text();

  return {
    response: responseText || 'No response generated.',
    metadata: {
      model: modelName,
      usedFallback: false,
      usage: null,
      ragMatches: Array.isArray(retrievedContext) ? retrievedContext.length : 0,
    },
  };
}

export default {
  generateCustomerAdvice,
};
