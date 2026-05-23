import dotenv from 'dotenv';
import OpenAI from 'openai';
import { ChromaClient } from 'chromadb';

dotenv.config();

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || 'sentimind_call_memory';
const EMBEDDING_MODEL = process.env.OPENAI_EMBEDDING_MODEL || 'text-embedding-3-small';

let chromaClient;
let collectionPromise;
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

function getChromaClient() {
  if (chromaClient) {
    return chromaClient;
  }

  chromaClient = new ChromaClient({ path: CHROMA_URL });
  return chromaClient;
}

async function getCollection() {
  if (!collectionPromise) {
    const client = getChromaClient();
    collectionPromise = client.getOrCreateCollection({ name: CHROMA_COLLECTION });
  }

  return collectionPromise;
}

function normalizeWhitespace(text) {
  return String(text || '').replace(/\s+/g, ' ').trim();
}

function chunkText(text, chunkSize = 1200, overlap = 200) {
  const normalized = normalizeWhitespace(text);
  if (!normalized) {
    return [];
  }

  if (chunkSize <= overlap) {
    return [normalized];
  }

  if (normalized.length <= chunkSize) {
    return [normalized];
  }

  const chunks = [];
  let start = 0;

  while (start < normalized.length) {
    const end = Math.min(start + chunkSize, normalized.length);
    chunks.push(normalized.slice(start, end));
    start += chunkSize - overlap;
  }

  return chunks;
}

async function embedTexts(texts) {
  const openai = getOpenAIClient();
  if (!openai) {
    return null;
  }

  const response = await openai.embeddings.create({
    model: EMBEDDING_MODEL,
    input: texts,
  });

  return response.data.map((item) => item.embedding);
}

async function embedText(text) {
  const embeddings = await embedTexts([text]);
  return embeddings ? embeddings[0] : null;
}

export function isRagConfigured() {
  return Boolean(getOpenAIClient());
}

export async function upsertCallMemory({
  callAiResponseId,
  transcript,
  response,
  customerId,
  callLogId,
  source = 'customer_assist',
}) {
  if (!isRagConfigured()) {
    return { success: false, reason: 'missing_openai_key' };
  }

  try {
    const combinedText = [
      'Transcript:',
      transcript,
      '',
      'Agent Response:',
      response,
    ].join('\n');

    const chunks = chunkText(combinedText);
    if (!chunks.length) {
      return { success: false, reason: 'empty_document' };
    }

    const embeddings = await embedTexts(chunks);
    if (!embeddings) {
      return { success: false, reason: 'embedding_failed' };
    }

    const ids = chunks.map((_, index) => `${callAiResponseId}:${index}`);
    const createdAt = new Date().toISOString();
    const metadatas = chunks.map((_, index) => {
      const metadata = {
        source,
        call_ai_response_id: String(callAiResponseId),
        chunk_index: index,
        created_at: createdAt,
      };

      if (customerId) {
        metadata.customer_id = String(customerId);
      }

      if (callLogId) {
        metadata.call_log_id = String(callLogId);
      }

      return metadata;
    });

    const collection = await getCollection();
    await collection.upsert({
      ids,
      documents: chunks,
      embeddings,
      metadatas,
    });

    return {
      success: true,
      vectorIdPrefix: String(callAiResponseId),
    };
  } catch (error) {
    console.warn('RAG upsert failed:', error.message || error);
    return { success: false, reason: 'upsert_failed' };
  }
}

export async function findRelevantCallMemory({ query, customerId, limit = 3 }) {
  if (!isRagConfigured()) {
    return [];
  }

  try {
    const embedding = await embedText(query);
    if (!embedding) {
      return [];
    }

    const collection = await getCollection();
    const where = customerId ? { customer_id: String(customerId) } : undefined;

    const result = await collection.query({
      queryEmbeddings: [embedding],
      nResults: limit,
      where,
    });

    const documents = result.documents?.[0] || [];
    const metadatas = result.metadatas?.[0] || [];
    const distances = result.distances?.[0] || [];

    return documents.map((document, index) => ({
      document,
      metadata: metadatas[index] || {},
      distance: distances[index] ?? null,
    }));
  } catch (error) {
    console.warn('RAG query failed:', error.message || error);
    return [];
  }
}

export default {
  findRelevantCallMemory,
  isRagConfigured,
  upsertCallMemory,
};
