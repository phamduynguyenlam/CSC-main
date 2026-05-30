import express from 'express';
import { isDbConfigured } from '../services/db/mysql.js';
import {
  createCustomerCallLog,
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

function trimSummary(text, maxLength = 220) {
  const normalized = typeof text === 'string'
    ? text.replace(/\s+/g, ' ').trim()
    : '';

  if (!normalized) {
    return '';
  }

  return normalized.length > maxLength
    ? `${normalized.slice(0, maxLength - 3)}...`
    : normalized;
}

function buildCallSummary(summary, transcript, fallbackSuggestion, emotion, keyIndicators = []) {
  const normalizedSummary = trimSummary(summary);
  const normalizedTranscript = typeof transcript === 'string'
    ? transcript.replace(/\s+/g, ' ').trim()
    : '';
  const normalizedSuggestion = trimSummary(fallbackSuggestion);

  if (normalizedSummary) {
    return normalizedSummary;
  }

  const normalizedEmotion = trimSummary(emotion, 40);
  const indicators = Array.isArray(keyIndicators)
    ? keyIndicators.filter(Boolean).slice(0, 2).join(', ')
    : '';

  if (normalizedEmotion || indicators) {
    const derivedSummary = [
      normalizedEmotion ? `Khách hàng ${normalizedEmotion.toLowerCase()}.` : '',
      indicators ? `Nội dung chính: ${indicators}.` : '',
      normalizedSuggestion ? `Hướng xử lý: ${normalizedSuggestion}` : '',
    ].filter(Boolean).join(' ');

    if (derivedSummary) {
      return trimSummary(derivedSummary);
    }
  }

  if (normalizedTranscript) {
    return trimSummary(normalizedTranscript);
  }

  if (normalizedSuggestion) {
    return normalizedSuggestion;
  }

  return 'Cuộc gọi vừa kết thúc, cần theo dõi thêm.';
}

function deriveResolutionStatus(priority, sentimentScore) {
  const normalizedPriority = String(priority || '').toLowerCase();
  const numericSentiment = Number(sentimentScore);

  if (normalizedPriority === 'cao' || normalizedPriority === 'high' || (!Number.isNaN(numericSentiment) && numericSentiment < 5)) {
    return 'follow_up';
  }

  return 'closed';
}

router.get('/context', async (req, res) => {
  try {
    const customerId = req.query.customerId ? Number(req.query.customerId) : null;
    const callLogId = req.query.callLogId ? Number(req.query.callLogId) : null;

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

    res.json({
      success: true,
      customerContext: compactCustomerContext,
      metadata: {
        source: 'customer_context_db',
        customerId: compactCustomerContext.customer_profile.customer_id,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Customer context fetch error:', error);
    res.status(500).json({
      error: 'Failed to fetch customer context',
      details: error.message,
    });
  }
});

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

router.post('/complete-call', async (req, res) => {
  try {
    const {
      transcript,
      customerId,
      summary,
      agentName = 'AI Live Analysis',
      callType = 'inbound',
      suggestion,
      emotion,
      keyIndicators,
      priority,
      sentimentScore,
    } = req.body;

    if (!customerId || Number.isNaN(Number(customerId))) {
      return res.status(400).json({
        error: 'customerId is required',
      });
    }

    if (!isDbConfigured()) {
      return res.status(503).json({
        error: 'Database is not configured',
        details: 'Set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME before using customer-assist routes.',
      });
    }

    const normalizedCustomerId = Number(customerId);
    const existingContext = await getCustomerContextByCustomerId(normalizedCustomerId);

    if (!existingContext) {
      return res.status(404).json({
        error: 'Customer context not found',
      });
    }

    const callSummary = buildCallSummary(summary, transcript, suggestion, emotion, keyIndicators);
    const resolutionStatus = deriveResolutionStatus(priority, sentimentScore);
    const callLogId = await createCustomerCallLog({
      customerId: normalizedCustomerId,
      agentName,
      callType,
      callSummary,
      resolutionStatus,
      nextFollowUpAt: null,
    });

    const updatedContext = await getCustomerContextByCustomerId(normalizedCustomerId);
    const compactCustomerContext = buildCompactCustomerContext(updatedContext);

    res.json({
      success: true,
      callLogId,
      callSummary,
      customerContext: compactCustomerContext,
      metadata: {
        source: 'customer_call_logs',
        customerId: normalizedCustomerId,
        timestamp: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error('Complete call error:', error);
    res.status(500).json({
      error: 'Failed to save completed call',
      details: error.message,
    });
  }
});

export default router;
