import { env } from "./env";
import { ChatGoogleGenerativeAI,GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { TaskType } from "@google/generative-ai";

export const chatModel =  new ChatGoogleGenerativeAI({
        apiKey: env.GOOGLE_API_KEY,
        model: "gemini-2.5-flash-lite",
        temperature: 0.2,
      });

export const embeddings = new GoogleGenerativeAIEmbeddings({
    apiKey: env.GOOGLE_API_KEY,
    model: "gemini-embedding-001",
    taskType: TaskType.RETRIEVAL_DOCUMENT,
  });