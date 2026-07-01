import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from "recharts";
import { 
  FolderHeart, 
  Plus, 
  Trash2, 
  Search, 
  Sparkles, 
  BookOpen, 
  Layers, 
  HelpCircle, 
  ChevronRight, 
  ArrowLeft,
  Briefcase,
  Smile,
  Users,
  GraduationCap,
  Calendar,
  Share2,
  Tag,
  CheckSquare,
  Square,
  FolderInput,
  Check,
  X
} from "lucide-react";
import { SpeakingScene, NoteItem, SceneCategory } from "../types";

interface CorpusLibraryProps {
  scenes: SpeakingScene[];
  notes: NoteItem[];
  onAddScene: (scene: SpeakingScene) => void;
  onAddNote: (note: NoteItem) => void;
  onDeleteNote: (noteId: string) => void;
  onDeleteScene: (sceneId: string) => void;
  onUpdateScene?: (scene: SpeakingScene) => void;
  onUpdateNotes?: (notes: NoteItem[]) => void;
}

export default function CorpusLibrary({ 
  scenes, 
  notes, 
  onAddScene, 
  onAddNote, 
  onDeleteNote,
  onDeleteScene,
  onUpdateScene,
  onUpdateNotes
}: CorpusLibraryProps) {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SceneCategory | "All">("All");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [showDashboard, setShowDashboard] = useState(true);

  // State for forms
  const [showAddScene, setShowAddScene] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  // New Scene Form inputs
  const [newSceneName, setNewSceneName] = useState("");
  const [newSceneCat, setNewSceneCat] = useState<SceneCategory>("Daily");
  const [newSceneChainType, setNewSceneChainType] = useState<"descriptive" | "interactive">("descriptive");
  const [newSceneChainDesc, setNewSceneChainDesc] = useState("");
  const [newScenePrompt, setNewScenePrompt] = useState("");
  const [newSceneTagsStr, setNewSceneTagsStr] = useState("");

  // New Note Form inputs
  const [newNoteExpression, setNewNoteExpression] = useState("");
  const [newNoteStandard, setNewNoteStandard] = useState("");
  const [newNoteNative, setNewNoteNative] = useState("");
  const [newNoteHook, setNewNoteHook] = useState("");
  const [newNoteExample, setNewNoteExample] = useState("");
  const [newNoteTagsStr, setNewNoteTagsStr] = useState("");
  const [newNoteType, setNewNoteType] = useState<"collocation" | "sentence" | "filler" | "supplement">("collocation");

  const [linguisticTypeTab, setLinguisticTypeTab] = useState<"all" | "collocation" | "sentence" | "filler" | "supplement">("all");

  // Batch operations state
  const [selectedNoteIds, setSelectedNoteIds] = useState<string[]>([]);
  const [batchTagsStr, setBatchTagsStr] = useState("");
  const [batchTargetSceneId, setBatchTargetSceneId] = useState("");
  const [showBatchDeleteConfirm, setShowBatchDeleteConfirm] = useState(false);
  const [batchSuccessMessage, setBatchSuccessMessage] = useState("");

  React.useEffect(() => {
    setSelectedNoteIds([]);
    setBatchTagsStr("");
    setBatchTargetSceneId("");
    setShowBatchDeleteConfirm(false);
    setBatchSuccessMessage("");
  }, [selectedSceneId]);

  const handleBatchAssignTags = () => {
    if (selectedNoteIds.length === 0) return;
    const parsedTags = batchTagsStr
      .split(/[,，\s]+/)
      .map(t => t.trim().replace(/^#/, ""))
      .filter(Boolean);
    if (parsedTags.length === 0) return;

    if (onUpdateNotes) {
      const updatedNotes = notes.map(note => {
        if (selectedNoteIds.includes(note.id)) {
          const currentTags = note.tags || [];
          const combinedTags = Array.from(new Set([...currentTags, ...parsedTags]));
          return {
            ...note,
            tags: combinedTags
          };
        }
        return note;
      });
      onUpdateNotes(updatedNotes);
      setBatchTagsStr("");
      setBatchSuccessMessage(`成功为选中的 ${selectedNoteIds.length} 个词伙分配了标签: ${parsedTags.map(t => '#' + t).join(', ')}`);
      setTimeout(() => setBatchSuccessMessage(""), 4000);
    }
  };

  const handleBatchMoveToScene = (targetId: string) => {
    if (selectedNoteIds.length === 0 || !targetId) return;
    const targetScene = scenes.find(s => s.id === targetId);
    if (!targetScene) return;

    if (onUpdateNotes) {
      const updatedNotes = notes.map(note => {
        if (selectedNoteIds.includes(note.id)) {
          return {
            ...note,
            sceneId: targetId
          };
        }
        return note;
      });
      onUpdateNotes(updatedNotes);
      setBatchTargetSceneId("");
      const count = selectedNoteIds.length;
      setSelectedNoteIds([]);
      setBatchSuccessMessage(`成功将 ${count} 个词伙移动到了新场景: "${targetScene.name}"`);
      setTimeout(() => setBatchSuccessMessage(""), 4000);
    }
  };

  const handleExecuteBatchDelete = () => {
    if (selectedNoteIds.length === 0) return;
    if (onUpdateNotes) {
      const updatedNotes = notes.filter(note => !selectedNoteIds.includes(note.id));
      onUpdateNotes(updatedNotes);
      const count = selectedNoteIds.length;
      setSelectedNoteIds([]);
      setShowBatchDeleteConfirm(false);
      setBatchSuccessMessage(`成功删除了选中的 ${count} 个词伙`);
      setTimeout(() => setBatchSuccessMessage(""), 4000);
    }
  };

  // Extract all unique tags
  const allUniqueTags = Array.from(
    new Set(scenes.flatMap(scene => scene.tags || []))
  ).filter(Boolean);

  // Filter scenes by category and tags
  const filteredScenes = scenes.filter(scene => {
    const matchesTab = activeTab === "All" || scene.category === activeTab;
    const matchesSearch = scene.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTag = !selectedTag || (scene.tags && scene.tags.includes(selectedTag));
    return matchesTab && matchesSearch && matchesTag;
  });

  // Calculate dashboard statistics
  const totalScenesCount = scenes.length;
  const totalNotesCount = notes.length;
  const todayDueCount = notes.filter(n => {
    const nextDate = new Date(n.ebbinghaus.nextReviewDate).getTime();
    return nextDate <= Date.now();
  }).length;
  const masteredTotalCount = notes.filter(n => n.ebbinghaus.stage >= 4).length;

  const categoryStats = (["Daily", "Business", "Social", "Academic", "Custom"] as const).map(cat => {
    const catScenes = scenes.filter(s => s.category === cat);
    const catSceneIds = catScenes.map(s => s.id);
    const catNotes = notes.filter(n => catSceneIds.includes(n.sceneId));
    const catNotesCount = catNotes.length;
    const catMastered = catNotes.filter(n => n.ebbinghaus.stage >= 4).length;

    const labelMap: Record<SceneCategory, string> = {
      Daily: "日常生活 (Daily)",
      Business: "商务职场 (Business)",
      Social: "社交娱乐 (Social)",
      Academic: "学术探讨 (Academic)",
      Custom: "自定场景 (Custom)"
    };

    const colorMap: Record<SceneCategory, string> = {
      Daily: "#f59e0b",    // Amber
      Business: "#4f46e5", // Indigo
      Social: "#f43f5e",   // Rose
      Academic: "#10b981", // Emerald
      Custom: "#737373"    // Neutral Gray
    };

    return {
      category: cat,
      name: labelMap[cat].split(" (")[0],
      vocabularyCount: catNotesCount,
      scenesCount: catScenes.length,
      masteredCount: catMastered,
      color: colorMap[cat]
    };
  });

  const pieData = categoryStats.filter(stat => stat.vocabularyCount > 0);

  const getCategoryIcon = (category: SceneCategory) => {
    switch (category) {
      case "Daily": return <Smile className="w-4 h-4 text-emerald-500" />;
      case "Business": return <Briefcase className="w-4 h-4 text-indigo-500" />;
      case "Social": return <Users className="w-4 h-4 text-pink-500" />;
      case "Academic": return <GraduationCap className="w-4 h-4 text-amber-500" />;
      default: return <Sparkles className="w-4 h-4 text-violet-500" />;
    }
  };

  const handleCreateScene = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSceneName.trim()) return;

    const parsedTags = newSceneTagsStr
      .split(/[,，\s]+/)
      .map(t => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const newScene: SpeakingScene = {
      id: `scene_${Date.now()}`,
      name: newSceneName,
      category: newSceneCat,
      thinkingChainType: newSceneChainType,
      thinkingChainDescription: newSceneChainDesc || (newSceneChainType === "descriptive" 
        ? "描述类：场景背景 ➔ 细节动作 ➔ 个人感受" 
        : "交流类：回应核心 ➔ 补充细节 ➔ 抛回话题"),
      speakingPracticePrompt: newScenePrompt || "Please speak on this scene utilizing your accumulated phrases.",
      isCustom: true,
      tags: parsedTags
    };

    onAddScene(newScene);
    setNewSceneName("");
    setNewSceneChainDesc("");
    setNewScenePrompt("");
    setNewSceneTagsStr("");
    setShowAddScene(false);
    setSelectedSceneId(newScene.id);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSceneId || !newNoteExpression.trim()) return;

    const parsedTags = newNoteTagsStr
      .split(/[,，\s]+/)
      .map(t => t.trim().replace(/^#/, ""))
      .filter(Boolean);

    const typeLabel = newNoteType === "collocation" ? "核心词伙" : newNoteType === "sentence" ? "功能句型" : newNoteType === "filler" ? "语气填充词" : "AI大数据补充";
    if (!parsedTags.includes(typeLabel)) {
      parsedTags.push(typeLabel);
    }

    const newNote: NoteItem = {
      id: `note_${Date.now()}`,
      sceneId: selectedSceneId,
      expression: newNoteExpression,
      standard: newNoteStandard,
      native: newNoteNative,
      memoryHook: `[${typeLabel === "语气填充词" ? "语气填充" : typeLabel === "AI大数据补充" ? "AI补充" : typeLabel}] \n💡 ${newNoteHook}`,
      example: newNoteExample,
      createdAt: new Date().toISOString(),
      ebbinghaus: {
        stage: 0,
        nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 24 hours later
        reviewHistory: []
      },
      tags: parsedTags,
      type: newNoteType
    };

    onAddNote(newNote);
    setNewNoteExpression("");
    setNewNoteStandard("");
    setNewNoteNative("");
    setNewNoteHook("");
    setNewNoteExample("");
    setNewNoteTagsStr("");
    setShowAddNote(false);
  };

  const toggleSelectNote = (noteId: string) => {
    setSelectedNoteIds(prev => 
      prev.includes(noteId) 
        ? prev.filter(id => id !== noteId) 
        : [...prev, noteId]
    );
  };

  const selectedScene = scenes.find(s => s.id === selectedSceneId);
  const rawSceneNotes = notes.filter(n => n.sceneId === selectedSceneId);
  const sceneNotes = rawSceneNotes.filter(n => {
    if (linguisticTypeTab === "all") return true;
    const nType = n.type || (n.tags?.includes("功能句型") ? "sentence" : (n.tags?.includes("语气填充") || n.tags?.includes("语气填充词")) ? "filler" : n.tags?.includes("AI大数据补充") ? "supplement" : "collocation");
    return nType === linguisticTypeTab;
  });

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="corpus-library-root">
      
      {/* HEADER BLOCK */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-200/50 pb-6 mb-8">
        <div>
          <span className="text-[10px] text-amber-600 font-mono tracking-widest uppercase block">
            ACCUMULATED COGNITIVE WEALTH
          </span>
          <h2 className="text-2xl font-light tracking-wide text-neutral-900 mt-1 font-serif">
            场景口语精准同境词库
          </h2>
          <p className="text-xs text-neutral-400 mt-1 leading-normal">
            打包语境的高频地道原生表达 • 去模板化口语的核心词伙
          </p>
        </div>

        {!selectedSceneId && (
          <div className="flex flex-wrap items-center gap-2.5 self-start md:self-auto">
            <button
              onClick={() => setShowDashboard(!showDashboard)}
              className={`px-3.5 py-2 border rounded-xl text-[12px] font-medium transition-all flex items-center gap-1.5 cursor-pointer shadow-xs ${
                showDashboard 
                  ? "bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100" 
                  : "bg-white border-neutral-200 hover:bg-neutral-50 text-neutral-600"
              }`}
              title="切换语料数据可视化分析看板"
              id="toggle-dashboard-button"
            >
              <Layers className="w-4 h-4 text-indigo-600" />
              <span>{showDashboard ? "隐藏数据看板" : "语料数据看板"}</span>
            </button>

            <button
              onClick={() => setShowAddScene(true)}
              className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
              id="add-scene-button"
            >
              <Plus className="w-4 h-4" />
              <span>创建口语新场景</span>
            </button>
          </div>
        )}
      </div>

      {/* VIEW PANEL SPLITTER */}
      {!selectedSceneId ? (
        // ==========================================
        // SCENE LIST FOLDERS VIEW
        // ==========================================
        <div className="space-y-6">

          {/* VISUAL ANALYTICS DASHBOARD */}
          <AnimatePresence>
            {showDashboard && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -15 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -15 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden select-text"
                id="corpus-analytics-dashboard"
              >
                <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-xs space-y-5 mb-1">
                  
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between pb-3 border-b border-neutral-100">
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 bg-indigo-50 rounded-lg text-indigo-600">
                        <Sparkles className="w-4 h-4 text-indigo-600 animate-pulse" />
                      </span>
                      <div>
                        <h3 className="text-sm font-medium text-neutral-800 font-serif">
                          📊 语料积累多维分析看板
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-light">
                          自动统计积累的场景类别和艾宾浩斯记忆曲线掌握状态
                        </p>
                      </div>
                    </div>
                    <span className="text-[9px] font-mono font-medium text-indigo-600 bg-indigo-50 border border-indigo-100 px-2 py-0.5 rounded-md uppercase">
                      Real-time Stats
                    </span>
                  </div>

                  {/* Summary Metric Badges Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div className="bg-neutral-50/50 border border-neutral-200/30 p-3 rounded-xl hover:bg-neutral-50 hover:border-neutral-200 transition-all text-center sm:text-left">
                      <span className="text-[10px] text-neutral-400 font-medium block">
                        📂 口语总场景
                      </span>
                      <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-xl font-bold font-mono text-neutral-800">
                          {totalScenesCount}
                        </span>
                        <span className="text-[10px] text-neutral-400">个</span>
                      </div>
                    </div>

                    <div className="bg-neutral-50/50 border border-neutral-200/30 p-3 rounded-xl hover:bg-neutral-50 hover:border-neutral-200 transition-all text-center sm:text-left">
                      <span className="text-[10px] text-neutral-400 font-medium block">
                        🔑 语料词库量
                      </span>
                      <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-xl font-bold font-mono text-indigo-600">
                          {totalNotesCount}
                        </span>
                        <span className="text-[10px] text-indigo-400">词伙</span>
                      </div>
                    </div>

                    <div className="bg-neutral-50/50 border border-neutral-200/30 p-3 rounded-xl hover:bg-neutral-50 hover:border-neutral-200 transition-all text-center sm:text-left">
                      <span className="text-[10px] text-neutral-400 font-medium block">
                        ⏰ 今日待复习
                      </span>
                      <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-1">
                        <span className={`text-xl font-bold font-mono ${todayDueCount > 0 ? "text-amber-600 animate-pulse" : "text-emerald-600"}`}>
                          {todayDueCount}
                        </span>
                        <span className="text-[10px] text-neutral-400">项</span>
                      </div>
                    </div>

                    <div className="bg-neutral-50/50 border border-neutral-200/30 p-3 rounded-xl hover:bg-neutral-50 hover:border-neutral-200 transition-all text-center sm:text-left">
                      <span className="text-[10px] text-neutral-400 font-medium block">
                        🧠 深度记忆掌握
                      </span>
                      <div className="mt-1 flex items-baseline justify-center sm:justify-start gap-1">
                        <span className="text-xl font-bold font-mono text-emerald-600">
                          {masteredTotalCount}
                        </span>
                        <span className="text-[10px] text-neutral-400">
                          ({totalNotesCount > 0 ? Math.round((masteredTotalCount / totalNotesCount) * 100) : 0}%)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Charts Grid */}
                  {totalNotesCount === 0 ? (
                    <div className="text-center py-8 bg-neutral-50/40 rounded-xl border border-dashed border-neutral-200 flex flex-col items-center justify-center space-y-2">
                      <BookOpen className="w-8 h-8 text-neutral-300" />
                      <p className="text-xs text-neutral-500 font-medium">暂无词汇数据</p>
                      <p className="text-[10px] text-neutral-400 max-w-xs leading-normal">
                        在下方选择或创建任意场景，进入并添加你积累的原生表达，系统将实时为您绘制精美的数据统计图表！
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      
                      {/* Pie Chart Card */}
                      <div className="border border-neutral-200/40 rounded-xl p-4 bg-neutral-50/15 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-indigo-600 font-mono tracking-wider font-bold block uppercase">
                            🍩 词汇场景分布比率
                          </span>
                          <span className="text-[9px] text-neutral-400">各语境词汇占比</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          {/* Pie view */}
                          <div className="sm:col-span-5 flex justify-center relative">
                            <div className="w-full h-[130px] relative flex items-center justify-center">
                              <ResponsiveContainer width="100%" height="100%">
                                <PieChart>
                                  <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={40}
                                    outerRadius={55}
                                    paddingAngle={2}
                                    dataKey="vocabularyCount"
                                  >
                                    {pieData.map((entry, index) => (
                                      <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                  </Pie>
                                  <RechartsTooltip 
                                    contentStyle={{ 
                                      background: "rgba(255, 255, 255, 0.98)", 
                                      border: "1px solid #e5e7eb", 
                                      borderRadius: "8px", 
                                      fontSize: "10px",
                                      boxShadow: "0 2px 6px rgba(0,0,0,0.05)" 
                                    }}
                                    formatter={(value: any) => [`${value} 个词伙`, "已积累"]}
                                  />
                                </PieChart>
                              </ResponsiveContainer>
                              
                              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                                <span className="text-[14px] font-bold text-neutral-800 font-mono">
                                  {totalNotesCount}
                                </span>
                                <span className="text-[8px] text-neutral-400">
                                  词汇数
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Legend list */}
                          <div className="sm:col-span-7 space-y-1">
                            {categoryStats.map(stat => {
                              const pct = totalNotesCount > 0 ? Math.round((stat.vocabularyCount / totalNotesCount) * 100) : 0;
                              return (
                                <div key={stat.category} className="flex items-center justify-between text-[10px]">
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: stat.color }} />
                                    <span className="text-neutral-600 truncate">{stat.name}</span>
                                  </div>
                                  <div className="flex items-center gap-2 font-mono text-neutral-400 shrink-0">
                                    <span>{stat.vocabularyCount}词</span>
                                    <span className="font-semibold text-neutral-700 w-6 text-right">{pct}%</span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Bar Chart Card */}
                      <div className="border border-neutral-200/40 rounded-xl p-4 bg-neutral-50/15 flex flex-col justify-between">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-[10px] text-emerald-600 font-mono tracking-wider font-bold block uppercase">
                            📊 场景 vs 语料词汇量对比
                          </span>
                          <span className="text-[9px] text-neutral-400">文件夹与词汇数</span>
                        </div>

                        <div className="h-[130px] w-full text-[10px]">
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                              data={categoryStats}
                              margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                            >
                              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                              <XAxis 
                                dataKey="name" 
                                tick={{ fill: '#888888', fontSize: 8 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                              />
                              <YAxis 
                                tick={{ fill: '#888888', fontSize: 8 }}
                                axisLine={{ stroke: '#e5e7eb' }}
                                tickLine={false}
                              />
                              <RechartsTooltip
                                contentStyle={{ 
                                  background: "rgba(255, 255, 255, 0.98)", 
                                  border: "1px solid #e5e7eb", 
                                  borderRadius: "8px", 
                                  fontSize: "10px",
                                  boxShadow: "0 2px 6px rgba(0,0,0,0.05)" 
                                }}
                              />
                              <Bar dataKey="scenesCount" name="文件夹场景" fill="#cbd5e1" radius={[3, 3, 0, 0]} barSize={8} />
                              <Bar dataKey="vocabularyCount" name="积累词伙数" fill="#4f46e5" radius={[3, 3, 0, 0]} barSize={8} />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                    </div>
                  )}

                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* SEARCH & FILTERS */}
          <div className="space-y-3.5">
            <div className="flex flex-col sm:flex-row items-center gap-3.5">
              {/* Search Input */}
              <div className="relative w-full sm:w-72">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="搜索口语场景..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100/60 hover:bg-neutral-100 border border-neutral-200/40 rounded-xl text-[12px] focus:outline-hidden focus:ring-1 focus:ring-neutral-400 focus:bg-white transition-all font-light"
                  id="scene-search"
                />
              </div>

              {/* Category Tabs */}
              <div className="flex items-center gap-1 bg-neutral-100/60 p-1 rounded-xl border border-neutral-200/40 self-stretch sm:self-auto overflow-x-auto">
                {(["All", "Daily", "Business", "Social", "Academic"] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`px-3 py-1.5 rounded-lg text-[11px] font-medium transition-all whitespace-nowrap cursor-pointer ${
                      activeTab === tab 
                        ? "bg-white text-neutral-900 shadow-3xs" 
                        : "text-neutral-500 hover:text-neutral-800"
                    }`}
                  >
                    {tab === "All" ? "全部" : tab}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags quick filter buttons */}
            {allUniqueTags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 bg-neutral-50/50 p-3 rounded-xl border border-neutral-200/30">
                <span className="text-[10px] text-neutral-400 font-mono uppercase font-semibold flex items-center gap-1">
                  <Tag className="w-3 h-3 text-indigo-500" />
                  标签过滤:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {allUniqueTags.map(tag => {
                    const isSelected = selectedTag === tag;
                    return (
                      <button
                        key={tag}
                        onClick={() => setSelectedTag(isSelected ? null : tag)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] transition-all cursor-pointer border ${
                          isSelected
                            ? "bg-indigo-600 text-white border-indigo-600 font-medium shadow-3xs"
                            : "bg-white hover:bg-neutral-50 text-neutral-600 border-neutral-200"
                        }`}
                      >
                        #{tag}
                      </button>
                    );
                  })}
                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag(null)}
                      className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium font-mono px-2 py-1 cursor-pointer hover:underline"
                    >
                      [清除筛选]
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* GRID OF SCENE FOLDERS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="scene-folders-grid">
            {filteredScenes.map(scene => {
              const count = notes.filter(n => n.sceneId === scene.id).length;
              return (
                <motion.div
                  key={scene.id}
                  layoutId={`scene-folder-${scene.id}`}
                  whileHover={{ y: -3, scale: 1.01 }}
                  onClick={() => setSelectedSceneId(scene.id)}
                  className="bg-white border border-neutral-200/55 rounded-2xl p-5 shadow-3xs hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between aspect-16/11 relative group"
                  id={`folder-${scene.id}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="p-2.5 bg-neutral-50 rounded-xl border border-neutral-100">
                      {getCategoryIcon(scene.category)}
                    </div>
                    <span className="text-[10px] font-mono tracking-wider bg-neutral-50 border border-neutral-100 px-2 py-0.5 rounded-full text-neutral-500">
                      {scene.category}
                    </span>
                  </div>

                  <div className="mt-4">
                    <h3 className="text-[14px] font-medium text-neutral-800 leading-snug group-hover:text-neutral-950">
                      {scene.name}
                    </h3>
                    <p className="text-[10px] text-neutral-400 mt-1 leading-normal line-clamp-2">
                      {scene.thinkingChainDescription}
                    </p>
                    {scene.tags && scene.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2.5">
                        {scene.tags.map(tag => (
                          <span
                            key={tag}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedTag(selectedTag === tag ? null : tag);
                            }}
                            className={`text-[9px] px-1.5 py-0.5 rounded transition-all cursor-pointer border ${
                              selectedTag === tag
                                ? "bg-indigo-600 text-white border-indigo-600 font-medium"
                                : "bg-neutral-50 hover:bg-indigo-50 hover:text-indigo-600 text-neutral-500 border-neutral-200/50"
                            }`}
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between text-[11px] text-neutral-400">
                    <span className="font-mono">{count} 个高频词伙</span>
                    <span className="flex items-center gap-0.5 group-hover:translate-x-0.5 transition-transform">
                      打开目录
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                  
                  {scene.isCustom && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm("确定要删除该场景及包含的所有短语吗？")) {
                          onDeleteScene(scene.id);
                        }
                      }}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-neutral-300 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="删除场景"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}

            {filteredScenes.length === 0 && (
              <div className="col-span-full py-16 text-center border-2 border-dashed border-neutral-200 rounded-2xl">
                <FolderHeart className="w-8 h-8 text-neutral-300 mx-auto mb-2" />
                <p className="text-neutral-400 text-xs font-light">
                  未找到符合要求的口语场景。
                </p>
              </div>
            )}
          </div>

        </div>
      ) : (
        // ==========================================
        // SINGLE SCENE DETAIL VIEW (INSIDE FOLDER)
        // ==========================================
        <div className="space-y-6">
          
          {/* BACK NAVIGATION BAR */}
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSelectedSceneId(null)}
              className="flex items-center gap-1.5 text-neutral-500 hover:text-neutral-900 text-xs transition-colors cursor-pointer"
              id="back-to-list-button"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>返回场景文件夹</span>
            </button>

            <button
              onClick={() => setShowAddNote(true)}
              className="px-3.5 py-1.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[11px] font-medium transition-colors flex items-center gap-1 cursor-pointer"
              id="add-phrase-button"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>添加高频原生短语</span>
            </button>
          </div>

          {/* ACTIVE SCENE HEADER CARD */}
          {selectedScene && (
            <motion.div 
              layoutId={`scene-folder-${selectedScene.id}`}
              className="bg-neutral-50 rounded-2xl border border-neutral-200/40 p-5 md:p-6"
            >
              <div className="flex items-center gap-2">
                {getCategoryIcon(selectedScene.category)}
                <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider">
                  {selectedScene.category} SECTION
                </span>
              </div>
              <h3 className="text-[18px] font-medium text-neutral-900 mt-2 font-serif">
                {selectedScene.name}
              </h3>

              {/* CORE THINKING CHAIN CARD */}
              <div className="mt-4 p-4 bg-white border border-neutral-200/30 rounded-xl">
                <span className="text-[10px] font-mono tracking-widest text-indigo-600 font-medium block">
                  🧠 UNDERLYING LOGIC • 底层思维链条
                </span>
                <p className="text-xs text-neutral-700 leading-relaxed mt-2">
                  {selectedScene.thinkingChainDescription}
                </p>
              </div>

              {/* PRACTICE TASK PREVIEW */}
              <div className="mt-3 p-4 bg-indigo-50/50 border border-indigo-100/30 rounded-xl flex items-start gap-3">
                <Sparkles className="w-4 h-4 text-indigo-500 mt-0.5 flex-shrink-0" />
                <div>
                  <span className="text-[10px] font-mono tracking-widest text-indigo-600 font-medium block">
                    🎙️ SPEAKING PRACTICE PROMPT • 口语提问
                  </span>
                  <p className="text-xs text-indigo-900 font-light mt-1.5 leading-relaxed italic">
                    "{selectedScene.speakingPracticePrompt}"
                  </p>
                </div>
              </div>

              {/* TAG SYSTEM SECTION inside the scene detail */}
              <div className="mt-4 pt-4 border-t border-neutral-200/40">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[10px] text-neutral-400 font-mono uppercase tracking-wider font-semibold flex items-center gap-1">
                    <Tag className="w-3.5 h-3.5 text-indigo-500" />
                    场景标签:
                  </span>
                  
                  {/* Render tags */}
                  {selectedScene.tags && selectedScene.tags.length > 0 ? (
                    selectedScene.tags.map(tag => (
                      <span
                        key={tag}
                        className="inline-flex items-center gap-1 text-[10px] bg-white border border-neutral-200/60 px-2 py-0.5 rounded-full text-neutral-600 hover:border-red-200 hover:bg-red-50 hover:text-red-600 transition-all group cursor-pointer"
                        title="点击删除该标签"
                        onClick={() => {
                          if (onUpdateScene) {
                            const updatedTags = (selectedScene.tags || []).filter(t => t !== tag);
                            onUpdateScene({
                              ...selectedScene,
                              tags: updatedTags
                            });
                          }
                        }}
                      >
                        <span>#{tag}</span>
                        <span className="text-[8px] text-neutral-300 group-hover:text-red-400 font-bold">×</span>
                      </span>
                    ))
                  ) : (
                    <span className="text-[10px] text-neutral-400 italic">暂无标签</span>
                  )}

                  {/* Add Tag Inline Form */}
                  <div className="inline-flex items-center ml-1">
                    <input
                      type="text"
                      placeholder="+ 新增标签"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          const val = (e.target as HTMLInputElement).value.trim().replace(/^#/, "");
                          if (val && onUpdateScene) {
                            const currentTags = selectedScene.tags || [];
                            if (!currentTags.includes(val)) {
                              onUpdateScene({
                                ...selectedScene,
                                tags: [...currentTags, val]
                              });
                            }
                            (e.target as HTMLInputElement).value = "";
                          }
                        }
                      }}
                      className="px-2.5 py-0.5 border border-dashed border-neutral-300 rounded-full text-[10px] bg-white text-neutral-600 focus:outline-hidden focus:border-neutral-400 focus:ring-0 w-24 hover:border-neutral-400 transition-all font-light"
                      title="输入标签后按回车键确认"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* LINGUISTIC CATEGORY TABS */}
          <div className="flex items-center gap-1.5 bg-neutral-100/75 p-1 rounded-xl border border-neutral-200/50 overflow-x-auto">
            {[
              { id: "all", label: "全部 (All)", count: rawSceneNotes.length },
              { id: "collocation", label: "核心词伙 (Collocations)", count: rawSceneNotes.filter(n => (n.type || (n.tags?.includes("功能句型") ? "sentence" : (n.tags?.includes("语气填充") || n.tags?.includes("语气填充词")) ? "filler" : n.tags?.includes("AI大数据补充") ? "supplement" : "collocation")) === "collocation").length },
              { id: "sentence", label: "功能句型 (Sentences)", count: rawSceneNotes.filter(n => (n.type || (n.tags?.includes("功能句型") ? "sentence" : (n.tags?.includes("语气填充") || n.tags?.includes("语气填充词")) ? "filler" : n.tags?.includes("AI大数据补充") ? "supplement" : "collocation")) === "sentence").length },
              { id: "filler", label: "语气填充词 (Fillers)", count: rawSceneNotes.filter(n => (n.type || (n.tags?.includes("功能句型") ? "sentence" : (n.tags?.includes("语气填充") || n.tags?.includes("语气填充词")) ? "filler" : n.tags?.includes("AI大数据补充") ? "supplement" : "collocation")) === "filler").length },
              { id: "supplement", label: "AI 大数据补充 (Supplements)", count: rawSceneNotes.filter(n => (n.type || (n.tags?.includes("功能句型") ? "sentence" : (n.tags?.includes("语气填充") || n.tags?.includes("语气填充词")) ? "filler" : n.tags?.includes("AI大数据补充") ? "supplement" : "collocation")) === "supplement").length },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setLinguisticTypeTab(tab.id as any);
                  setSelectedNoteIds([]); // reset selection when toggling tabs
                }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap cursor-pointer flex items-center gap-1.5 border ${
                  linguisticTypeTab === tab.id
                    ? "bg-neutral-900 border-neutral-950 text-white shadow-2xs"
                    : "bg-white text-neutral-500 border-neutral-200 hover:text-neutral-800 hover:bg-neutral-55"
                }`}
              >
                <span>{tab.label}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold font-mono ${
                  linguisticTypeTab === tab.id
                    ? "bg-white/20 text-white"
                    : "bg-neutral-100 text-neutral-500"
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          {/* LIST OF ACCUMULATED EXPRESSIONS */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold text-neutral-400 tracking-wider font-mono uppercase">
                本场景积累语料库 ({sceneNotes.length})
              </h4>
              
              {sceneNotes.length > 0 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      if (selectedNoteIds.length === sceneNotes.length) {
                        setSelectedNoteIds([]);
                      } else {
                        setSelectedNoteIds(sceneNotes.map(n => n.id));
                      }
                    }}
                    className="text-[10px] text-neutral-500 hover:text-indigo-600 font-medium font-mono cursor-pointer transition-colors bg-neutral-100 hover:bg-indigo-50 px-2 py-1 rounded"
                  >
                    {selectedNoteIds.length === sceneNotes.length ? "取消全选" : "全选本页"}
                  </button>
                </div>
              )}
            </div>

            {/* SUCCESS BANNER */}
            <AnimatePresence>
              {batchSuccessMessage && (
                <motion.div
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -5 }}
                  className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] px-4 py-2.5 rounded-xl font-medium flex items-center justify-between"
                >
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>{batchSuccessMessage}</span>
                  </div>
                  <button onClick={() => setBatchSuccessMessage("")} className="text-emerald-400 hover:text-emerald-600">
                    <X className="w-3 h-3" />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            {/* BATCH CONTROL BOARD */}
            <AnimatePresence>
              {selectedNoteIds.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: "auto", y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="bg-indigo-50/70 border border-indigo-100 rounded-2xl p-4 space-y-3 shadow-3xs overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-indigo-100/40 pb-2.5">
                    <div className="flex items-center gap-2">
                      <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] font-bold text-white font-mono">
                        {selectedNoteIds.length}
                      </span>
                      <span className="text-[12px] font-medium text-neutral-800 font-serif">
                        已选择 <span className="font-bold font-mono text-indigo-600">{selectedNoteIds.length}</span> 个词伙
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedNoteIds(sceneNotes.map(n => n.id))}
                        className="text-[9px] text-indigo-700 hover:text-indigo-950 font-medium font-mono cursor-pointer bg-white px-2.5 py-1 rounded-md border border-indigo-200/40 hover:border-indigo-300/60 transition-all shadow-3xs"
                      >
                        全选
                      </button>
                      <button
                        onClick={() => setSelectedNoteIds([])}
                        className="text-[9px] text-neutral-500 hover:text-neutral-800 font-medium font-mono cursor-pointer bg-white px-2.5 py-1 rounded-md border border-neutral-200 hover:border-neutral-300 transition-all shadow-3xs"
                      >
                        取消
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-0.5">
                    {/* Batch tags */}
                    <div className="bg-white/90 rounded-xl p-3 border border-indigo-100/20 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-600">
                        <Tag className="w-3.5 h-3.5 text-indigo-500" />
                        <span>批量分配标签 (Assign Tags)</span>
                      </div>
                      <div className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder="新标签 (多个用逗号或空格隔开)"
                          value={batchTagsStr}
                          onChange={e => setBatchTagsStr(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] focus:outline-hidden focus:bg-white focus:border-indigo-400 transition-all font-light"
                        />
                        <button
                          onClick={handleBatchAssignTags}
                          disabled={!batchTagsStr.trim()}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-[10px] font-medium transition-colors cursor-pointer shrink-0"
                        >
                          分配
                        </button>
                      </div>
                    </div>

                    {/* Batch Move Scene Category */}
                    <div className="bg-white/90 rounded-xl p-3 border border-indigo-100/20 flex flex-col justify-between space-y-2">
                      <div className="flex items-center gap-1.5 text-[10px] font-semibold text-neutral-600">
                        <FolderInput className="w-3.5 h-3.5 text-indigo-500" />
                        <span>批量移动场景 (Move to Scene)</span>
                      </div>
                      <div className="flex gap-1.5">
                        <select
                          value={batchTargetSceneId}
                          onChange={e => setBatchTargetSceneId(e.target.value)}
                          className="flex-1 px-2 py-1.5 bg-neutral-50 border border-neutral-200 rounded-lg text-[11px] focus:outline-hidden focus:bg-white focus:border-indigo-400 transition-all font-light cursor-pointer"
                        >
                          <option value="">-- 选择目标分类场景 --</option>
                          {scenes
                            .filter(s => s.id !== selectedSceneId)
                            .map(s => (
                              <option key={s.id} value={s.id}>
                                {s.name} ({s.category})
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() => handleBatchMoveToScene(batchTargetSceneId)}
                          disabled={!batchTargetSceneId}
                          className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-lg text-[10px] font-medium transition-colors cursor-pointer shrink-0"
                        >
                          移动
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 border-t border-indigo-100/30 gap-2">
                    <span className="text-[9px] text-neutral-400 font-mono">
                      * 分配标签支持增量合并。移动至其他场景时，本场景对应词伙数会减少。
                    </span>

                    <div>
                      {!showBatchDeleteConfirm ? (
                        <button
                          onClick={() => setShowBatchDeleteConfirm(true)}
                          className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 rounded-lg text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>批量删除所选</span>
                        </button>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-50 border border-red-100 px-3 py-1 rounded-lg">
                          <span className="text-[10px] font-semibold text-red-700">彻底删除选中的 {selectedNoteIds.length} 项？</span>
                          <button
                            onClick={handleExecuteBatchDelete}
                            className="text-[9px] bg-red-600 hover:bg-red-700 text-white font-bold px-2 py-0.5 rounded cursor-pointer"
                          >
                            确定
                          </button>
                          <button
                            onClick={() => setShowBatchDeleteConfirm(false)}
                            className="text-[9px] bg-neutral-200 hover:bg-neutral-300 text-neutral-700 font-bold px-2 py-0.5 rounded cursor-pointer"
                          >
                            取消
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 gap-4" id="notes-list">
              {sceneNotes.map(note => {
                const isSelected = selectedNoteIds.includes(note.id);
                return (
                  <div 
                    key={note.id}
                    className={`bg-white border rounded-xl p-5 shadow-3xs transition-all relative group flex items-start gap-4 ${
                      isSelected ? "border-indigo-500/50 ring-1 ring-indigo-500/20" : "border-neutral-200/40 hover:border-neutral-200"
                    }`}
                    id={`note-card-${note.id}`}
                  >
                    {/* Checkbox */}
                    <div 
                      className="flex-shrink-0 mt-1 cursor-pointer" 
                      onClick={() => toggleSelectNote(note.id)}
                    >
                      {isSelected ? (
                        <div className="w-5 h-5 rounded-full bg-indigo-600 flex items-center justify-center text-white shadow-3xs transition-all scale-105">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                      ) : (
                        <div className="w-5 h-5 rounded-full border border-neutral-300 hover:border-indigo-500 transition-all bg-neutral-50" />
                      )}
                    </div>

                    {/* Content body */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                        <div className="space-y-1.5">
                          <span className="text-[14px] font-mono text-neutral-900 font-medium bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100 inline-block">
                            {note.expression}
                          </span>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1">
                              {note.tags.map(tag => (
                                <span
                                  key={tag}
                                  className="text-[9px] text-indigo-600 bg-indigo-50/40 border border-indigo-100/10 px-1.5 py-0.5 rounded font-mono"
                                >
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-2 self-start md:self-auto">
                          <span className="text-[9px] font-mono text-neutral-400 bg-neutral-50 px-2 py-0.5 rounded-full flex items-center gap-1 border border-neutral-100">
                            <Calendar className="w-3 h-3" />
                            <span>艾宾浩斯阶段: {note.ebbinghaus.stage}</span>
                          </span>
                        </div>
                      </div>

                      {/* Contrast Table */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-neutral-50/50 p-4 rounded-xl border border-neutral-100 text-[12px] leading-relaxed">
                        <div>
                          <span className="text-[10px] font-medium text-neutral-400 block mb-1">
                            ❌ 中式普通表达 / Textbook standard:
                          </span>
                          <p className="text-neutral-600 font-light">{note.standard}</p>
                        </div>
                        <div className="md:border-l border-neutral-200/60 md:pl-4">
                          <span className="text-[10px] font-medium text-emerald-600 block mb-1">
                            🏆 纯正原生说法 / Native alternative:
                          </span>
                          <p className="text-neutral-800 font-medium">{note.native}</p>
                        </div>
                      </div>

                      {/* Memory Hook */}
                      <div className="mt-3.5 flex items-start gap-2.5 bg-amber-50/40 p-3.5 rounded-xl border border-amber-100/30 text-xs">
                        <span className="text-amber-500 font-bold flex-shrink-0 mt-0.5">💡</span>
                        <div>
                          <span className="font-semibold text-neutral-800">记忆挂钩 (Association):</span>
                          <p className="text-neutral-600 mt-1 font-light leading-relaxed">{note.memoryHook}</p>
                        </div>
                      </div>

                      {/* Real Example */}
                      {note.example && (
                        <div className="mt-3 flex items-start gap-2.5 bg-indigo-50/20 p-3.5 rounded-xl border border-indigo-100/20 text-xs">
                          <span className="text-indigo-500 font-bold flex-shrink-0 mt-0.5">💬</span>
                          <div>
                            <span className="font-semibold text-neutral-800">场景实战造句 (Real Context):</span>
                            <p className="text-neutral-700 italic mt-1 font-mono leading-relaxed">"{note.example}"</p>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Absolute Delete Button */}
                    <button
                      onClick={() => {
                        if (confirm("确定要删除该笔记条目吗？")) {
                          onDeleteNote(note.id);
                        }
                      }}
                      className="absolute top-4 right-4 p-1.5 hover:bg-red-50 text-neutral-300 hover:text-red-500 rounded-md opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                      title="删除短语"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                );
              })}

              {sceneNotes.length === 0 && (
                <div className="py-12 text-center border-2 border-dashed border-neutral-100 rounded-xl bg-neutral-50/30">
                  <BookOpen className="w-6 h-6 text-neutral-300 mx-auto mb-2" />
                  <p className="text-neutral-400 text-xs font-light">
                    本场景暂未积累任何高频原生表达。
                  </p>
                  <button
                    onClick={() => setShowAddNote(true)}
                    className="mt-3 px-3 py-1.5 bg-neutral-200/50 hover:bg-neutral-200 text-neutral-700 rounded-lg text-[10px] font-medium transition-colors cursor-pointer"
                  >
                    现在添加第一个
                  </button>
                </div>
              )}
            </div>

          </div>

        </div>
      )}

      {/* ======================================================= */}
      {/* ADD SCENE MODAL POPUP */}
      {/* ======================================================= */}
      <AnimatePresence>
        {showAddScene && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
              id="add-scene-modal"
            >
              <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-200/50 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase font-mono">
                  NEW SCENE • 创建场景
                </span>
                <button 
                  onClick={() => setShowAddScene(false)}
                  className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateScene} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">场景名称 (SCENE NAME):</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: Asking for a Raise at Work"
                    value={newSceneName}
                    onChange={e => setNewSceneName(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">分类 (CATEGORY):</label>
                    <select
                      value={newSceneCat}
                      onChange={e => setNewSceneCat(e.target.value as SceneCategory)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light"
                    >
                      <option value="Daily">Daily (日常)</option>
                      <option value="Business">Business (商务)</option>
                      <option value="Social">Social (社交)</option>
                      <option value="Academic">Academic (学术)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">思维链类型 (LOGIC CHAIN):</label>
                    <select
                      value={newSceneChainType}
                      onChange={e => setNewSceneChainType(e.target.value as "descriptive" | "interactive")}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light"
                    >
                      <option value="descriptive">Descriptive (描述类)</option>
                      <option value="interactive">Interactive (互动交流类)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">底层思维逻辑描述 (THINKING FLOW):</label>
                  <textarea
                    rows={2}
                    placeholder="例如：背景铺垫 ➔ 矛盾行动 ➔ 终极建议"
                    value={newSceneChainDesc}
                    onChange={e => setNewSceneChainDesc(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">口语实战提问 (PRACTICE PROMPT):</label>
                  <textarea
                    rows={3}
                    placeholder="在此场景下向你提出什么问题？"
                    value={newScenePrompt}
                    onChange={e => setNewScenePrompt(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">标签 (TAGS - 逗号或空格分隔):</label>
                  <input
                    type="text"
                    placeholder="例如: 商务, 面试, 地道表达"
                    value={newSceneTagsStr}
                    onChange={e => setNewSceneTagsStr(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowAddScene(false)}
                    className="px-4 py-2 hover:bg-neutral-100 rounded-xl text-[12px] text-neutral-500 font-medium transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    确定创建
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* ADD NOTE/PHRASE MODAL POPUP */}
        {showAddNote && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-neutral-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-neutral-200 overflow-hidden"
              id="add-note-modal"
            >
              <div className="px-5 py-4 bg-neutral-50 border-b border-neutral-200/50 flex items-center justify-between">
                <span className="text-xs font-semibold tracking-wider text-neutral-500 uppercase font-mono">
                  NEW PHRASE • 添加地道短语
                </span>
                <button 
                  onClick={() => setShowAddNote(false)}
                  className="p-1 hover:bg-neutral-200 rounded-lg text-neutral-400 hover:text-neutral-800 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateNote} className="p-5 space-y-4">
                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">原生短语 (EXPRESSION / COLLOCATION):</label>
                  <input
                    type="text"
                    required
                    placeholder="例如: Grab a bite"
                    value={newNoteExpression}
                    onChange={e => setNewNoteExpression(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">语言结构类型 (LINGUISTIC TYPE):</label>
                  <select
                    value={newNoteType}
                    onChange={e => setNewNoteType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light"
                  >
                    <option value="collocation">核心词伙 (Collocation)</option>
                    <option value="sentence">功能句型 (Sentence)</option>
                    <option value="filler">语气填充词 (Mood Filler)</option>
                    <option value="supplement">AI 大数据补充 (Supplement)</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-neutral-400 block mb-1">中式/教材普通说法 (STANDARD):</label>
                    <input
                      type="text"
                      required
                      placeholder="例如: I want to eat food"
                      value={newNoteStandard}
                      onChange={e => setNewNoteStandard(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-semibold text-emerald-600 block mb-1">原生/地道表达 (NATIVE ALTERNATIVE):</label>
                    <input
                      type="text"
                      required
                      placeholder="例如: Let's grab a quick bite"
                      value={newNoteNative}
                      onChange={e => setNewNoteNative(e.target.value)}
                      className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">记忆点挂钩 (諧音/联想法 MEMORY HOOK):</label>
                  <textarea
                    rows={2}
                    required
                    placeholder="例如：Bite是咬，口语里常指‘一顿简餐’。画面想象顺手‘咬一口’，非常适合形容快餐、赶时间的对话。"
                    value={newNoteHook}
                    onChange={e => setNewNoteHook(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">场景造句实战 (CONTEXT EXAMPLE):</label>
                  <textarea
                    rows={2}
                    placeholder="例如: We only have 10 minutes, let's grab a bite at the bakery."
                    value={newNoteExample}
                    onChange={e => setNewNoteExample(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white transition-all font-light resize-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-neutral-400 block mb-1">标签 (TAGS - 逗号或空格分隔):</label>
                  <input
                    type="text"
                    placeholder="例如: 重点, 地道, 高频"
                    value={newNoteTagsStr}
                    onChange={e => setNewNoteTagsStr(e.target.value)}
                    className="w-full px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-hidden focus:bg-white focus:border-neutral-400 transition-all font-light"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-3 border-t border-neutral-100">
                  <button
                    type="button"
                    onClick={() => setShowAddNote(false)}
                    className="px-4 py-2 hover:bg-neutral-100 rounded-xl text-[12px] text-neutral-500 font-medium transition-colors cursor-pointer"
                  >
                    取消
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-medium transition-colors cursor-pointer"
                  >
                    确定添加
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
