import { SceneCategory } from "../types";

export interface ExtractedExpression {
  expression: string;
  standard: string;
  native: string;
  chinese: string;
  memoryHook: string;
  example: string;
}

export interface ExtractedCorpusItem {
  id: string;
  sourceName: string;
  sourceType: "document" | "link";
  extractedAt: string;
  sceneName: string;
  category: SceneCategory;
  thinkingChainType: "descriptive" | "interactive";
  thinkingChainDescription: string;
  speakingPracticePrompt: string;
  communicationLogic: string;
  collocations: ExtractedExpression[];
  functionalSentences: ExtractedExpression[];
  moodFillers: ExtractedExpression[];
  aiSupplements: ExtractedExpression[];
  originalNotesContent?: string;
}

const STORAGE_KEY = "oral_lab_extracted_corpus";

export function getExtractedCorpus(): ExtractedCorpusItem[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error("Failed to parse extracted corpus from localStorage", e);
    return [];
  }
}

export function saveToExtractedCorpus(item: Omit<ExtractedCorpusItem, "id" | "extractedAt">): ExtractedCorpusItem {
  const corpus = getExtractedCorpus();
  
  const newItem: ExtractedCorpusItem = {
    ...item,
    id: `extracted_${Date.now()}`,
    extractedAt: new Date().toISOString()
  };

  corpus.unshift(newItem); // Add to the top of the history list
  localStorage.setItem(STORAGE_KEY, JSON.stringify(corpus));
  return newItem;
}

export function deleteFromExtractedCorpus(id: string): void {
  const corpus = getExtractedCorpus();
  const updated = corpus.filter(item => item.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}
