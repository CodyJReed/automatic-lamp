export interface KBChunk {
  namespace: string;
  source: string;
  chunkId: number;
  text: string;
  // embedding dimensions * 3072 <- google
  embedding: number[];
}


