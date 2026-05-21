export const getInsightPrompt = (transcript, customerContext) => {
  return `
Bạn là một chuyên gia phân tích chất lượng cuộc gọi CSKH (Customer Service Quality Assurance).
Nhiệm vụ của bạn là phân tích đoạn hội thoại (transcript) dưới đây và trả về KẾT QUẢ DƯỚI DẠNG JSON.

Thông tin bối cảnh khách hàng (Customer Context - Lịch sử mua hàng/cuộc gọi trước đó):
${JSON.stringify(customerContext, null, 2)}

Nội dung cuộc gọi hiện tại (Transcript):
"""
${transcript}
"""

Hãy phân tích và trả về chính xác cấu trúc JSON sau (không trả về text nào khác ngoài JSON):
{
  "summary": "Tóm tắt ngắn gọn cuộc gọi trong 2-3 câu",
  "customer_intent": "Mục đích chính khách hàng gọi đến là gì?",
  "main_issue": "Vấn đề cốt lõi đang xảy ra (nếu có)",
  "root_cause": "Nguyên nhân gốc rễ của vấn đề",
  "sentiment_score": Điểm số cảm xúc từ 1 đến 10 (1 là cực kỳ tức giận, 10 là rất hài lòng),
  "risk_level": "low" | "medium" | "high" (Đánh giá rủi ro rời bỏ của khách hàng),
  "follow_up_needed": true hoặc false,
  "action_items": [
    "Hành động 1 cần làm tiếp theo",
    "Hành động 2 cần làm tiếp theo"
  ]
}
`;
};