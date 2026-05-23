import { extractCallInsight } from '../llm/insightExtractor.js';
import customerRepo from '../db/customerRepository.js';
import customerContextService from '../customerContextService.js';
import { query } from '../db/mysql.js';

export async function processAndSaveCallInsight(callLogId, customerId, transcriptText) {
  try {
    // 1. Lấy context khách hàng
    const rawContext = await customerRepo.getCustomerContextByCustomerId(customerId);
    const compactContext = customerContextService.buildCompactCustomerContext(rawContext);

    // 2. Trích xuất Insight bằng LLM
    const insightJson = await extractCallInsight(transcriptText, compactContext);

    // 3. Lưu vào Database
    const insertQuery = `
      INSERT INTO call_insights
      (call_log_id, summary, customer_intent, main_issue, root_cause, sentiment_score, risk_level, follow_up_needed, action_items)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    await query(insertQuery, [
      callLogId,
      insightJson.summary,
      insightJson.customer_intent,
      insightJson.main_issue,
      insightJson.root_cause,
      insightJson.sentiment_score,
      insightJson.risk_level,
      insightJson.follow_up_needed,
      JSON.stringify(insightJson.action_items)
    ]);

    return insightJson;
  } catch (error) {
    console.error("Lỗi trong quá trình processAndSaveCallInsight:", error);
    throw error;
  }
}