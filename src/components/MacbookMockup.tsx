import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Folder, 
  Smartphone, 
  X, 
  Minus, 
  Maximize2, 
  BookOpen, 
  Sparkles, 
  Search, 
  ChevronRight, 
  ThumbsUp, 
  Mic, 
  Heart, 
  ExternalLink,
  ChevronLeft,
  RefreshCw,
  Clock,
  Layers
} from "lucide-react";

interface MacbookMockupProps {
  onNavigateSection: (sectionId: string) => void;
}

export default function MacbookMockup({ onNavigateSection }: MacbookMockupProps) {
  const [activeModal, setActiveModal] = useState<"pdf" | "feed" | null>(null);
  const [pdfPage, setPdfPage] = useState(1);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // Hardcoded feed list for the simulated smartphone mockup
  const smartphoneFeed = [
    {
      id: "feed_1",
      tag: "底层逻辑",
      title: "如何打破‘开口卡顿’？记死这套描述思维链",
      desc: "母语者的逻辑不是堆词，而是画面渐进。下次面对新事物，遵循这三部曲：",
      steps: [
        "1. 场景背景 (Scene Background): It's a bustling local cafe packed with morning commuters...",
        "2. 细节动作 (Detail Actions): I squeezed through, grabbed an iced latte, and...",
        "3. 个人感受 (Personal Feelings): That refreshing sip instantly jolted me awake."
      ],
      tip: "💡 通用框架，无需死记模板！",
      likes: 342,
      author: "@SpeakingCoach_Mia"
    },
    {
      id: "feed_2",
      tag: "同境词",
      title: "场景打包！‘城市通勤’必备高频原生词伙",
      desc: "别背‘crowded’了，试着把这些地道表达打包放进一个袋子里：",
      steps: [
        "• packed like sardines (挤成沙丁鱼罐头)",
        "• bumper-to-bumper traffic (首尾相接的大堵车)",
        "• race against the clock (与时间赛跑)",
        "• a soul-crushing commute (让人灵魂崩溃的通勤经历)"
      ],
      tip: "🔥 地道 > 复杂，开口就能精准击中母语者习惯！",
      likes: 512,
      author: "@CorpusKing"
    },
    {
      id: "feed_3",
      tag: "记忆外挂",
      title: "谐音梗记单词：不再痛苦背诵！",
      desc: "如何瞬间记住职场高级表达 'Align' (对齐/一致)？",
      steps: [
        "• 谐音：‘阿莱恩’",
        "• 联想：阿莱和恩恩（俩人名）决定在公司排成一排，‘时间对齐’，工作协调一致！",
        "• 例句：Let's see if our goals align with each other."
      ],
      tip: "🎯 联想画面越生动，提取就越快！",
      likes: 189,
      author: "@MnemonicGuru"
    }
  ];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-6 select-none" id="macbook-mockup-section">
      {/* Container holding the Macbook chassis */}
      <div className="relative w-full max-w-4xl px-4 flex flex-col items-center">
        
        {/* Apple Macbook Laptop Graphic */}
        <div className="relative w-full aspect-[16/10] bg-neutral-900 rounded-2xl p-[2%] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] border border-neutral-800 flex flex-col items-center justify-center overflow-hidden">
          
          {/* Bezel Camera Hole */}
          <div className="absolute top-[1.5%] left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-neutral-950 border border-neutral-800 flex items-center justify-center">
            <div className="w-0.5 h-0.5 rounded-full bg-blue-900/60" />
          </div>

          {/* Screen Content Area */}
          <div className="relative w-full h-full bg-radial from-neutral-50 via-neutral-100 to-neutral-200 rounded-lg overflow-hidden flex flex-col justify-between p-4 shadow-inner">
            
            {/* Desktop Wallpaper Accent (Subtle geometric light circles) */}
            <div className="absolute inset-0 bg-linear-to-tr from-neutral-200/40 via-transparent to-white/60 pointer-events-none" />
            <div className="absolute top-[-20%] left-[-10%] w-[50%] aspect-square rounded-full bg-white/25 blur-3xl pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] aspect-square rounded-full bg-neutral-300/30 blur-2xl pointer-events-none" />

            {/* Desktop Top Menu Bar (macOS style) */}
            <div className="relative flex items-center justify-between w-full h-5 text-[10px] text-neutral-500 font-light border-b border-neutral-200/40 pb-1 z-10">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-neutral-700"> Oral Lab</span>
                <span className="hover:text-neutral-800 cursor-pointer">File</span>
                <span className="hover:text-neutral-800 cursor-pointer text-neutral-400">Edit</span>
                <span className="hover:text-neutral-800 cursor-pointer">Go</span>
                <span className="hover:text-neutral-800 cursor-pointer">Help</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <Clock className="w-3 h-3 text-neutral-400" />
                <span>100% Charged</span>
              </div>
            </div>

            {/* Main Desktop Space with Carousel */}
            <div className="relative flex-1 flex flex-col items-center justify-center py-2 z-10">
              
              {/* Carousel Title */}
              <div className="text-center mb-4">
                <motion.h2 
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-neutral-800 text-[14px] font-medium tracking-wider"
                >
                  SILENT SPEAKING ORAL LAB
                </motion.h2>
                <p className="text-neutral-400 text-[9px] font-mono tracking-widest mt-0.5 uppercase">
                  Interactive Desktop • Slide & Click
                </p>
              </div>

              {/* Parallel Horizontal Sliding Cards Container */}
              <div className="w-full flex items-center justify-center gap-4 px-2 overflow-x-auto pb-4 pt-1 snap-x scrollbar-none no-scrollbar">
                
                {/* CARD 1: Folders PDF Viewer */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModal("pdf")}
                  className="flex-shrink-0 w-44 aspect-[4/3] bg-white/40 backdrop-blur-md border border-white/60 shadow-xs hover:shadow-md rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer snap-center transition-all group"
                  id="card-folders-pdf"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-neutral-100/80 rounded-xl text-amber-500 shadow-2xs group-hover:bg-amber-50 group-hover:text-amber-600 transition-colors">
                      <Folder className="w-5 h-5 fill-current" />
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/50 text-neutral-500">
                      PDF.Doc
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      场景化英语口语语料
                    </div>
                    <div className="text-[9px] text-neutral-400 mt-1 flex items-center gap-0.5 font-mono">
                      <span>Preview PDF</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </motion.div>

                {/* CARD 2: Smartphone Info Flow Feed */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveModal("feed")}
                  className="flex-shrink-0 w-44 aspect-[4/3] bg-white/40 backdrop-blur-md border border-white/60 shadow-xs hover:shadow-md rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer snap-center transition-all group"
                  id="card-smartphone-feed"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-neutral-100/80 rounded-xl text-neutral-700 shadow-2xs group-hover:bg-neutral-900 group-hover:text-white transition-colors">
                      <Smartphone className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/50 text-neutral-500">
                      Mobile Feed
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      口语‘干货’信息流
                    </div>
                    <div className="text-[9px] text-neutral-400 mt-1 flex items-center gap-0.5 font-mono">
                      <span>Explore Chunks</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </motion.div>

                {/* CARD 3: Quick review trigger */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateSection("dashboard")}
                  className="flex-shrink-0 w-44 aspect-[4/3] bg-white/40 backdrop-blur-md border border-white/60 shadow-xs hover:shadow-md rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer snap-center transition-all group"
                  id="card-ebbinghaus-shortcut"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-neutral-100/80 rounded-xl text-emerald-600 shadow-2xs group-hover:bg-emerald-50 transition-colors">
                      <Clock className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/50 text-neutral-500">
                      Planner
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      艾宾浩斯每日复习
                    </div>
                    <div className="text-[9px] text-neutral-400 mt-1 flex items-center gap-0.5 font-mono">
                      <span>Review Deck</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </motion.div>

                {/* CARD 4: Speaking Lab Trigger */}
                <motion.div
                  whileHover={{ y: -4, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onNavigateSection("speaking")}
                  className="flex-shrink-0 w-44 aspect-[4/3] bg-white/40 backdrop-blur-md border border-white/60 shadow-xs hover:shadow-md rounded-2xl p-3.5 flex flex-col justify-between cursor-pointer snap-center transition-all group"
                  id="card-practice-shortcut"
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-neutral-100/80 rounded-xl text-indigo-600 shadow-2xs group-hover:bg-indigo-50 transition-colors">
                      <Layers className="w-5 h-5" />
                    </div>
                    <span className="text-[8px] font-mono px-2 py-0.5 rounded-full bg-neutral-200/50 text-neutral-500">
                      Speaking Lab
                    </span>
                  </div>
                  <div>
                    <div className="text-[11px] font-medium text-neutral-800 leading-tight">
                      去模板化口语实战
                    </div>
                    <div className="text-[9px] text-neutral-400 mt-1 flex items-center gap-0.5 font-mono">
                      <span>Start Practice</span>
                      <ChevronRight className="w-2.5 h-2.5" />
                    </div>
                  </div>
                </motion.div>

              </div>
              
              <p className="text-[9px] text-neutral-400 font-mono tracking-tight mt-1">
                ◀ Slide to view modules • Click cards to trigger interactions ▶
              </p>
            </div>

            {/* macOS bottom Dock bar */}
            <div className="relative w-full flex justify-center z-10 h-10 mt-auto">
              <div className="flex items-center gap-2.5 px-3 py-1 bg-white/20 backdrop-blur-2xl border border-white/40 shadow-md rounded-2xl">
                <div 
                  onClick={() => setActiveModal("pdf")}
                  className="w-7 h-7 bg-amber-500 rounded-lg shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center text-white transition-all group relative"
                  title="PDF Library"
                >
                  <Folder className="w-4 h-4 fill-current" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neutral-800 opacity-60" />
                </div>
                <div 
                  onClick={() => setActiveModal("feed")}
                  className="w-7 h-7 bg-neutral-800 rounded-lg shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center text-white transition-all group relative"
                  title="Methodology Feed"
                >
                  <Smartphone className="w-4 h-4" />
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-neutral-800 opacity-60" />
                </div>
                <div className="w-0.5 h-5 bg-neutral-300/60" />
                <div 
                  onClick={() => onNavigateSection("corpus")}
                  className="w-7 h-7 bg-white/80 hover:bg-white rounded-lg shadow-2xs hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center text-neutral-700 transition-all"
                  title="Scenario Folders"
                >
                  <BookOpen className="w-4 h-4" />
                </div>
                <div 
                  onClick={() => onNavigateSection("speaking")}
                  className="w-7 h-7 bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm hover:scale-110 active:scale-95 cursor-pointer flex items-center justify-center text-white transition-all"
                  title="Speaking feedback"
                >
                  <Mic className="w-4 h-4" />
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Macbook bottom chassis & hinge */}
        <div className="relative w-[114%] h-4 bg-neutral-400 border-t border-white/50 rounded-b-xl shadow-lg flex items-center justify-center">
          {/* Display Opening Notch */}
          <div className="w-16 h-1 bg-neutral-500/40 rounded-b-md -mt-2.5" />
        </div>

        {/* ======================================================= */}
        {/* INTERACTIVE POPUPS (macOS / APPLE STYLED OVERLAYS) */}
        {/* ======================================================= */}
        
        <AnimatePresence>
          {/* MODAL 1: macOS Finder style window displaying a scrollable PDF */}
          {activeModal === "pdf" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 w-[94%] max-w-2xl bg-white rounded-2xl shadow-[0_30px_70px_rgba(0,0,0,0.22)] border border-neutral-200/80 overflow-hidden z-30"
              id="pdf-finder-modal"
            >
              {/* macOS window titlebar */}
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 border-b border-neutral-200/50">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-3.5 h-3.5 rounded-full bg-red-400 flex items-center justify-center group/btn cursor-pointer"
                  >
                    <X className="w-2 h-2 text-red-950 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                  <button className="w-3.5 h-3.5 rounded-full bg-yellow-400 flex items-center justify-center cursor-not-allowed">
                    <Minus className="w-2 h-2 text-yellow-950 opacity-0" />
                  </button>
                  <button className="w-3.5 h-3.5 rounded-full bg-green-400 flex items-center justify-center cursor-not-allowed">
                    <Maximize2 className="w-1.5 h-1.5 text-green-950 opacity-0" />
                  </button>
                </div>
                <div className="text-[11px] font-mono font-medium text-neutral-600 flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-neutral-400" />
                  <span>vlog_speech_patterns_handbook.pdf (2 Pages)</span>
                </div>
                <div className="w-12" /> {/* spacer */}
              </div>

              {/* Window Content: Scrollable PDF Document Canvas */}
              <div className="flex h-[400px]">
                {/* PDF Sidebar (Thumbnails) */}
                <div className="w-32 bg-neutral-50/70 border-r border-neutral-100 p-2.5 flex flex-col gap-3 overflow-y-auto">
                  <div 
                    onClick={() => setPdfPage(1)}
                    className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      pdfPage === 1 ? "border-amber-400 bg-amber-50/30 ring-1 ring-amber-400/20" : "border-neutral-200/40 hover:bg-neutral-100/60"
                    }`}
                  >
                    <div className="aspect-[3/4] bg-white border border-neutral-200 rounded p-1.5 flex flex-col justify-between">
                      <div className="h-1.5 w-8 bg-neutral-300 rounded" />
                      <div className="space-y-0.5">
                        <div className="h-1 w-full bg-neutral-200 rounded" />
                        <div className="h-1 w-5/6 bg-neutral-200 rounded" />
                      </div>
                      <div className="text-[8px] text-neutral-400 text-right mt-1 font-mono">P.1</div>
                    </div>
                    <span className="text-[9px] text-neutral-500 font-medium block mt-1.5 text-center truncate">Daily Scene</span>
                  </div>

                  <div 
                    onClick={() => setPdfPage(2)}
                    className={`p-2.5 rounded-xl border transition-all text-left cursor-pointer ${
                      pdfPage === 2 ? "border-amber-400 bg-amber-50/30 ring-1 ring-amber-400/20" : "border-neutral-200/40 hover:bg-neutral-100/60"
                    }`}
                  >
                    <div className="aspect-[3/4] bg-white border border-neutral-200 rounded p-1.5 flex flex-col justify-between">
                      <div className="h-1.5 w-8 bg-neutral-300 rounded" />
                      <div className="space-y-0.5">
                        <div className="h-1 w-full bg-neutral-200 rounded" />
                        <div className="h-1 w-5/6 bg-neutral-200 rounded" />
                      </div>
                      <div className="text-[8px] text-neutral-400 text-right mt-1 font-mono">P.2</div>
                    </div>
                    <span className="text-[9px] text-neutral-500 font-medium block mt-1.5 text-center truncate">Business Scene</span>
                  </div>
                </div>

                {/* PDF Main scrollable document page */}
                <div className="flex-1 bg-neutral-100 p-4 overflow-y-auto flex justify-center">
                  <div className="w-full max-w-lg bg-white shadow-xs border border-neutral-200/50 rounded-lg p-6 text-neutral-800 text-[12px] font-light leading-relaxed select-text">
                    
                    {pdfPage === 1 ? (
                      <div>
                        {/* Title of textbook page */}
                        <div className="border-b border-neutral-100 pb-3 mb-4">
                          <span className="text-[10px] text-amber-600 font-mono tracking-wider uppercase block">
                            SECTION 01 • DIALOGUE & LIFESTYLE
                          </span>
                          <h3 className="text-15px font-semibold text-neutral-900 mt-1 font-serif">
                            De-templatizing Your Daily Speech: The Cafe Scene
                          </h3>
                        </div>

                        <p className="text-neutral-500 mb-4 italic text-[11px]">
                          "Don't sound like a textbook. Native speakers utilize high-frequency shortcuts and emotional triggers in casual dialogue."
                        </p>

                        <div className="bg-neutral-50 rounded-xl p-3.5 mb-4 border border-neutral-100">
                          <span className="text-[10px] font-semibold text-neutral-800 block mb-1">
                            🎯 同境词 PACK: Ordering Morning Fuel
                          </span>
                          <p className="text-[11px] text-neutral-600 mb-2">
                            Instead of saying <span className="line-through text-neutral-400">"I want to buy a coffee, and put less ice in it"</span>, try:
                          </p>
                          <div className="space-y-2 mt-1">
                            <div className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold">•</span>
                              <div>
                                <span className="font-mono bg-amber-50/50 text-amber-800 px-1 rounded font-medium cursor-pointer" onClick={() => handleCopy("Can I grab an iced latte?")}>Can I grab a...</span>
                                <span className="text-neutral-400 text-[10px] ml-1">("我可以顺手捞杯...吗")</span>
                              </div>
                            </div>
                            <div className="flex items-start gap-1">
                              <span className="text-amber-500 font-bold">•</span>
                              <div>
                                <span className="font-mono bg-amber-50/50 text-amber-800 px-1 rounded font-medium cursor-pointer" onClick={() => handleCopy("Go easy on the ice, please.")}>Go easy on the ice</span>
                                <span className="text-neutral-400 text-[10px] ml-1">("冰块轻点下、少点冰")</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-neutral-900 text-[12px] mb-1.5">
                          🧠 底层描述逻辑：
                        </h4>
                        <p className="text-neutral-600 mb-3 leading-relaxed">
                          描述任何咖啡馆/早餐情景时，使用 <span className="font-medium text-amber-600">Background ➔ Actions ➔ Sensation</span> 的思维框架。
                          <br />
                          <span className="text-neutral-400 block mt-1 text-[11px]">
                            - Background: It is heavily packed with frantic morning commuters...
                            <br />
                            - Actions: Squeezed through the crowd, grabbed my custom drink...
                            <br />
                            - Sensation: That warm, rich aroma immediately boosted my spirits.
                          </span>
                        </p>

                        <div className="text-[10px] text-neutral-400 italic text-right mt-6 border-t border-neutral-100 pt-3">
                          Copied text? {copiedText ? <span className="text-amber-600 font-semibold font-mono">"{copiedText}" Copied!</span> : "Click highlighted phrases to copy"}
                        </div>
                      </div>
                    ) : (
                      <div>
                        {/* Page 2 of simulated PDF */}
                        <div className="border-b border-neutral-100 pb-3 mb-4">
                          <span className="text-[10px] text-indigo-600 font-mono tracking-wider uppercase block">
                            SECTION 02 • CAREER & INFLUENCE
                          </span>
                          <h3 className="text-15px font-semibold text-neutral-900 mt-1 font-serif">
                            The Business Screener: Creating Aligned Interest
                          </h3>
                        </div>

                        <p className="text-neutral-500 mb-4 italic text-[11px]">
                          "In corporate dialogues, clarity, assertiveness, and smooth transitions are prized over complex syntax."
                        </p>

                        <div className="bg-neutral-50 rounded-xl p-3.5 mb-4 border border-neutral-100">
                          <span className="text-[10px] font-semibold text-neutral-800 block mb-1">
                            🎯 同境词 PACK: Walkthroughs & Calendars
                          </span>
                          <div className="space-y-2 mt-2">
                            <div>
                              <span className="font-mono bg-indigo-50 text-indigo-800 px-1 rounded font-medium cursor-pointer" onClick={() => handleCopy("Let me walk you through my portfolio.")}>walk you through...</span>
                               <span className="text-[10px] text-neutral-400 ml-1">("带你浏览我的经历"，比单纯的"tell you"更具带入感)</span>
                            </div>
                            <div>
                              <span className="font-mono bg-indigo-50 text-indigo-800 px-1 rounded font-medium cursor-pointer" onClick={() => handleCopy("Let's see if that aligns with your schedule.")}>aligns with your schedule</span>
                              <span className="text-[10px] text-neutral-400 ml-1">("契合您的时间日程"，体现专业度与敬意)</span>
                            </div>
                          </div>
                        </div>

                        <h4 className="font-semibold text-neutral-900 text-[12px] mb-1.5">
                          🧠 交流类底层逻辑：
                        </h4>
                        <p className="text-neutral-600 leading-relaxed mb-4">
                          进行求职沟通或客户对话时，绝非生硬回答，而是：
                          <span className="font-medium text-indigo-600 block mt-1">
                            回应核心 ➔ 补全细节 ➔ 抛回话题
                          </span>
                          <span className="text-neutral-400 block mt-1 text-[11px]">
                            - 回应: "I am absolutely thrilled to hear that!"
                            <br />
                            - 细节: "I specialize in tackling complex design systems."
                            <br />
                            - 抛回: "Does Tuesday at 2 PM align with your schedule to talk?"
                          </span>
                        </p>

                        <div className="text-[10px] text-neutral-400 italic text-right mt-6 border-t border-neutral-100 pt-3">
                          Copied text? {copiedText ? <span className="text-indigo-600 font-semibold font-mono">"{copiedText}" Copied!</span> : "Click highlighted phrases to copy"}
                        </div>
                      </div>
                    )}

                  </div>
                </div>
              </div>

              {/* Window Footer Actions */}
              <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200/50 flex items-center justify-between">
                <span className="text-[11px] text-neutral-400">
                  ⚡️ NotebookLM Simulated PDF Renderer
                </span>
                <button 
                  onClick={() => onNavigateSection("corpus")}
                  className="px-3.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>同步到我的口语库</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          )}

          {/* MODAL 2: Description Box (Left) + Smartphone Mockup Feed (Right) */}
          {activeModal === "feed" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="absolute top-4 left-1/2 -translate-x-1/2 w-[96%] max-w-3xl bg-neutral-900 text-white rounded-3xl shadow-[0_30px_80px_rgba(0,0,0,0.35)] border border-neutral-800 overflow-hidden z-30"
              id="smartphone-mockup-modal"
            >
              {/* Top macOS-style controls with dark themed bar */}
              <div className="flex items-center justify-between px-4 py-3.5 bg-neutral-950 border-b border-neutral-800/60">
                <div className="flex items-center gap-1.5">
                  <button 
                    onClick={() => setActiveModal(null)}
                    className="w-3.5 h-3.5 rounded-full bg-red-400 flex items-center justify-center group/btn cursor-pointer"
                  >
                    <X className="w-2 h-2 text-red-950 opacity-0 group-hover/btn:opacity-100 transition-opacity" />
                  </button>
                  <div className="w-3.5 h-3.5 rounded-full bg-neutral-800" />
                  <div className="w-3.5 h-3.5 rounded-full bg-neutral-800" />
                </div>
                <div className="text-[10px] font-mono tracking-widest text-neutral-400 uppercase">
                  ⚡️ Dynamic Speaking Methodology Feed
                </div>
                <div className="w-12" />
              </div>

              {/* Grid content: Left Description, Right Smartphone Mockup */}
              <div className="grid grid-cols-1 md:grid-cols-12 p-6 gap-6 items-center">
                
                {/* Left side: Description/Explanations */}
                <div className="md:col-span-6 space-y-4 text-neutral-300">
                  <div>
                    <span className="text-[10px] text-amber-400 font-mono tracking-widest uppercase block">
                      CORE FORMULA
                    </span>
                    <h3 className="text-[18px] font-light tracking-wide text-white mt-1 font-serif">
                      去模板化口语体系：底层逻辑 + 同境词
                    </h3>
                  </div>

                  <p className="text-[12px] leading-relaxed text-neutral-400">
                    死记硬背雅思句型、高大上的学术词汇，在真实的英文环境（如商务洽谈、日常交流）中，反而会导致严重的“卡顿”和“社交尴尬”。
                  </p>

                  <div className="space-y-3 pt-2 text-[12px]">
                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-amber-400/10 text-amber-400 rounded-md">
                        <Sparkles className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-[12px]">同境词：场景打包记忆</h4>
                        <p className="text-neutral-400 text-[11px] mt-0.5">
                          不背孤立生词，而是把同一话题下的原生词伙（词语搭配、母语者高频搭配）成组掌握，即用即取。
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="mt-1 p-1 bg-blue-400/10 text-blue-400 rounded-md">
                        <Layers className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white text-[12px]">底层逻辑：通用思维链条</h4>
                        <p className="text-neutral-400 text-[11px] mt-0.5">
                          遵循母语者的表达习惯：描述类采用“背景 ➔ 动作 ➔ 感受”，交流类采用“回应 ➔ 补充 ➔ 抛回”。开口顺理成章，告别翻译卡顿。
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3">
                    <button 
                      onClick={() => onNavigateSection("speaking")}
                      className="px-4 py-2 bg-white text-neutral-900 hover:bg-neutral-100 rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>进入口语实战训练</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Right side: Interactive Smartphone Mockup */}
                <div className="md:col-span-6 flex justify-center">
                  
                  {/* Smartphone Chassis */}
                  <div className="relative w-64 h-[380px] bg-neutral-950 rounded-[40px] p-2.5 shadow-2xl border-4 border-neutral-800 overflow-hidden flex flex-col">
                    
                    {/* iPhone Top Notch (Speaker + Camera) */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-neutral-950 rounded-b-xl z-20 flex items-center justify-center">
                      <div className="w-12 h-1 bg-neutral-800 rounded-full mb-1.5" />
                      <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800/40 ml-2 mb-1.5 flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-blue-900/60" />
                      </div>
                    </div>

                    {/* Phone Screen Canvas (Scrollable Flow Feed) */}
                    <div className="w-full h-full bg-white rounded-[32px] overflow-hidden flex flex-col text-neutral-800 select-none">
                      
                      {/* Phone App Header */}
                      <div className="pt-6 pb-2.5 px-4 border-b border-neutral-100 flex items-center justify-between bg-neutral-50/80 backdrop-blur-md sticky top-0 z-10">
                        <div className="flex items-center gap-1">
                          <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                          <span className="text-[11px] font-semibold tracking-wider font-serif">SPEECH DRY DECK</span>
                        </div>
                        <RefreshCw className="w-3 h-3 text-neutral-400 hover:rotate-180 transition-transform duration-500 cursor-pointer" />
                      </div>

                      {/* Scrollable Feed Core */}
                      <div className="flex-1 overflow-y-auto p-3 space-y-3.5 bg-neutral-50/50">
                        
                        {smartphoneFeed.map((post) => (
                          <div key={post.id} className="bg-white rounded-2xl p-3 border border-neutral-100 shadow-3xs hover:border-neutral-200 transition-colors">
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[9px] px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 font-medium">
                                {post.tag}
                              </span>
                              <span className="text-[9px] text-neutral-400 font-mono">
                                {post.author}
                              </span>
                            </div>

                            <h4 className="text-[11px] font-semibold text-neutral-900 leading-tight">
                              {post.title}
                            </h4>

                            <p className="text-[10px] text-neutral-500 mt-1.5">
                              {post.desc}
                            </p>

                            <div className="mt-2 pl-1.5 border-l-2 border-neutral-200 space-y-1 py-0.5">
                              {post.steps.map((step, sIdx) => (
                                <div key={sIdx} className="text-[9px] text-neutral-700 font-light leading-snug">
                                  {step}
                                </div>
                              ))}
                            </div>

                            <div className="mt-2.5 pt-2 border-t border-neutral-50 flex items-center justify-between text-[9px] text-neutral-400">
                              <div className="flex items-center gap-1 hover:text-red-500 transition-colors cursor-pointer">
                                <Heart className="w-3 h-3" />
                                <span>{post.likes}</span>
                              </div>
                              <span className="font-mono text-[9px] text-neutral-500 font-medium">
                                {post.tip}
                              </span>
                            </div>

                          </div>
                        ))}

                        <p className="text-center text-[9px] text-neutral-400 pt-2 pb-1 italic">
                          • End of Daily Dry Goods •
                        </p>

                      </div>

                    </div>

                  </div>

                </div>

              </div>
              
              {/* Window Footer Actions */}
              <div className="px-6 py-3.5 bg-neutral-950 border-t border-neutral-800/60 text-center">
                <p className="text-[10px] text-neutral-400">
                  * 左右互动样机：左侧核心剖析 ➔ 右侧手机高地道语料流交互下滑
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
