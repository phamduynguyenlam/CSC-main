import express from 'express';
import { extractCallInsight } from '../services/llm/insightExtractor.js';
import { saveCallInsight } from '../services/db/customerRepository.js';

const router = express.Router();

router.post('/generate', async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Thiếu dữ liệu đoạn hội thoại (transcript)" });
    }

    const mockCustomerContext = {
      customer_profile: { full_name: "Khách hàng Demo", phone_number: "0900000000" },
      account_summary: { total_orders: 5, unresolved_issue_count: 1 },
      recent_orders: [], recent_calls: [], unresolved_issues: []
    };

    console.log("⏳ API đang xử lý trích xuất Insight bằng Gemini...");
    const insightJson = await extractCallInsight(transcript, mockCustomerContext);

    //  GỌI HÀM LƯU VÀO DATABASE
    await saveCallInsight(transcript, insightJson);

    // Trả kết quả về cho Frontend hiển thị
    res.status(200).json(insightJson);

  } catch (error) {
    console.error("❌ Lỗi API:", error);
    res.status(500).json({ error: "Lỗi máy chủ khi phân tích AI" });
  }
});

export default router;