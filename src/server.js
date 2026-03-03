import "dotenv/config";
import express from "express";
import cors from "cors";
import multer from "multer";
import fs from "fs";
import { createRequire } from "module";
import Tesseract from "tesseract.js";
import path from "path";

const require = createRequire(import.meta.url);
const pdfParse = require("pdf-parse");

import { loadAllActs } from "./loaders/actLoader.js";
import { loadAllQA } from "./loaders/qaLoader.js";
import { askLegalQuestion } from "./pipeline/askLegalQuestion.js";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: "1mb" }));

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 50 * 1024 * 1024 },
});

console.log("🔄 Loading legal datasets...");
const acts = loadAllActs();
const qaData = loadAllQA();
console.log("✅ Legal datasets loaded");

// 🔷 Health Endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    service: "LegalDoc AI Backend",
    llmMode: process.env.LLM_MODE || "offline",
  });
});

// 🔷 Main Ask Endpoint
app.post("/ask", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query || typeof query !== "string") {
      return res.status(400).json({
        error: "Query must be a valid string",
      });
    }

    const result = await askLegalQuestion(query, acts, qaData);

    res.json(result);
  } catch (error) {
    console.error("❌ Server error:", error.message);

    res.status(500).json({
      error: "Internal server error",
    });
  }
});

// 🔷 OCR Upload Endpoint
app.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const filePath = req.file.path;
    const ext = path.extname(req.file.originalname).toLowerCase();

    let extractedText = "";

    // 🔹 Case 1: PDF
    if (ext === ".pdf") {
      const dataBuffer = fs.readFileSync(filePath);
      const pdfData = await pdfParse(dataBuffer);
      extractedText = pdfData.text;
    }

    // 🔹 Case 2: Image (JPG/PNG)
    else if (ext === ".jpg" || ext === ".jpeg" || ext === ".png") {
      const result = await Tesseract.recognize(
        filePath,
        "eng+hin", // 🔥 English + Hindi support
        {
          logger: (m) => console.log(m.status),
        },
      );

      extractedText = result.data.text;
    } else {
      return res.status(400).json({
        error: "Unsupported file type",
      });
    }

    if (!extractedText || extractedText.length < 20) {
      return res.status(400).json({
        error: "Text extraction failed",
      });
    }

    // 🔥 Clean text
    extractedText = extractedText.replace(/\s+/g, " ").trim();

    // 🔥 Send to legal pipeline
    const result = await askLegalQuestion(
      extractedText.slice(0, 5000),
      acts,
      qaData,
    );

    fs.unlinkSync(filePath);

    res.json({
      languageSupport: "English + Hindi",
      extractedLength: extractedText.length,
      analysis: result,
    });
  } catch (error) {
    console.error("❌ OCR error:", error.message);
    res.status(500).json({ error: "Failed to process document" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
