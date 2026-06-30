import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

// Body parser
app.use(express.json({ limit: "10mb" }));

// Lazy initializer for GoogleGenAI
let aiInstance: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiInstance) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY environment variable is not set. API calls will fail.");
    }
    aiInstance = new GoogleGenAI({
      apiKey: apiKey || "MOCK_KEY",
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiInstance;
}

// ==========================================
// API ROUTES
// ==========================================

// 1. Analyze and extract content from a shared URL or simulated topic
app.post("/api/gemini/analyze-link", async (req, res) => {
  const { url, personalLevel, noteHabit } = req.body;

  if (!url) {
    return res.status(400).json({ error: "URL or topic is required" });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Analyze the target link or topic: "${url}".
The user's English level is "${personalLevel || "Intermediate"}" and their note-taking style is "${noteHabit || "Practical & Natural"}".
Generate a structured oral English speaking lesson based on the content. The focus must be on "底层逻辑 + 同境词" (Generic thinking logic + scene-bundled vocabulary).
Provide the response in raw JSON adhering to this exact schema:
{
  "sceneName": "An elegant, human-centric title of the speaking scenario",
  "category": "Daily, Business, Social, or Academic",
  "thinkingChainType": "descriptive (Scene Background -> Detail Actions -> Personal Feelings) OR interactive (Core Response -> Detail Supplement -> Toss back)",
  "thinkingChainDescription": "A step-by-step guideline teaching the user how to think and structure their thoughts for this scene",
  "expressions": [
    {
      "expression": "A high-frequency natural word or collocation used by native speakers",
      "standard": "The simple, literal, or slightly Chinese-English style translation of the concept",
      "native": "The authentic, natural mother-tongue expression (地道 > 复杂)",
      "memoryHook": "A mnemonic device (e.g., a pun, homophone 谐音, association 联想, or vivid imagery) to easily remember it",
      "example": "A practical example sentence in this scenario"
    }
  ],
  "speakingPracticePrompt": "An engaging, direct oral speaking prompt related to this scene that urges the user to record/write their response."
}
Do not include any Markdown or formatting wraps (like \`\`\`json). Output raw stringified JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText.trim()));
  } catch (error: any) {
    console.error("Error in analyze-link API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze the link" });
  }
});

// 2. Multimodal image analysis for speaking scenes (camera/upload)
app.post("/api/gemini/analyze-image", async (req, res) => {
  const { base64Image, mimeType } = req.body;

  if (!base64Image) {
    return res.status(400).json({ error: "Base64 image data is required" });
  }

  try {
    const ai = getGeminiClient();
    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: mimeType || "image/jpeg",
      },
    };

    const textPart = {
      text: `Analyze this image and identify the physical scene or situation.
Generate a custom oral English lesson for speaking practice in this scene. The content must emphasize natural expression, practical collocations ("同境词"), and a generic thinking chain.
Respond in JSON adhering strictly to this schema:
{
  "sceneName": "Descriptive title of the scene in the image",
  "sceneDescription": "Vivid detail of what is happening in the picture",
  "thinkingChain": "A sequential framework (e.g., Description: Background -> Key Details -> Sensation) to explain this scene orally",
  "expressions": [
    {
      "expression": "Collocation or word seen or highly relevant to the scene",
      "standard": "Basic standard expression",
      "native": "Authentic native high-frequency alternative",
      "memoryHook": "Creative rhyme or association hook",
      "example": "Scenario example sentence"
    }
  ],
  "speakingPracticePrompt": "A direct speaking prompt asking the user to answer an oral question regarding the image."
}
Output raw stringified JSON only.`,
    };

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [imagePart, textPart],
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText.trim()));
  } catch (error: any) {
    console.error("Error in analyze-image API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze image" });
  }
});

// 3. Spoken practice feedback and error correction (Solid Feedback)
app.post("/api/gemini/speaking-feedback", async (req, res) => {
  const { prompt, userAnswer, focusedExpressions } = req.body;

  if (!prompt || !userAnswer) {
    return res.status(400).json({ error: "Prompt and user answer are required" });
  }

  try {
    const ai = getGeminiClient();
    const formattedExpressions = (focusedExpressions || []).join(", ");
    const geminiPrompt = `You are a professional, encouraging oral English tutor.
The student received the following prompt: "${prompt}".
The student answered: "${userAnswer}".
The student is trying to utilize these accumulated expressions in their response: [${formattedExpressions}].

Evaluate the answer and provide thorough, constructive "solid feedback" focusing on natural flow, colloquial correctness, and "de-templatized" speech.
Produce a JSON response with this exact structure:
{
  "grammarErrors": [
    {
      "original": "The incorrect or awkward phrase",
      "correction": "The corrected or more natural alternative",
      "reason": "Clear, simple explanation in Chinese of why it was wrong or awkward"
    }
  ],
  "expressionsUsed": [
    {
      "expression": "Expression from the list that they used or tried to use",
      "status": "fully_correct, slightly_awkward, or missed",
      "feedback": "Brief feedback on how they utilized it"
    }
  ],
  "polishedVersion": "An authentic, natural mother-tongue level rewrite of their answer, using simple high-frequency vocabulary rather than overly academic words",
  "score": 85, // out of 100
  "encouragement": "A supportive closing tip in Chinese reminding them of key memory associations or speaking habits"
}
Output raw stringified JSON only.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: geminiPrompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText.trim()));
  } catch (error: any) {
    console.error("Error in speaking-feedback API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze speaking feedback" });
  }
});

// 4. NotebookLM Book mindmap and elite expressions extractor
app.post("/api/gemini/book-mindmap", async (req, res) => {
  const { bookName, chapterTopic } = req.body;

  const title = bookName || "English Speaking Bible";
  const topic = chapterTopic || "Advanced Conversational Nuances";

  try {
    const ai = getGeminiClient();
    const prompt = `You are mimicking a NotebookLM engine. The user is reading a book called "${title}" and focusing on the chapter/topic: "${topic}".
Generate a structured conceptual mindmap to organize speaking logic, along with highly condensed elite speaking collocations ("dry goods") extracted from this chapter.
Respond in JSON conforming to this schema:
{
  "title": "Comprehensive Topic Heading",
  "nodes": [
    {
      "id": "1",
      "label": "Central Theme",
      "details": "Core theme summary",
      "parent": null
    },
    {
      "id": "2",
      "label": "Sub-concept or Structure",
      "details": "Summary of speaking formula or pattern",
      "parent": "1"
    }
  ],
  "refinedDryGoods": [
    {
      "collocation": "The high frequency collocation",
      "usageNote": "A very quick practical guideline on when to say it",
      "nativeEquivalent": "A clean native contrast",
      "example": "Short example sentence"
    }
  ]
}
Return raw stringified JSON only. Ensure you have a central parent node and at least 4-5 child nodes for an elegant tree diagram.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText.trim()));
  } catch (error: any) {
    console.error("Error in book-mindmap API:", error);
    res.status(500).json({ error: error.message || "Failed to generate mindmap" });
  }
});

// ==========================================
// VITE AND STATIC ASSETS SERVING
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
