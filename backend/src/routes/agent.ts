import { runProductAgent } from "@/agent/03_agent";
import { Router } from "express";

export const agentRouter = Router();

agentRouter.post("/chat", async (req, res) => {
  try {
    const { message } = req.body as {
      message?: string;
    };

    if (!message || !message.trim()) {
      return res.status(400).json({
        message: "Message is required.",
      });
    }

    const userMessage = {
      role: "user" as const,
      content: message.trim(),
    };

    const { answer, citations } = await runProductAgent([userMessage]);

    return res.status(200).json({
      ok: true,
      answer,
      citations,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).json({
      message: "Some error occurred.",
    });
  }
});
