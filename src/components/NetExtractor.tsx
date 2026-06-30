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

interface NetExtractorProps {
  onAddScene: (scene: SpeakingScene) => void;
  onAddNote: (note: NoteItem) => void;
}

export default function NetExtractor({ onAddScene, onAddNote }: NetExtractorProps) {
  const [url, setUrl] = useState("");
  const [personalLevel, setPersonalLevel] = useState("Intermediate (中高级)");
  const [noteHabit, setNoteHabit] = useState("Practical & Natural (地道高频优先)");
  const [isLoading, setIsLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // Stores the generated result from Gemini
  const [extractedData, setExtractedData] = useState<{
    sceneName: string;
    category: SceneCategory;
    thinkingChainType: "descriptive" | "interactive";
    thinkingChainDescription: string;
    expressions: Array<{
      expression: string;
      standard: string;
      native: string;
      memoryHook: string;
      example: string;
    }>;
    speakingPracticePrompt: string;
  } | null>(null);

  const [loadingStep, setLoadingStep] = useState(0);

  const handleExtract = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setIsLoading(true);
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
        body: JSON.stringify({ url, personalLevel, noteHabit })
      });

      if (!res.ok) {
        throw new Error("Failed to contact the extractor backend.");
      }

      const data = await res.json();
      setExtractedData(data);
    } catch (err: any) {
      alert("提取失败，错误：" + (err.message || "未知原因") + "。将采用高质量兜底生成器模拟，以便继续练习。");
      
      // Compliance fallback so the user experience never breaks
      const mockResult = {
        sceneName: "Digital Vlogging & Lifestyle Sharing",
        category: "Social" as SceneCategory,
        thinkingChainType: "descriptive" as const,
        thinkingChainDescription: "描述类：场景背景 (Spotting a trendy moment) ➔ 细节动作 (Hitting record, panning around) ➔ 个人感受 (Authentic connection with viewers).",
        expressions: [
          {
            expression: "Capture the vibe",
            standard: "Take videos of this situation (普通平淡)",
            native: "I really wanted to capture the aesthetic vibe here. (原生高频)",
            memoryHook: "联想法：Capture是捕获，Vibe是氛围感。不只是生硬地拍视频，而是捕捉那种空气里流淌的美好氛围。",
            example: "The lighting inside this coffee shop is flawless; let me capture the vibe."
          },
          {
            expression: "Spontaneous moments",
            standard: "Unplanned events (正式死板)",
            native: "I love recording spontaneous daily moments. (地道高级)",
            memoryHook: "谐音记忆：‘死胖特尼斯’ ➔ spontaneous 意思是自然而然发生的、不刻意的。母语者最爱用来形容不加修饰的真实生活碎片。",
            example: "Vlogs are so much better when you focus on spontaneous moments instead of scripts."
          }
        ],
        speakingPracticePrompt: "Imagine you are recording a daily life vlog. Introduce your surroundings and tell your viewers why you decided to capture this spontaneous moment."
      };
      setExtractedData(mockResult);
    } finally {
      intervals.forEach(clearTimeout);
      setIsLoading(false);
    }
  };

  const handleSaveToCorpus = () => {
    if (!extractedData) return;

    // Create scene
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

    // Create individual notes
    extractedData.expressions.forEach((expr, index) => {
      const newNote: NoteItem = {
        id: `extracted_note_${Date.now()}_${index}`,
        sceneId: sceneId,
        expression: expr.expression,
        standard: expr.standard,
        native: expr.native,
        memoryHook: expr.memoryHook,
        example: expr.example,
        createdAt: new Date().toISOString(),
        ebbinghaus: {
          stage: 0,
          nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
          reviewHistory: []
        }
      };
      onAddNote(newNote);
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
                <div className="p-4 bg-neutral-50 border border-neutral-200/30 rounded-xl">
                  <span className="text-[9px] font-semibold text-neutral-400 font-mono block tracking-wider">
                    🧠 AI 配套底层口语思维链 (THINKING CHAIN)
                  </span>
                  <p className="text-xs text-neutral-800 leading-relaxed mt-2">
                    {extractedData.thinkingChainDescription}
                  </p>
                </div>

                {/* Custom Phrases list */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-neutral-400 font-mono block tracking-wider uppercase">
                    💎 提炼出场景同境原生词伙 ({extractedData.expressions.length})
                  </span>

                  <div className="space-y-3.5">
                    {extractedData.expressions.map((expr, index) => (
                      <div key={index} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/20 space-y-2 text-xs">
                        
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[13px] font-medium bg-neutral-100/60 px-2 py-0.5 rounded border border-neutral-200/20">
                            {expr.expression}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100 text-[11.5px]">
                          <div>
                            <span className="text-[9px] text-neutral-400 block mb-0.5">普通教材中式表达</span>
                            <span className="text-neutral-500 leading-tight block">{expr.standard}</span>
                          </div>
                          <div className="sm:border-l border-neutral-100 sm:pl-3">
                            <span className="text-[9px] text-emerald-600 font-medium block mb-0.5">母语原生高频说法</span>
                            <span className="text-neutral-900 font-medium leading-tight block">{expr.native}</span>
                          </div>
                        </div>

                        <div className="pt-1.5 text-[11px] text-neutral-500 leading-normal flex items-start gap-1 font-sans">
                          <span className="text-amber-500">💡</span>
                          <p><strong className="text-neutral-700">记忆挂钩:</strong> {expr.memoryHook}</p>
                        </div>

                        {expr.example && (
                          <div className="pt-1 text-[11px] text-neutral-600 leading-normal flex items-start gap-1 font-mono italic">
                            <span className="text-indigo-500 font-serif">“</span>
                            <p>{expr.example}</p>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
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
