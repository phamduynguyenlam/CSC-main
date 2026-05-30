import dotenv from 'dotenv';
import { pipeline } from '@xenova/transformers';
import { ChromaClient } from 'chromadb';

dotenv.config();

const CHROMA_URL = process.env.CHROMA_URL || 'http://localhost:8000';
const CHROMA_COLLECTION = process.env.CHROMA_COLLECTION || 'sentimind_call_memory';
const EMBEDDING_MODEL = 'Xenova/all-MiniLM-L6-v2';

let chromaClient;
let collectionPromise;
let embedderPromise;

async function getEmbedder() {
  if (!embedderPromise) {
    embedderPromise = pipeline('feature-extraction', EMBEDDING_MODEL);
  }

  return embedderPromise;
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
  if (!texts?.length) {
    return [];
  }

  const embedder = await getEmbedder();
  if (!embedder) {
    return null;
  }

  const embeddings = [];

  for (const text of texts) {
    const output = await embedder(text, {
      pooling: 'mean',
      normalize: true,
    });

    const vector = Array.from(output?.data || []);
    if (!vector.length) {
      return null;
    }

    embeddings.push(vector);
  }

  return embeddings;
}

async function embedText(text) {
  const embeddings = await embedTexts([text]);
  return embeddings ? embeddings[0] : null;
}

export function isRagConfigured() {
  return Boolean(CHROMA_URL && CHROMA_COLLECTION);
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
    return { success: false, reason: 'missing_chroma_configuration' };
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
      // Note: the HTTP API does not accept 'ids' in the include list (it returns 422).
      include: ['documents', 'metadatas', 'distances', 'embeddings'],
    });

    const documents = result.documents?.[0] || [];
    const metadatas = result.metadatas?.[0] || [];
    const distances = result.distances?.[0] || [];
    const embeddings = result.embeddings?.[0] || [];
    const ids = result.ids?.[0] || [];

    // Log retrieved documents and their vectors (truncate vectors for readability)
    try {
      const logged = documents.map((doc, idx) => ({
        id: ids[idx] || null,
        document: doc,
        metadata: metadatas[idx] || {},
        distance: distances[idx] ?? null,
        embeddingPreview: Array.isArray(embeddings[idx]) ? embeddings[idx].slice(0, 8) : null,
      }));

      console.info('RAG query:', { query: normalizeWhitespace(query), results: logged });
    } catch (logErr) {
      console.warn('Failed to log RAG results:', logErr.message || logErr);
    }

    return documents.map((document, index) => ({
      id: ids[index] || null,
      document,
      metadata: metadatas[index] || {},
      distance: distances[index] ?? null,
      embedding: embeddings[index] || null,
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
