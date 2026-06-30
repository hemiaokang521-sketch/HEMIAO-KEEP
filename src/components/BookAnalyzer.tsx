import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, 
  Sparkles, 
  RefreshCw, 
  Network, 
  Layers, 
  Check, 
  HelpCircle, 
  Copy, 
  GitMerge, 
  TrendingUp, 
  Smartphone,
  ChevronRight
} from "lucide-react";
import { MindmapNode, RefinedDryGoods } from "../types";

export default function BookAnalyzer() {
  const [selectedBook, setSelectedBook] = useState("The Art of Elegant Dialogue (对话艺术)");
  const [chapterTopic, setChapterTopic] = useState("Handling Conflict Gracefully (优雅地处理分歧)");
  const [isLoading, setIsLoading] = useState(false);
  
  // Dynamic Mindmap state
  const [mindmapTitle, setMindmapTitle] = useState("");
  const [nodes, setNodes] = useState<MindmapNode[]>([]);
  const [dryGoods, setDryGoods] = useState<RefinedDryGoods[]>([]);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const booksList = [
    "The Art of Elegant Dialogue (对话艺术)",
    "English Speaking Bible (原生口语圣经)",
    "High-Frequency Idiom Hacks (高频俚语精通)",
    "Corporate Communications Elite (企业精英沟通论)"
  ];

  const handleAnalyze = async () => {
    setIsLoading(true);
    setNodes([]);
    setDryGoods([]);
    setSelectedNodeId(null);

    try {
      const res = await fetch("/api/gemini/book-mindmap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookName: selectedBook, chapterTopic })
      });

      if (!res.ok) {
        throw new Error("Mindmap backend failed.");
      }

      const data = await res.json();
      setMindmapTitle(data.title || "Elite Speaking Logic Tree");
      setNodes(data.nodes || []);
      setDryGoods(data.refinedDryGoods || []);
      
      // Select central node by default
      if (data.nodes && data.nodes.length > 0) {
        setSelectedNodeId(data.nodes[0].id);
      }
    } catch (err: any) {
      alert("AI分析失败，正在加载精美本地原生导图作为回退保障！");
      
      // Bulletproof local backup for the mindmap tree
      const fallbackNodes: MindmapNode[] = [
        { id: "1", label: "优雅处理分歧", details: "核心态度：不正面迎击矛盾，而是在承认对方立足点的前提下，通过平行叙事展示不同逻辑。避免绝对否决。", parent: null },
        { id: "2", label: "01 同理铺垫段", details: "回应核心：I see where you are coming from. / I can definitely appreciate your logic. (真诚赞许对手，融化对立情绪)", parent: "1" },
        { id: "3", label: "02 逻辑切分段", details: "平稳转折：But if we look at it from another angle... / Alternatively, from my standpoint... (切忌用'But'单字打头，用完整的句式软化冲突)", parent: "1" },
        { id: "4", label: "03 抛出话题段", details: "开放收尾：How does that line up with your perspective? / Does that make sense in your context? (抛球给对方，让交流进入良性互动)", parent: "1" }
      ];

      const fallbackDryGoods: RefinedDryGoods[] = [
        {
          collocation: "I see where you're coming from",
          usageNote: "极为地道的商务委婉不同意开头，表示理解对方的立场来由",
          nativeEquivalent: "I understand your opinion, but...",
          example: "I see where you're coming from, but let's consider the budget limits."
        },
        {
          collocation: "Does that line up with...",
          usageNote: "温和地询问对方自己的方案是否符合他们的设想和目标",
          nativeEquivalent: "Does that match your plan?",
          example: "We've adjusted the design. Does that line up with your initial vision?"
        },
        {
          collocation: "Tackle it head-on",
          usageNote: "正面迎击、直接解决问题，非常有气势的动词词组",
          nativeEquivalent: "Solve the problem directly",
          example: "Instead of avoiding the client dispute, we should tackle it head-on."
        }
      ];

      setMindmapTitle("优雅分歧处理口语逻辑树");
      setNodes(fallbackNodes);
      setDryGoods(fallbackDryGoods);
      setSelectedNodeId("1");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const selectedNode = nodes.find(n => n.id === selectedNodeId);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="book-analyzer-root">
      
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-200/50 pb-6 mb-8">
        <span className="text-[10px] text-amber-600 font-mono tracking-widest uppercase block">
          NOTEBOOKLM STYLE KNOWLEDGE ENGINE
        </span>
        <h2 className="text-2xl font-light tracking-wide text-neutral-900 mt-1 font-serif">
          NotebookLM 原版书思维导图
        </h2>
        <p className="text-xs text-neutral-400 mt-1 leading-normal">
          像 NotebookLM 一样解构原版英文书，提取多维度口语思维树并凝结地道核心表达
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: BOOK SELECTOR & TOPIC (4 cols) */}
        <div className="md:col-span-4 space-y-5">
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-3xs space-y-4">
            
            <div>
              <label className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1.5">
                1. 选择原版图书 (SELECT BOOK)
              </label>
              <select
                value={selectedBook}
                onChange={e => setSelectedBook(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light"
              >
                {booksList.map(book => (
                  <option key={book} value={book}>{book}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[10px] font-semibold tracking-wider text-neutral-400 uppercase block mb-1.5">
                2. 指定精读章节与口语话题 (TOPIC)
              </label>
              <input
                type="text"
                required
                placeholder="例如: Custom Ordering / Sharing Hobby"
                value={chapterTopic}
                onChange={e => setChapterTopic(e.target.value)}
                className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
              />
            </div>

            <button
              onClick={handleAnalyze}
              disabled={isLoading}
              className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>正在精读解构原版书...</span>
                </>
              ) : (
                <>
                  <Network className="w-3.5 h-3.5" />
                  <span>生成口语思维导图</span>
                </>
              )}
            </button>

          </div>

          {/* Explanation node details */}
          <AnimatePresence mode="wait">
            {selectedNode && (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-amber-50/40 border border-amber-100/40 rounded-2xl p-4.5 text-xs text-neutral-800 space-y-2 leading-relaxed"
                id="node-detail-card"
              >
                <div className="flex items-center gap-1">
                  <span className="p-1 bg-amber-400/10 text-amber-600 rounded">
                    <Layers className="w-3.5 h-3.5" />
                  </span>
                  <span className="font-semibold text-neutral-900">
                    分支深度解析 • {selectedNode.label}
                  </span>
                </div>
                <p className="text-neutral-600 font-light mt-1 text-[11.5px]">
                  {selectedNode.details}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* RIGHT COLUMN: MINDMAP VISUALIZATION & DRY GOODS (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          
          {isLoading && (
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-16 text-center h-[400px] flex flex-col items-center justify-center space-y-4">
              <div className="relative w-12 h-12 flex items-center justify-center">
                <div className="absolute inset-0 border-4 border-amber-100 rounded-full" />
                <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-medium text-neutral-800">原版图书 NotebookLM 智能拆解中...</h4>
                <p className="text-[11px] text-neutral-400 font-mono">正在建立层级树及提取高频原生词组...</p>
              </div>
            </div>
          )}

          {!isLoading && nodes.length > 0 && (
            <div className="space-y-6">
              
              {/* Interactive Tree Map box */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-xs">
                <span className="text-[9px] font-bold text-neutral-400 font-mono block tracking-wider uppercase mb-3">
                  🌳 CONCEPTUAL SPEAKING TREE • 逻辑思维树 (点击节点查看解析)
                </span>

                {/* Simulated SVG Tree Graph */}
                <div className="relative w-full aspect-21/9 bg-neutral-50/70 border border-neutral-200/40 rounded-xl overflow-hidden flex flex-col items-center justify-center p-4">
                  
                  {/* SVG background connecting lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {/* Drawing connecting paths from parent to children */}
                    {nodes.map(node => {
                      if (!node.parent) return null;
                      const parentNode = nodes.find(n => n.id === node.parent);
                      if (!parentNode) return null;

                      // Simulated positions
                      const posMap: Record<string, {x: string, y: string}> = {
                        "1": { x: "50%", y: "20%" },
                        "2": { x: "20%", y: "70%" },
                        "3": { x: "50%", y: "70%" },
                        "4": { x: "80%", y: "70%" },
                      };

                      // Fallback safe mapping
                      const fromX = posMap[parentNode.id]?.x || "50%";
                      const fromY = posMap[parentNode.id]?.y || "20%";
                      const toX = posMap[node.id]?.x || "50%";
                      const toY = posMap[node.id]?.y || "70%";

                      return (
                        <line 
                          key={node.id}
                          x1={fromX} y1={fromY} 
                          x2={toX} y2={toY} 
                          className="stroke-neutral-300 stroke-1"
                        />
                      );
                    })}
                  </svg>

                  {/* Nodes positioned absolutely inside container */}
                  <div className="relative w-full h-full min-h-[140px] flex flex-col justify-between items-center z-10">
                    
                    {/* Root Node (Top Row) */}
                    <div className="flex justify-center w-full">
                      {nodes.filter(n => n.parent === null).map(node => (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`px-4 py-2 text-xs font-medium rounded-xl border transition-all cursor-pointer shadow-3xs ${
                            selectedNodeId === node.id 
                              ? "bg-neutral-900 text-white border-neutral-950 scale-105" 
                              : "bg-white text-neutral-800 border-neutral-200 hover:bg-neutral-50"
                          }`}
                        >
                          🌟 {node.label}
                        </button>
                      ))}
                    </div>

                    {/* Children Nodes (Bottom Row) */}
                    <div className="flex justify-around w-full">
                      {nodes.filter(n => n.parent !== null).map(node => (
                        <button
                          key={node.id}
                          onClick={() => setSelectedNodeId(node.id)}
                          className={`px-3 py-1.5 text-[11px] font-medium rounded-xl border transition-all cursor-pointer shadow-3xs max-w-[160px] truncate ${
                            selectedNodeId === node.id 
                              ? "bg-indigo-600 text-white border-indigo-700 scale-105" 
                              : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
                          }`}
                        >
                          🔸 {node.label}
                        </button>
                      ))}
                    </div>

                  </div>

                </div>
              </div>

              {/* Refined Elite speaking dry goods */}
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-xs space-y-4">
                <span className="text-[10px] font-bold text-neutral-400 font-mono block tracking-wider uppercase">
                  🏆 ELITE SPEAKING DRY GOODS • 书中精炼原生词伙 ({dryGoods.length})
                </span>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {dryGoods.map((item, index) => (
                    <div 
                      key={index} 
                      className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/30 hover:border-neutral-200 transition-colors relative group text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-semibold text-neutral-900 bg-white px-2 py-0.5 rounded border border-neutral-200/40">
                          {item.collocation}
                        </span>
                        
                        <button
                          onClick={() => handleCopy(item.collocation, index)}
                          className="p-1 hover:bg-neutral-200 rounded text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                          title="复制短语"
                        >
                          {copiedIndex === index ? (
                            <Check className="w-3 h-3 text-emerald-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>

                      <p className="text-neutral-500 text-[11px] font-light leading-normal">
                        <strong>用法技巧:</strong> {item.usageNote}
                      </p>

                      <div className="text-[11px] leading-snug">
                        <span className="text-[9px] text-neutral-400 block">原生高频对齐：</span>
                        <span className="text-neutral-800 font-medium">{item.nativeEquivalent}</span>
                      </div>

                      <p className="text-[10px] text-neutral-400 font-mono italic leading-tight">
                        "{item.example}"
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {!isLoading && nodes.length === 0 && (
            <div className="bg-white border border-neutral-200/50 rounded-2xl p-16 text-center h-[400px] flex flex-col items-center justify-center space-y-3">
              <BookOpen className="w-8 h-8 text-neutral-300 animate-pulse" />
              <h4 className="text-sm font-medium text-neutral-800">等待图书精读...</h4>
              <p className="text-xs text-neutral-400 max-w-sm leading-normal font-light">
                在左侧选择您希望研习的原版英文名著以及对应的口语场景，点击“生成口语思维导图”。
              </p>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
