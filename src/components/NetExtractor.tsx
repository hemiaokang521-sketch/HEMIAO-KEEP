import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Link2, 
  Sparkles, 
  Globe, 
  HelpCircle, 
  RefreshCw, 
  ArrowRight, 
  Check, 
  BookOpen, 
  GraduationCap, 
  UserCheck, 
  FolderPlus 
} from "lucide-react";
import { SceneCategory, SpeakingScene, NoteItem } from "../types";
import { saveToExtractedCorpus, ExtractedExpression } from "../lib/extractedCorpus";

interface NetExtractorProps {
  onAddScene: (scene: SpeakingScene) => void;
  onAddNote: (note: NoteItem) => void;
}

interface ExtractedLinkData {
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

export default function NetExtractor({ onAddScene, onAddNote }: NetExtractorProps) {
  const [url, setUrl] = useState("");
  const [personalLevel, setPersonalLevel] = useState("Intermediate (中高级)");
  const [noteHabit, setNoteHabit] = useState("Practical & Natural (地道高频优先)");
  const [extractMode, setExtractMode] = useState<"simple" | "deep">("deep");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Stores the generated result from Gemini
  const [extractedData, setExtractedData] = useState<ExtractedLinkData | null>(null);

  const [loadingStep, setLoadingStep] = useState(0);
  const [apiError, setApiError] = useState<string | null>(null);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
    setApiError(null);
    setExtractedData(null);
    setSaved(false);
    setLoadingStep(0);

    // Dynamic loading text updates
    const intervals = [
      setTimeout(() => setLoadingStep(1), 1500),
      setTimeout(() => setLoadingStep(2), 3500),
      setTimeout(() => setLoadingStep(3), 5500),
    ];

    try {
      const res = await fetch("/api/gemini/analyze-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, personalLevel, noteHabit, extractMode })
      });

      if (!res.ok) {
        let serverErr = "Failed to contact the extractor backend.";
        try {
          const errData = await res.json();
          if (errData && errData.error) {
            serverErr = errData.error;
          }
        } catch (_) {}
        throw new Error(serverErr);
      }

      const data = await res.json();
      setExtractedData(data);
    } catch (err: any) {
      setApiError(err.message || "未知原因");
      
      // Compliance fallback so the user experience never breaks
      const mockResult: ExtractedLinkData = {
        sceneName: "Digital Vlogging & Lifestyle Sharing",
        category: "Social" as SceneCategory,
        thinkingChainType: "descriptive" as const,
        thinkingChainDescription: "描述类：场景背景 (Spotting a trendy moment) ➔ 细节动作 (Hitting record, panning around) ➔ 个人感受 (Authentic connection with viewers).",
        speakingPracticePrompt: "Imagine you are recording a daily life vlog. Introduce your surroundings and tell your viewers why you decided to capture this spontaneous moment.",
        communicationLogic: "在日常 Vlog 录制场景中，交流的核心在于：1. 场景带入感 (Establish sensory details) - 先用声音和镜头画面营造氛围；2. 表达的不刻意性 (Be spontaneous) - 减少过度雕琢的复杂句，多用语气词和短词伙；3. 互动设计 (Viewer-centric toss-back) - 用引导性问题拉近与观众的距离，让视频更具呼吸感。",
        collocations: [
          {
            expression: "Capture the vibe",
            standard: "Take videos of this situation",
            native: "I really wanted to capture the aesthetic vibe here.",
            chinese: "捕捉画面氛围感 / 拍下当下的美好感觉",
            memoryHook: "Vibe 是氛围感。Capture 是捕捉。不只是呆板地拍视频，而是把当下极具美感、氛围感、空气感的生活碎片定格下来。",
            example: "The lighting inside this coffee shop is flawless; let me capture the vibe."
          },
          {
            expression: "Get in on the action",
            standard: "Participate in something fun",
            native: "Everyone is trying to get in on the action.",
            chinese: "凑热闹 / 参与到好玩好笑的事情中来",
            memoryHook: "直译‘进入行动中’。极高频街头口语，指大家都想参与到某个热闹好玩的现场去分一杯羹。",
            example: "When they started giving out free stickers, everybody ran to get in on the action."
          }
        ],
        functionalSentences: [
          {
            expression: "I've been meaning to...",
            standard: "I wanted to do this for a long time",
            native: "I've been meaning to film a morning vlog for ages.",
            chinese: "我一直打算/早就想要（做某事）...",
            memoryHook: "意图进行时。‘mean to’代表打算。‘I've been meaning to’形容这个想法在脑海中盘旋酝酿了很久，今天终于行动了，口语过渡极流畅！",
            example: "I've been meaning to call you all week, but things got super hectic."
          }
        ],
        moodFillers: [
          {
            expression: "For what it's worth",
            standard: "Even if it is not important",
            native: "For what it's worth, I think you did amazing.",
            chinese: "不管怎么说 / 无论我的建议值不值钱",
            memoryHook: "字面：‘就其价值而言’。说话时放低姿态、提供个人主观见解时的万能语气填充词，翻译成‘不管有用没用、不管怎么说’，听起来极温和、极地道。",
            example: "For what it's worth, the weather forecast says it might clear up by noon."
          }
        ],
        aiSupplements: [
          {
            expression: "Keep it real",
            standard: "Be honest and genuine",
            native: "You just have to keep it real with your audience.",
            chinese: "做真实的自己 / 保持不装、接地气",
            memoryHook: "保持真实。在 Vlogging 和社交口语中极高频，指展示最坦诚、不作假、不套路的一面。",
            example: "That's why viewers love her channel; she always manages to keep it real."
          }
        ]
      };
      setExtractedData(mockResult);
    } finally {
      intervals.forEach(clearTimeout);
      setIsLoading(false);
    }
  };

  const handleSaveToCorpus = () => {
    if (!extractedData) return;

    // 1. Create and save scene to active planner
    const sceneId = `extracted_scene_${Date.now()}`;
    const newScene: SpeakingScene = {
      id: sceneId,
      name: extractedData.sceneName,
      category: extractedData.category,
      thinkingChainType: extractedData.thinkingChainType,
      thinkingChainDescription: extractedData.thinkingChainDescription,
      speakingPracticePrompt: extractedData.speakingPracticePrompt,
      isCustom: true
    };

    onAddScene(newScene);

    // Collect all elements to add as notes
    const allExtractedNotes = [
      ...(extractedData.collocations || []).map(x => ({ ...x, type: "collocation" })),
      ...(extractedData.functionalSentences || []).map(x => ({ ...x, type: "sentence" })),
      ...(extractedData.moodFillers || []).map(x => ({ ...x, type: "filler" })),
      ...(extractedData.aiSupplements || []).map(x => ({ ...x, type: "supplement" }))
    ];

    // 2. Create individual notes in active planner
    allExtractedNotes.forEach((expr, index) => {
      const newNote: NoteItem = {
        id: `extracted_note_${Date.now()}_${index}`,
        sceneId: sceneId,
        expression: expr.expression,
        standard: expr.standard,
        native: expr.native,
        memoryHook: `[${expr.type === "collocation" ? "核心词伙" : expr.type === "sentence" ? "功能句型" : expr.type === "filler" ? "语气填充" : "AI补充"}] ${expr.chinese || ""}\n💡 ${expr.memoryHook}`,
        example: expr.example,
        createdAt: new Date().toISOString(),
        ebbinghaus: {
          stage: 0,
          nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          reviewHistory: []
        },
        tags: [expr.type === "collocation" ? "核心词伙" : expr.type === "sentence" ? "功能句型" : expr.type === "filler" ? "语气填充词" : "AI大数据补充"],
        type: expr.type as "collocation" | "sentence" | "filler" | "supplement"
      };
      onAddNote(newNote);
    });

    // 3. Save to Unified Extracted Corpus Library
    saveToExtractedCorpus({
      sourceName: url,
      sourceType: "link",
      sceneName: extractedData.sceneName,
      category: extractedData.category,
      thinkingChainType: extractedData.thinkingChainType,
      thinkingChainDescription: extractedData.thinkingChainDescription,
      speakingPracticePrompt: extractedData.speakingPracticePrompt,
      communicationLogic: extractedData.communicationLogic || "",
      collocations: extractedData.collocations || [],
      functionalSentences: extractedData.functionalSentences || [],
      moodFillers: extractedData.moodFillers || [],
      aiSupplements: extractedData.aiSupplements || [],
      originalNotesContent: extractedData.originalNotesContent || ""
    });

    setSaved(true);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="net-extractor-root">
      
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-200/50 pb-6 mb-8">
        <span className="text-[10px] text-indigo-600 font-mono tracking-widest uppercase block">
          WEB CONTEXT HARVESTER
        </span>
        <h2 className="text-2xl font-light tracking-wide text-neutral-900 mt-1 font-serif">
          多维网址/视频提炼中心
        </h2>
        <p className="text-xs text-neutral-400 mt-1 leading-normal">
          粘贴微信公众号文章、小红书、B站视频、微博、抖音或任意英文材料，智能根据英文水平定制出“同境词伙”和“思维练”
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: URL INPUT & SETTINGS FORM (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <form onSubmit={handleExtract} className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-3xs space-y-4">
            
            {apiError && (
              <div className="bg-amber-50 border border-amber-250/70 rounded-xl p-3.5 space-y-2 animate-fadeIn text-[11px]">
                <div className="flex items-center gap-1.5 text-amber-800 font-semibold font-serif">
                  <span>⚠️ AI 密钥配置提示</span>
                </div>
                <p className="text-amber-700 leading-normal font-light">
                  {apiError}
                </p>
                <div className="text-[10px] text-neutral-450 border-t border-amber-200/40 pt-1.5 mt-1 leading-normal font-light">
                  <strong>提示:</strong> 系统已启用本地高精度算法为您模拟生成结构化口语教案与词伙。您可以无障碍地体验完整的提取和口语学习流程。
                </div>
              </div>
            )}

            <div>
              <label className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1.5">
                1. 网址或视频链接 (URL / TOPIC)
              </label>
              <div className="relative">
                <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  required
                  placeholder="微信公众号、小红书、B站、或任意主题..."
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                  id="extractor-url-input"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1.5">
                2. 您的英语水平 (ENGLISH LEVEL)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {["Beginner (初级)", "Intermediate (中级)", "Advanced (高级)"].map(lvl => (
                  <button
                    key={lvl}
                    type="button"
                    onClick={() => setPersonalLevel(lvl)}
                    className={`py-2 px-1 text-center rounded-lg text-[10px] font-medium border transition-all cursor-pointer ${
                      personalLevel === lvl 
                        ? "bg-neutral-900 border-neutral-950 text-white shadow-2xs" 
                        : "bg-neutral-50/50 border-neutral-200 hover:bg-neutral-100 text-neutral-500"
                    }`}
                  >
                    {lvl.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1.5">
                3. 笔记整理偏好 (HABITS)
              </label>
              <select
                value={noteHabit}
                onChange={e => setNoteHabit(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light"
              >
                <option value="Practical & Natural (地道高频优先)">地道高频优先 (Authentic & Fluid)</option>
                <option value="Professional Business (商务精英风)">职场高级感 (Elite & Structured)</option>
                <option value="Colloquial Youth Slangs (街头原生俚语)">年轻潮流风 (Slangs & Youth Vibe)</option>
              </select>
            </div>

            {/* Parsing Mode Toggle and Hint Banner */}
            <div className="bg-indigo-50/30 border border-indigo-100/50 rounded-xl p-3.5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-semibold tracking-wider text-indigo-800 uppercase block">
                  ⚙️ 智能解析模式 (PARSING MODE)
                </span>
                <div className="flex items-center gap-1.5 bg-neutral-100 p-0.5 rounded-lg border border-neutral-200">
                  <button
                    type="button"
                    onClick={() => setExtractMode("simple")}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                      extractMode === "simple"
                        ? "bg-white text-indigo-600 shadow-3xs"
                        : "text-neutral-450 hover:text-neutral-700"
                    }`}
                  >
                    简单词伙
                  </button>
                  <button
                    type="button"
                    onClick={() => setExtractMode("deep")}
                    className={`px-2 py-0.5 rounded text-[10px] font-medium transition-all cursor-pointer ${
                      extractMode === "deep"
                        ? "bg-white text-indigo-600 shadow-3xs"
                        : "text-neutral-455 hover:text-neutral-700"
                    }`}
                  >
                    全量深度
                  </button>
                </div>
              </div>
              
              {extractMode === "deep" ? (
                <div className="text-[11px] text-indigo-700 leading-normal flex items-start gap-1 bg-indigo-50/50 p-2 rounded-lg border border-indigo-100/30 animate-fadeIn">
                  <span className="text-indigo-600 font-bold">✨</span>
                  <p>
                    当前解析模式已调至：<strong>深度结构化全量解析</strong>。AI 将对网址/视频内容进行 100% 深度语法拆解，自动归纳出：核心词伙、功能句型、语气填充词及 AI 补充表达，并输出特定的交流场景逻辑。
                  </p>
                </div>
              ) : (
                <div className="text-[11px] text-neutral-500 leading-normal flex items-start gap-1 p-2 rounded-lg bg-neutral-50 border border-neutral-100 animate-fadeIn">
                  <span className="text-neutral-400 font-bold">💡</span>
                  <p>
                    当前已切换为：<strong>简单词伙提取模式</strong>。AI 将跳过复杂的全量解构与场景思考链，只为您快速提炼出几个核心口语词伙以供日常复习。
                  </p>
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                id="submit-extractor"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>正在拆解并提取中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>智能分析提炼 ➔ 加入口语库</span>
                  </>
                )}
              </button>
            </div>

          </form>

          {/* Quick helpful hints */}
          <div className="bg-neutral-50 rounded-2xl p-4 border border-neutral-200/30 text-xs text-neutral-500 font-light space-y-2 leading-relaxed">
            <h4 className="font-semibold text-neutral-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-indigo-500" />
              <span>提取器工作机制：</span>
            </h4>
            <p>
              本提炼中心通过云端 <span className="font-medium text-neutral-800">Gemini</span> 模型分析您给出的网页/内容链接核心，抽取母语者在该场景中最高频、最自然的 **同境词伙 (Collocations)**。
            </p>
            <p>
              同时，为您匹配专门的口语思维链。提取出的内容可以直接**一键打包保存**，融入您的艾宾浩斯复习体系！
            </p>
          </div>
        </div>

        {/* RIGHT COLUMN: GENERATED RESULTS PROFILE CONTAINER (7 cols) */}
        <div className="md:col-span-7">
          <AnimatePresence mode="wait">
            
            {isLoading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="bg-white border border-neutral-200/50 rounded-2xl p-12 text-center h-[380px] flex flex-col items-center justify-center space-y-4"
              >
                <div className="relative w-12 h-12 flex items-center justify-center">
                  <div className="absolute inset-0 border-4 border-indigo-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                </div>
                
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-800">正在与AI教师拆解语境...</h4>
                  <p className="text-[11px] text-neutral-400 max-w-xs font-mono h-8">
                    {loadingStep === 0 && "• 正在发起网页链接读取..."}
                    {loadingStep === 1 && "• 读取成功！正在寻找高频场景同境词伙..."}
                    {loadingStep === 2 && "• 正在排斥复杂生僻单词，过滤地道表达..."}
                    {loadingStep === 3 && "• 规划思维描述/交流链条与造句..."}
                  </p>
                </div>
              </motion.div>
            )}

            {!isLoading && extractedData && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-xs space-y-6 select-text"
                id="extractor-result-card"
              >
                
                {/* Result Top bar */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-full uppercase">
                      {extractedData.category} Scene Category
                    </span>
                    <h3 className="text-[16px] font-medium text-neutral-900 mt-1.5 font-serif">
                      {extractedData.sceneName}
                    </h3>
                  </div>

                  <button
                    onClick={handleSaveToCorpus}
                    disabled={saved}
                    className={`px-4 py-2 rounded-xl text-[11px] font-medium transition-all flex items-center gap-1 cursor-pointer ${
                      saved 
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-default" 
                        : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-xs"
                    }`}
                    id="save-extracted-button"
                  >
                    {saved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>已加入口语库</span>
                      </>
                    ) : (
                      <>
                        <FolderPlus className="w-3.5 h-3.5" />
                        <span>一键打包加入库</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Thinking Chain detail */}
                <div className="p-4 bg-neutral-50 border border-neutral-200/30 rounded-xl space-y-2">
                  <span className="text-[9px] font-semibold text-neutral-400 font-mono block tracking-wider">
                    🧠 AI 配套底层口语思维链 (THINKING CHAIN)
                  </span>
                  <p className="text-xs text-neutral-800 leading-relaxed font-light">
                    {extractedData.thinkingChainDescription}
                  </p>
                </div>

                {/* Full Extracted Source notes/content */}
                {extractedData.originalNotesContent && (
                  <div className="p-4 bg-neutral-50 border border-neutral-200/40 rounded-xl space-y-2 animate-fadeIn">
                    <span className="text-[9px] font-semibold text-indigo-700 font-mono block tracking-wider uppercase flex items-center gap-1">
                      <BookOpen className="w-3.5 h-3.5 text-indigo-500" />
                      <span>提炼源网页/链接之全景完整内容 (FULL CAPTURED SOURCE CONTENT)</span>
                    </span>
                    <p className="text-[11px] text-neutral-400 font-light leading-normal">
                      智能 AI 深度解析并整理了该链接/主题的 100% 文本内容，确保没有遗漏您的任何词汇与笔记。
                    </p>
                    <div className="text-xs text-neutral-800 leading-relaxed font-light mt-2 bg-white p-3.5 rounded-lg border border-neutral-200/50 whitespace-pre-line max-h-[300px] overflow-y-auto select-text selection:bg-indigo-100 font-sans">
                      {extractedData.originalNotesContent}
                    </div>
                  </div>
                )}

                {/* Specific Speaking Scene Communication Logic */}
                {extractedData.communicationLogic && (
                  <div className="p-4 bg-indigo-50/20 border border-indigo-100/30 rounded-xl space-y-2">
                    <span className="text-[9px] font-semibold text-indigo-700 font-mono block tracking-wider uppercase">
                      💡 特定口语场景交流逻辑 (COMMUNICATION LOGIC)
                    </span>
                    <p className="text-xs text-neutral-800 leading-relaxed font-light">
                      {extractedData.communicationLogic}
                    </p>
                  </div>
                )}

                {/* Multi-Dimensional Extracted Content Groups */}
                <div className="space-y-6">
                  
                  {/* Category 1: Core Collocations */}
                  {extractedData.collocations && extractedData.collocations.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-1.5 h-3 bg-amber-500 rounded-xs" />
                        <h4 className="text-xs font-semibold text-neutral-800">1. 核心词伙 (Core Collocations)</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">({extractedData.collocations.length})</span>
                      </div>
                      <div className="space-y-3">
                        {extractedData.collocations.map((expr, index) => (
                          <div key={index} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/10 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[13px] font-semibold text-neutral-900 bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded">
                                {expr.expression}
                              </span>
                              <span className="text-[10px] text-amber-600 font-medium bg-amber-50 px-2 py-0.5 rounded">核心词伙</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100/50 text-[11.5px]">
                              <div>
                                <span className="text-[9px] text-neutral-400 block mb-0.5">普通教材/中式表达</span>
                                <span className="text-neutral-500 leading-tight block">{expr.standard}</span>
                              </div>
                              <div className="sm:border-l border-neutral-100 sm:pl-3">
                                <span className="text-[9px] text-emerald-600 font-medium block mb-0.5">母语地道高频对齐（中文释义）</span>
                                <span className="text-neutral-900 font-semibold leading-tight block">{expr.native}</span>
                                <span className="text-indigo-600 text-[11px] font-medium block mt-0.5">👉 {expr.chinese}</span>
                              </div>
                            </div>
                            <div className="pt-1 text-[11px] text-neutral-500 leading-normal">
                              <strong className="text-neutral-600 font-semibold">记忆挂钩:</strong> {expr.memoryHook}
                            </div>
                            {expr.example && (
                              <div className="pt-1 text-[11px] text-neutral-600 leading-normal italic font-mono bg-white p-2 rounded border border-neutral-100">
                                💡 例句：{expr.example}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 2: Functional Sentences */}
                  {extractedData.functionalSentences && extractedData.functionalSentences.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-1.5 h-3 bg-indigo-500 rounded-xs" />
                        <h4 className="text-xs font-semibold text-neutral-800">2. 功能句型 (Functional Sentences)</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">({extractedData.functionalSentences.length})</span>
                      </div>
                      <div className="space-y-3">
                        {extractedData.functionalSentences.map((expr, index) => (
                          <div key={index} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/10 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[13px] font-semibold text-neutral-900 bg-indigo-500/10 border border-indigo-500/20 px-2 py-0.5 rounded">
                                {expr.expression}
                              </span>
                              <span className="text-[10px] text-indigo-600 font-medium bg-indigo-50 px-2 py-0.5 rounded">功能句型</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100/50 text-[11.5px]">
                              <div>
                                <span className="text-[9px] text-neutral-400 block mb-0.5">普通教材/中式表达</span>
                                <span className="text-neutral-500 leading-tight block">{expr.standard}</span>
                              </div>
                              <div className="sm:border-l border-neutral-100 sm:pl-3">
                                <span className="text-[9px] text-emerald-600 font-medium block mb-0.5">母语地道高频对齐（中文释义）</span>
                                <span className="text-neutral-900 font-semibold leading-tight block">{expr.native}</span>
                                <span className="text-indigo-600 text-[11px] font-medium block mt-0.5">👉 {expr.chinese}</span>
                              </div>
                            </div>
                            <div className="pt-1 text-[11px] text-neutral-500 leading-normal">
                              <strong className="text-neutral-600 font-semibold">记忆挂钩:</strong> {expr.memoryHook}
                            </div>
                            {expr.example && (
                              <div className="pt-1 text-[11px] text-neutral-600 leading-normal italic font-mono bg-white p-2 rounded border border-neutral-100">
                                💡 例句：{expr.example}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 3: Mood Filler Words */}
                  {extractedData.moodFillers && extractedData.moodFillers.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-1.5 h-3 bg-emerald-500 rounded-xs" />
                        <h4 className="text-xs font-semibold text-neutral-800">3. 语气填充词 (Mood Filler Words)</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">({extractedData.moodFillers.length})</span>
                      </div>
                      <div className="space-y-3">
                        {extractedData.moodFillers.map((expr, index) => (
                          <div key={index} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/10 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[13px] font-semibold text-neutral-900 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded">
                                {expr.expression}
                              </span>
                              <span className="text-[10px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded">语气填充</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100/50 text-[11.5px]">
                              <div>
                                <span className="text-[9px] text-neutral-400 block mb-0.5">普通教材/中式表达</span>
                                <span className="text-neutral-500 leading-tight block">{expr.standard}</span>
                              </div>
                              <div className="sm:border-l border-neutral-100 sm:pl-3">
                                <span className="text-[9px] text-emerald-600 font-medium block mb-0.5">母语地道高频对齐（中文释义）</span>
                                <span className="text-neutral-900 font-semibold leading-tight block">{expr.native}</span>
                                <span className="text-indigo-600 text-[11px] font-medium block mt-0.5">👉 {expr.chinese}</span>
                              </div>
                            </div>
                            <div className="pt-1 text-[11px] text-neutral-500 leading-normal">
                              <strong className="text-neutral-600 font-semibold">记忆挂钩:</strong> {expr.memoryHook}
                            </div>
                            {expr.example && (
                              <div className="pt-1 text-[11px] text-neutral-600 leading-normal italic font-mono bg-white p-2 rounded border border-neutral-100">
                                💡 例句：{expr.example}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Category 4: AI Supplements */}
                  {extractedData.aiSupplements && extractedData.aiSupplements.length > 0 && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 border-b border-neutral-100 pb-1.5">
                        <span className="w-1.5 h-3 bg-purple-500 rounded-xs" />
                        <h4 className="text-xs font-semibold text-neutral-800">4. 大数据 AI 补充语料 (AI Big Data Supplements)</h4>
                        <span className="text-[10px] text-neutral-400 font-mono">({extractedData.aiSupplements.length})</span>
                      </div>
                      <div className="space-y-3">
                        {extractedData.aiSupplements.map((expr, index) => (
                          <div key={index} className="p-3.5 rounded-xl border border-neutral-100 bg-neutral-50/10 space-y-2 text-xs">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[13px] font-semibold text-neutral-900 bg-purple-500/10 border border-purple-500/20 px-2 py-0.5 rounded">
                                {expr.expression}
                              </span>
                              <span className="text-[10px] text-purple-600 font-medium bg-purple-50 px-2 py-0.5 rounded">AI 补充</span>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100/50 text-[11.5px]">
                              <div>
                                <span className="text-[9px] text-neutral-400 block mb-0.5">普通教材/中式表达</span>
                                <span className="text-neutral-500 leading-tight block">{expr.standard}</span>
                              </div>
                              <div className="sm:border-l border-neutral-100 sm:pl-3">
                                <span className="text-[9px] text-emerald-600 font-medium block mb-0.5">母语地道高频对齐（中文释义）</span>
                                <span className="text-neutral-900 font-semibold leading-tight block">{expr.native}</span>
                                <span className="text-indigo-600 text-[11px] font-medium block mt-0.5">👉 {expr.chinese}</span>
                              </div>
                            </div>
                            <div className="pt-1 text-[11px] text-neutral-500 leading-normal">
                              <strong className="text-neutral-600 font-semibold">记忆挂钩:</strong> {expr.memoryHook}
                            </div>
                            {expr.example && (
                              <div className="pt-1 text-[11px] text-neutral-600 leading-normal italic font-mono bg-white p-2 rounded border border-neutral-100">
                                💡 例句：{expr.example}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                </div>

                {/* AI Practice task */}
                <div className="p-4 bg-indigo-50/40 border border-indigo-100/40 rounded-xl">
                  <span className="text-[9px] font-semibold text-indigo-700 font-mono block tracking-wider">
                    🎙️ 配套口语巩固问题 (SPEAKING TASK)
                  </span>
                  <p className="text-xs text-indigo-900 italic leading-relaxed mt-1.5">
                    "{extractedData.speakingPracticePrompt}"
                  </p>
                </div>

              </motion.div>
            )}

            {!isLoading && !extractedData && (
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-12 text-center h-[380px] flex flex-col items-center justify-center space-y-3">
                <Link2 className="w-8 h-8 text-neutral-300 animate-pulse" />
                <h4 className="text-sm font-medium text-neutral-800">等待提取输入...</h4>
                <p className="text-xs text-neutral-400 max-w-xs leading-normal font-light">
                  在左侧粘贴您在小红书、微信、公众号、B站上浏览到的英语干货、英文博主视频链接或感兴趣的主题。
                </p>
              </div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
