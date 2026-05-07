import { Document } from "@langchain/core/documents";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { TextLoader } from "@langchain/classic/document_loaders/fs/text";

// Step 1 -> loading the raw file in a Document []
interface LoadFileargs {
  filePath: string;
  mimeType: string;
  originalName: string;
}

export async function loadFileAsDocuments(
  args: LoadFileargs,
): Promise<Document[]> {
  const { filePath, mimeType, originalName } = args;

  const extractExt = getExt(originalName);

  const isMarkdown =
    mimeType === "text/markdown" ||
    extractExt === "md" ||
    extractExt === "markdown";

  const isText = mimeType === "text/plain" || extractExt === "txt";

  const isPdf = mimeType === "application/pdf" || extractExt === "pdf";

  if (isPdf) {
    const loader = new PDFLoader(filePath);
    const docs = await loader.load();

    return docs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: originalName,
      },
    }));
  } else if (isText || isMarkdown) {
    const loader = new TextLoader(filePath);
    const docs = await loader.load();

    return docs.map((doc) => ({
      ...doc,
      metadata: {
        ...doc.metadata,
        source: originalName,
      },
    }));
  }

  // Handle unsupported mime-type(s)
  return [];
}

function getExt(name: string): string {
  const index = name.lastIndexOf(".");

  return index === -1 ? "" : name.slice(index + 1).toLowerCase();
}
