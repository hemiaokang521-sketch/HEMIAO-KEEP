import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
// @ts-ignore
import mammoth from "mammoth";

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

Evaluate the answer and provide thorough, constructive "solid feedback" focusing on natural flow, colloquial correctness, "de-templatized" speech, and oral delivery performance (fluency and intonation).
Since this is an oral response, analyze their text for rhythm, chunking, potential pronunciation stumbling blocks, word-stress patterns, and tone patterns (rising/falling).

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
  "fluencyScore": 88, // out of 100 representing oral delivery flow, coherence, and structural transitions
  "intonationScore": 82, // out of 100 representing rhythm, sentence stress, weak forms, and tone pattern recommendations
  "fluencyFeedback": "Detailed constructive analysis in Chinese about the user's speech coherence, transitions, and pacing suggestions.",
  "intonationFeedback": "Detailed constructive analysis in Chinese about word stress, rhythm, chunking (意群划分), rising/falling intonation, and where to apply liaisons (连读).",
  "speechSuggestions": [
    "A specific, actionable pronunciation or delivery recommendation in Chinese",
    "Another specific recommendation focusing on rhythm or connection of speech sounds"
  ],
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

// 5. Intelligent Document/Image Content Extractor
app.post("/api/gemini/analyze-document", async (req, res) => {
  const { fileData, fileName, mimeType, personalLevel, noteHabit } = req.body;

  if (!fileData) {
    return res.status(400).json({ error: "File data is required" });
  }

  try {
    let extractedText = "";
    let isDocx = false;

    // Check if it's a docx file that mammoth needs to process
    if (
      mimeType === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
      (fileName && fileName.endsWith(".docx"))
    ) {
      isDocx = true;
      const buffer = Buffer.from(fileData, "base64");
      const result = await mammoth.extractRawText({ buffer });
      extractedText = result.value;
    }

    const ai = getGeminiClient();

    let contents: any[] = [];

    const systemPrompt = `You are a professional language acquisition AI. The user has uploaded their personal note document or screenshot of English notes.
Your task is to:
1. Extract the main note text.
2. Group the notes into an elegant oral English speaking scenario (Scene). Categorize it as Daily, Business, Social, Academic, or Custom.
3. Perform semantic analysis on the content and compute a match score (0-100) for each of our preset categories: Daily, Business, Social, Academic, Custom. Provide a professional classification reason in Chinese explaining why it is assigned to the selected category.
4. Extract key collocations/expressions from the notes and "extend" them ("延展同境词") into authentic native collocations! For each expression, provide:
   - "expression": the natural phrase or collocation
   - "standard": a basic, literal, or slightly unnatural textbook phrasing of this concept (e.g., "I want to buy")
   - "native": the authentic native alternative (e.g., "Can I grab a...") (地道 > 复杂)
   - "memoryHook": a practical, witty mnemonic device (homophones, association 联想, etc.) in Chinese to remember it easily
   - "example": a realistic example sentence in this scenario
5. Generate 2-3 extra, highly valuable, and advanced co-contextual collocation suggestions ("同境词扩展建议") in the same scenario/category. They should not be directly in the original notes but are high-frequency words native speakers would use in this exact same context. Provide the same structure as step 4.
6. Organize a mindmap outlining the logical speaking flow of the topic/notes, with a root node and 4-5 child nodes.
7. Refine the core expressions into a quick "dry goods" (collocation, usageNote, nativeEquivalent, example) section.
8. Formulate an oral speaking practice prompt (提问) that tests the user's ability to speak in this scene based on the notes.

You MUST respond strictly in raw JSON adhering to this exact schema:
{
  "sceneName": "An elegant, descriptive title of the oral speaking scenario matching the note contents",
  "category": "Daily, Business, Social, Academic, or Custom",
  "classificationReason": "A detailed explanation in Chinese explaining why this content is semantically classified under this category",
  "classificationScores": {
    "Daily": 85,
    "Business": 20,
    "Social": 40,
    "Academic": 10,
    "Custom": 5
  },
  "thinkingChainType": "descriptive (for descriptive scenes) OR interactive (for conversational scenes)",
  "thinkingChainDescription": "A step-by-step thinking logic chain in Chinese (e.g. 背景铺垫 -> 矛盾行动 -> 终极建议)",
  "speakingPracticePrompt": "An engaging oral speaking prompt based directly on the extracted document notes that tests the user's active memory",
  "expressions": [
    {
      "expression": "A high-frequency native collocation or phrase extracted or extended from the notes",
      "standard": "How a textbook or Chinese-English student typically states this concept",
      "native": "How a real native speaker expresses it naturally (地道 > 复杂)",
      "memoryHook": "A witty, practical mnemonic (e.g., homophone, association) in Chinese to retain it forever",
      "example": "A real-world example sentence in this scenario"
    }
  ],
  "suggestedExtensions": [
    {
      "expression": "An advanced co-contextual collocation or phrase generated automatically that fits this specific category",
      "standard": "Textbook style",
      "native": "Fluent native-speaker alternative",
      "memoryHook": "Mnemonic helper in Chinese",
      "example": "Example sentence in context"
    }
  ],
  "mindmap": {
    "title": "Hierarchical Logic Mindmap of the Document Content",
    "nodes": [
      {
        "id": "1",
        "label": "Central Subject",
        "details": "Core subject description",
        "parent": null
      },
      {
        "id": "2",
        "label": "Key subconcept 1",
        "details": "Details about subconcept 1",
        "parent": "1"
      }
    ]
  },
  "refinedDryGoods": [
    {
      "collocation": "Key high-frequency collocation or idiom",
      "usageNote": "Usage instruction or situational tip on when to say this",
      "nativeEquivalent": "Standard colloquial phrasing",
      "example": "A practical example sentence"
    }
  ]
}

The user's English level is "${personalLevel || "Intermediate"}" and their note habit is "${noteHabit || "Practical & Natural"}".
Do not include any Markdown wrap. Output raw stringified JSON only.`;

    if (isDocx) {
      // For Word files, send extracted text
      contents = [
        {
          text: `${systemPrompt}\n\nHere is the extracted text from the Word document:\n${extractedText}`,
        },
      ];
    } else {
      // For PDF and images, leverage multimodal Gemini natively
      contents = [
        {
          inlineData: {
            data: fileData,
            mimeType: mimeType || "application/pdf",
          },
        },
        {
          text: systemPrompt,
        },
      ];
    }

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: {
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text || "{}";
    res.json(JSON.parse(jsonText.trim()));
  } catch (error: any) {
    console.error("Error in analyze-document API:", error);
    res.status(500).json({ error: error.message || "Failed to analyze document" });
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
