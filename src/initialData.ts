import { SpeakingScene, NoteItem } from "./types";

export const INITIAL_SCENES: SpeakingScene[] = [
  {
    id: "scene_1",
    name: "Cafe Chat & Ordering",
    category: "Daily",
    thinkingChainType: "descriptive",
    thinkingChainDescription: "描述类思维链：场景背景 (Spotting the barista, noisy morning vibe) → 细节动作 (Grab a drink, customize sweetness/ice) → 个人感受 (That caffeine kick to jumpstart the day).",
    speakingPracticePrompt: "Describe your typical morning routine at a local coffee shop. How do you custom-order your favorite caffeine kick, and how does it make you feel?",
    tags: ["日常", "地道表达", "咖啡馆"]
  },
  {
    id: "scene_2",
    name: "Business Phone Screener",
    category: "Business",
    thinkingChainType: "interactive",
    thinkingChainDescription: "交流类思维链：回应核心 (Express excitement & show warmth) → 补充细节 (Pitch 1 sentence of your core strength) → 抛回话题 (Ask about the interviewer's availability).",
    speakingPracticePrompt: "An HR manager calls you for an unscheduled interview screener. How do you professionally introduce yourself, pitch your background, and politely schedule a longer call?",
    tags: ["商务", "面试", "求职", "地道表达"]
  },
  {
    id: "scene_3",
    name: "Expressing Unpopular Opinions",
    category: "Social",
    thinkingChainType: "interactive",
    thinkingChainDescription: "交流类思维链：回应核心 (Politely acknowledge the other's point) → 补充细节 (Present your logic with a contrasting scenario) → 抛回话题 (Gently ask if they see your side).",
    speakingPracticePrompt: "During a friendly dinner debate, someone says social media has completely ruined human relationships. How do you politely disagree and show a more balanced view?",
    tags: ["社交", "日常", "地道表达", "沟通技巧"]
  }
];

export const INITIAL_NOTES: NoteItem[] = [
  {
    id: "note_1_1",
    sceneId: "scene_1",
    expression: "Can I grab a...",
    standard: "I want to buy a coffee (中式口语/死板表达)",
    native: "Can I grab a medium latte to go? (地道/高频)",
    memoryHook: "联想法：‘Grab’就像是顺手一捞，极具动感，比死板的‘buy’或‘want’更具日常烟火气，母语者早晨赶时间最爱说这个！",
    example: "Hey morning! Can I grab an iced Americano with an extra shot to go?",
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), // 2 days ago (due for review)
    ebbinghaus: {
      stage: 1,
      nextReviewDate: new Date().toISOString(), // Due now
      reviewHistory: [
        { date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(), success: true }
      ]
    }
  },
  {
    id: "note_1_2",
    sceneId: "scene_1",
    expression: "Easy on the...",
    standard: "Put less ice inside (直白生硬)",
    native: "Go easy on the ice, please. (温柔地道)",
    memoryHook: "谐音记忆：‘Easy’就是‘放手’，对冰块（ice）温柔一点、下手轻一点。多点咖啡，少点冰！",
    example: "Can I get an iced matcha latte, but go easy on the ice and syrup?",
    createdAt: new Date().toISOString(),
    ebbinghaus: {
      stage: 0,
      nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // Tomorrow
      reviewHistory: []
    }
  },
  {
    id: "note_2_1",
    sceneId: "scene_2",
    expression: "Walk you through...",
    standard: "Tell you about my resume (生硬中式)",
    native: "Let me walk you through my project background. (专业自然)",
    memoryHook: "画面联想：‘Walk through’就像是牵着对方的手，在你的履历花园里漫步。不用干巴巴地‘背简历’，而是带对方‘走一圈’。",
    example: "I'd love to walk you through some of the marketing campaigns I led last year.",
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(), // 1 day ago
    ebbinghaus: {
      stage: 0,
      nextReviewDate: new Date().toISOString(), // Due now
      reviewHistory: []
    }
  },
  {
    id: "note_2_2",
    sceneId: "scene_2",
    expression: "Align with your schedule",
    standard: "If you have time (普通白开水)",
    native: "I'll see if that aligns with your schedule. (职场高级)",
    memoryHook: "词义拆解：‘Align’是‘对齐/排列’，把我的时间拼图和你的时间拼图拼在一起。职场沟通瞬间高大上！",
    example: "Does 3 PM next Tuesday align with your schedule, or is Wednesday morning better?",
    createdAt: new Date().toISOString(),
    ebbinghaus: {
      stage: 0,
      nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      reviewHistory: []
    }
  },
  {
    id: "note_3_1",
    sceneId: "scene_3",
    expression: "I see where you're coming from, but...",
    standard: "I disagree with you (太绝对、不委婉)",
    native: "I see where you're coming from, but I look at it slightly differently. (双赢沟通)",
    memoryHook: "空间联想：‘Where you are coming from’表示‘你来时的路/你的立足点’。我能看到你站的地方，但我转个身，看到了另一个视角。",
    example: "I see where you're coming from, but offline relationships have their own irreplaceability.",
    createdAt: new Date().toISOString(),
    ebbinghaus: {
      stage: 0,
      nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
      reviewHistory: []
    }
  }
];
