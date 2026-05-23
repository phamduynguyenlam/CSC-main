import { query } from './mysql.js';

export async function createCallAiResponse({
  customerId,
  callLogId,
  transcript,
  response,
  model,
  source,
  usedFallback,
  vectorId,
  metadata,
}) {
  const result = await query(
    `INSERT INTO call_ai_responses (
        customer_id,
        call_log_id,
        transcript,
        response,
        model,
        source,
        used_fallback,
        vector_id,
        metadata
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      customerId ?? null,
      callLogId ?? null,
      transcript,
      response,
      model ?? null,
      source ?? null,
      usedFallback ? 1 : 0,
      vectorId ?? null,
      metadata ? JSON.stringify(metadata) : null,
    ]
  );

  return result.insertId;
}

export async function updateCallAiResponseVectorId(callAiResponseId, vectorId) {
  await query(
    `UPDATE call_ai_responses
     SET vector_id = ?
     WHERE call_ai_response_id = ?`,
    [vectorId, callAiResponseId]
  );
}

export default {
  createCallAiResponse,
  updateCallAiResponseVectorId,
};
