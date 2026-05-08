import { Document } from "@langchain/core/documents";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const chunkSize = 800;
export const chunkOverlap = 150;

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize,
  chunkOverlap,
});

export async function chunkDocument(docs: Document[]): Promise<Document[]> {
  if (!docs.length) return [];

  const chunks = await splitter.splitDocuments(docs);

  return chunks.map((chunk, i) => {
    const base = chunk.metadata ?? {};

    return new Document({
      pageContent: chunk.pageContent.trim(),
      metadata: {
        ...base,
        source: base?.source ?? "unknown source",
        _chunkIndex: i,
      },
    });
  });
}
