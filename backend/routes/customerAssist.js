import express from 'express';
import { isDbConfigured } from '../services/db/mysql.js';
import {
  getCustomerContextByCallLogId,
  getCustomerContextByCustomerId,
} from '../services/db/customerRepository.js';
import {
  createCallAiResponse,
  updateCallAiResponseVectorId,
} from '../services/db/callAiRepository.js';
import { buildCompactCustomerContext } from '../services/customerContextService.js';
import { generateCustomerAdvice } from '../services/llm/customerAdviceService.js';
import {
  findRelevantCallMemory,
  isRagConfigured,
  upsertCallMemory,
} from '../services/rag/ragService.js';

const router = express.Router();

router.post('/respond', async (req, res) => {
  try {
    const {
      transcript,
      customerId,
      callLogId,
      conversationHistory = [],
    } = req.body;

    if (!transcript || typeof transcript !== 'string') {
      return res.status(400).json({
        error: 'transcript is required and must be a string',
      });
    }

    if (!customerId && !callLogId) {
      return res.status(400).json({
        error: 'Either customerId or callLogId is required',
      });
    }

    if (!isDbConfigured()) {
      return res.status(503).json({
        error: 'Database is not configured',
        details: 'Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME before using customer-assist routes.',
      });
    }

    const rawCustomerContext = callLogId
      ? await getCustomerContextByCallLogId(callLogId)
      : await getCustomerContextByCustomerId(customerId);

    if (!rawCustomerContext) {
      return res.status(404).json({
        error: 'Customer context not found',
      });
    }

    const compactCustomerContext = buildCompactCustomerContext(rawCustomerContext);
    const customerContextId = compactCustomerContext.customer_profile?.customer_id;
    const ragMatches = await findRelevantCallMemory({
      query: transcript,
      customerId: customerContextId,
      limit: 3,
    });

    const advice = await generateCustomerAdvice({
      transcript,
      customerContext: compactCustomerContext,
      conversationHistory,
      retrievedContext: ragMatches,
    });

    let callAiResponseId = null;
    let vectorIdPrefix = null;
    const ragEnabled = isRagConfigured();

    try {
      const metadata = {
        ragEnabled,
        ragMatchCount: ragMatches.length,
      };

      callAiResponseId = await createCallAiResponse({
        customerId: customerContextId,
        callLogId,
        transcript,
        response: advice.response,
        model: advice.metadata?.model,
        source: 'customer_assist',
        usedFallback: advice.metadata?.usedFallback,
        metadata,
      });
    } catch (dbError) {
      console.error('Failed to store call AI response:', dbError);
    }

    if (callAiResponseId && ragEnabled) {
      try {
        const ragResult = await upsertCallMemory({
          callAiResponseId,
          transcript,
          response: advice.response,
          customerId: customerContextId,
          callLogId,
          source: 'customer_assist',
        });

        if (ragResult.success) {
          vectorIdPrefix = ragResult.vectorIdPrefix;
          await updateCallAiResponseVectorId(callAiResponseId, vectorIdPrefix);
        }
      } catch (ragError) {
        console.warn('RAG upsert failed:', ragError.message || ragError);
      }
    }

    res.json({
      success: true,
      response: advice.response,
      customerContext: compactCustomerContext,
      metadata: {
        ...advice.metadata,
        customerId: compactCustomerContext.customer_profile.customer_id,
        source: 'customer_context_plus_transcript',
        timestamp: new Date().toISOString(),
        rag: {
          enabled: ragEnabled,
          matchCount: ragMatches.length,
          vectorIdPrefix,
        },
      },
    });
  } catch (error) {
    console.error('Customer assist error:', error);
    res.status(500).json({
      error: 'Failed to generate customer-specific advice',
      details: error.message,
    });
  }
});

export default router;
