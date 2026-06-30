export type SceneCategory = "Daily" | "Business" | "Social" | "Academic" | "Custom";

export interface NoteItem {
  id: string;
  expression: string;
  standard: string;
  native: string;
  memoryHook: string;
  example: string;
  sceneId: string;
  createdAt: string;
  // Ebbinghaus Memory Curve States
  ebbinghaus: {
    stage: number; // 0 to 7 (repetition intervals: 1d, 2d, 4d, 7d, 15d, 30d, 60d)
    nextReviewDate: string; // ISO string
    reviewHistory: Array<{
      date: string;
      success: boolean;
    }>;
  };
}

export interface SpeakingScene {
  id: string;
  name: string;
  category: SceneCategory;
  thinkingChainType: "descriptive" | "interactive";
  thinkingChainDescription: string;
  speakingPracticePrompt: string;
  isCustom?: boolean;
}

export interface PracticeLog {
  id: string;
  sceneId: string;
  sceneName: string;
  prompt: string;
  userAnswer: string;
  polishedVersion: string;
  grammarErrors: Array<{
    original: string;
    correction: string;
    reason: string;
  }>;
  score: number;
  encouragement: string;
  createdAt: string;
}

export interface MindmapNode {
  id: string;
  label: string;
  details: string;
  parent: string | null;
}

export interface RefinedDryGoods {
  collocation: string;
  usageNote: string;
  nativeEquivalent: string;
  example: string;
}

export interface BookAnalysisResult {
  title: string;
  nodes: MindmapNode[];
  refinedDryGoods: RefinedDryGoods[];
}
