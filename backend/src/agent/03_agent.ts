// Define the exact response we want from the agent...
// this is where structured response matters

import { chatModel } from "@/utils/google";
import { createAgent, providerStrategy, toolStrategy } from "langchain";
import * as z from "zod";
import { agentTools } from "./02_tools";
import { AGENT_SYSTEM_PROMPT } from "./01_policy";

const AgentResponse = z.object({
  answer: z.string(),
  citations: z.array(
    z.object({
      source: z.string(),
      preview: z.string(),
      chunkId: z.number(),
    }),
  ),
});

export const productAgent = createAgent({
  model: chatModel,
  tools: agentTools,
  systemPrompt: AGENT_SYSTEM_PROMPT,
  responseFormat: toolStrategy(AgentResponse),
});

export async function runProductAgent(
  messages: { role: string; content: string }[],
): Promise<{ answer: string; citations: any }> {
  const result: any = await productAgent.invoke({ messages });

  console.log('response from agent', result)

  if (result?.structuredResponse) {
    return {
      answer: result.structuredResponse,
      citations: result?.structuredResponse?.citations ?? [],
    };
  }

  // fallback incase structured response is not present
  return {
    answer: "",
    citations: [],
  };
}
