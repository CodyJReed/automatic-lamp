// Simple helper functions for model use

// kb_search
import * as z from "zod";
import { tool } from "langchain";
import { retrieveRelevantChunks } from "@/kb/05_retrieval";

export const kbSearchTool = tool(
  async ({ question, namespace = "default" }) => {
    const { docs, confidence } = await retrieveRelevantChunks(
      question,
      namespace,
      2,
    );

    const contexts = docs.map((doc) => {
      const source = (doc?.metadata?.source as string) || "unknown_source";
      const chunkId =
        (doc?.metadata?.chunkId as number) ??
        (doc?.metadata?._chunkIndex as number) ??
        0;

      const preview =
        doc.pageContent.length > 400
          ? doc.pageContent.slice(0, 400) + "..."
          : doc.pageContent;

      return {
        source,
        chunkId,
        preview,
      };
    });

    return {
      confidence,
      namespace,
      contexts,
    };
  },
  {
    name: "kb_search",
    description: "Search the documentation KB for relevant answers",
    schema: z.object({
      question: z
        .string()
        .describe(
          "User's question or follow up that must be answered from docs",
        ),
      namespace: z.string().describe("KB namespace to query"),
    }),
  },
);

export const agentTools = [ kbSearchTool ];
