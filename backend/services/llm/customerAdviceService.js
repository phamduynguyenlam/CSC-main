import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let openaiClient;

function getOpenAIClient() {
  if (openaiClient !== undefined) {
    return openaiClient;
  }

  if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key_here') {
    openaiClient = null;
    return openaiClient;
  }

  openaiClient = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  return openaiClient;
}

function buildSystemPrompt() {
  return [
    'You are a senior customer support advisor for call center agents.',
    'Your job is to read the current transcript and the customer context, then suggest the best next response for the agent.',
    'Use customer history only when it materially helps with empathy, prioritization, and resolution.',
    'Do not invent policies, order facts, or promises that are not present in the input.',
    'If the context suggests unresolved repeat issues, explicitly acknowledge that pattern.',
    'Return concise, actionable guidance in Markdown with these sections:',
    '1. Situation Summary',
    '2. Recommended Agent Response',
    '3. Next Best Actions',
    '4. Risk Flags',
  ].join(' ');
}

function buildUserPrompt({ transcript, customerContext, conversationHistory = [] }) {
  const historyText = conversationHistory.length
    ? conversationHistory
        .slice(-6)
        .map((entry) => `${entry.role}: ${entry.content}`)
        .join('\n')
    : 'No prior chat history.';

  return [
    'CURRENT TRANSCRIPT:',
    transcript,
    '',
    'CUSTOMER CONTEXT:',
    JSON.stringify(customerContext, null, 2),
    '',
    'RECENT CHAT HISTORY:',
    historyText,
    '',
    'Provide agent guidance for the current call. Keep it specific to this customer and this transcript.',
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

export async function generateCustomerAdvice({ transcript, customerContext, conversationHistory = [] }) {
  const openai = getOpenAIClient();

  if (!openai) {
    return {
      response: buildFallbackResponse(customerContext),
      metadata: {
        model: 'fallback',
        usedFallback: true,
      },
    };
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    temperature: 0.4,
    max_tokens: 700,
    messages: [
      {
        role: 'system',
        content: buildSystemPrompt(),
      },
      {
        role: 'user',
        content: buildUserPrompt({ transcript, customerContext, conversationHistory }),
      },
    ],
  });

  return {
    response: completion.choices?.[0]?.message?.content || 'No response generated.',
    metadata: {
      model: completion.model || 'gpt-4o-mini',
      usedFallback: false,
      usage: completion.usage || null,
    },
  };
}

export default {
  generateCustomerAdvice,
};
