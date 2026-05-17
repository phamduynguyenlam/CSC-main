import express from 'express';
import { isDbConfigured } from '../services/db/mysql.js';
import {
  getCustomerContextByCallLogId,
  getCustomerContextByCustomerId,
} from '../services/db/customerRepository.js';
import { buildCompactCustomerContext } from '../services/customerContextService.js';
import { generateCustomerAdvice } from '../services/llm/customerAdviceService.js';

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
    const advice = await generateCustomerAdvice({
      transcript,
      customerContext: compactCustomerContext,
      conversationHistory,
    });

    res.json({
      success: true,
      response: advice.response,
      customerContext: compactCustomerContext,
      metadata: {
        ...advice.metadata,
        customerId: compactCustomerContext.customer_profile.customer_id,
        source: 'customer_context_plus_transcript',
        timestamp: new Date().toISOString(),
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
