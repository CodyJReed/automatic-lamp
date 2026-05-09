import { Document } from "mongodb";
import { getVectoreStore } from "./03_vectorStore";

export interface RetrievalResult {
  docs: Document[];
  confidence: number;
}

export async function retrieveRelevantChunks(
  query: string,
  namespace: string = "default",
  k: number = 2,
): Promise<RetrievalResult> {
  if (!query.trim()) {
    return {
      docs: [],
      confidence: 0,
    };
  }

  const vectorStore = await getVectoreStore();

  const results = await vectorStore.similaritySearchWithScore(query, k, {
    namespace,
  });

  if (!results?.length) {
    return {
      docs: [],
      confidence: 0,
    };
  }

  const docs: Document[] = results.map(([doc]) => doc);

//   Compose confidence by taking the best score...
  const scores = results.map(([_, score]) => score);
  const best = Math.max(...scores);
  const normalized = Math.max(0, Math.min(1, best));
  const confidence = Number(normalized.toFixed(2));

  return {
    docs,
    confidence,
  };
}
