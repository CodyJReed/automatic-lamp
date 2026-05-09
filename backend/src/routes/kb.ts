import { loadFileAsDocuments } from "@/kb/01_loaders";
import { chunkDocument } from "@/kb/02_chunker";
import { ingestDocuments } from "@/kb/04_ingest";
import { Router } from "express";
import multer from "multer";

export const kbRouter = Router();

const upload = multer({
  dest: "uploads",
  limits: {
    fileSize: 10 * 1021 * 1024,
  },
});

kbRouter.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const namespace = "default";

    if (!req.file) {
      return res.status(400).json({
        ok: false,
        message: "No file uploaded.",
      });
    }

    const { path, mimetype, originalname } = req.file;
    // First step... upload
    const rawDocs = await loadFileAsDocuments({
      filePath: path,
      mimeType: mimetype,
      originalName: originalname,
    });

    if (!rawDocs.length) {
      return res.status(400).json({
        ok: false,
        message: "No file uploaded. Unsupported or empty file",
      });
    }
    // Second step... chunk
    const chunks = await chunkDocument(rawDocs);

    if (!chunks.length) {
      return res.status(400).json({
        ok: false,
        message: "File uploaded, produced no usable data.",
      });
    }

    // Step 3 ingest in vector DB
    const summary = await ingestDocuments(namespace, chunks);

    // Return summary from ingestion
    return res.status(200).json(summary);
  } catch (e) {
    res.status(500).json({
      message: "Something went wrong while uploading file.",
      success: false,
    });
  }
});
