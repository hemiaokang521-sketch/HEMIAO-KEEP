import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
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
  Share2
} from "lucide-react";
import { SpeakingScene, NoteItem, SceneCategory } from "../types";

interface CorpusLibraryProps {
  scenes: SpeakingScene[];
  notes: NoteItem[];
  onAddScene: (scene: SpeakingScene) => void;
  onAddNote: (note: NoteItem) => void;
  onDeleteNote: (noteId: string) => void;
  onDeleteScene: (sceneId: string) => void;
}

export default function CorpusLibrary({ 
  scenes, 
  notes, 
  onAddScene, 
  onAddNote, 
  onDeleteNote,
  onDeleteScene
}: CorpusLibraryProps) {
  const [selectedSceneId, setSelectedSceneId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<SceneCategory | "All">("All");

  // State for forms
  const [showAddScene, setShowAddScene] = useState(false);
  const [showAddNote, setShowAddNote] = useState(false);

  // New Scene Form inputs
  const [newSceneName, setNewSceneName] = useState("");
  const [newSceneCat, setNewSceneCat] = useState<SceneCategory>("Daily");
  const [newSceneChainType, setNewSceneChainType] = useState<"descriptive" | "interactive">("descriptive");
  const [newSceneChainDesc, setNewSceneChainDesc] = useState("");
  const [newScenePrompt, setNewScenePrompt] = useState("");

  // New Note Form inputs
  const [newNoteExpression, setNewNoteExpression] = useState("");
  const [newNoteStandard, setNewNoteStandard] = useState("");
  const [newNoteNative, setNewNoteNative] = useState("");
  const [newNoteHook, setNewNoteHook] = useState("");
  const [newNoteExample, setNewNoteExample] = useState("");

  // Filter scenes by category
  const filteredScenes = scenes.filter(scene => {
    const matchesTab = activeTab === "All" || scene.category === activeTab;
    const matchesSearch = scene.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

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

    const newScene: SpeakingScene = {
      id: `scene_${Date.now()}`,
      name: newSceneName,
      category: newSceneCat,
      thinkingChainType: newSceneChainType,
      thinkingChainDescription: newSceneChainDesc || (newSceneChainType === "descriptive" 
        ? "描述类：场景背景 ➔ 细节动作 ➔ 个人感受" 
        : "交流类：回应核心 ➔ 补充细节 ➔ 抛回话题"),
      speakingPracticePrompt: newScenePrompt || "Please speak on this scene utilizing your accumulated phrases.",
      isCustom: true
    };

    onAddScene(newScene);
    setNewSceneName("");
    setNewSceneChainDesc("");
    setNewScenePrompt("");
    setShowAddScene(false);
    setSelectedSceneId(newScene.id);
  };

  const handleCreateNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSceneId || !newNoteExpression.trim()) return;

    const newNote: NoteItem = {
      id: `note_${Date.now()}`,
      sceneId: selectedSceneId,
      expression: newNoteExpression,
      standard: newNoteStandard,
      native: newNoteNative,
      memoryHook: newNoteHook,
      example: newNoteExample,
      createdAt: new Date().toISOString(),
      ebbinghaus: {
        stage: 0,
        nextReviewDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(), // 24 hours later
        reviewHistory: []
      }
    };

    onAddNote(newNote);
    setNewNoteExpression("");
    setNewNoteStandard("");
    setNewNoteNative("");
    setNewNoteHook("");
    setNewNoteExample("");
    setShowAddNote(false);
  };

  const selectedScene = scenes.find(s => s.id === selectedSceneId);
  const sceneNotes = notes.filter(n => n.sceneId === selectedSceneId);

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
          <button
            onClick={() => setShowAddScene(true)}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[12px] font-medium transition-colors flex items-center gap-1.5 self-start md:self-auto cursor-pointer shadow-xs"
            id="add-scene-button"
          >
            <Plus className="w-4 h-4" />
            <span>创建口语新场景</span>
          </button>
        )}
      </div>

      {/* VIEW PANEL SPLITTER */}
      {!selectedSceneId ? (
        // ==========================================
        // SCENE LIST FOLDERS VIEW
        // ==========================================
        <div className="space-y-6">
          
          {/* SEARCH & FILTERS */}
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
            </motion.div>
          )}

          {/* LIST OF ACCUMULATED EXPRESSIONS */}
          <div className="space-y-4">
            <h4 className="text-xs font-semibold text-neutral-400 tracking-wider font-mono uppercase">
              本场景积累语料库 ({sceneNotes.length})
            </h4>

            <div className="grid grid-cols-1 gap-4" id="notes-list">
              {sceneNotes.map(note => (
                <div 
                  key={note.id}
                  className="bg-white border border-neutral-200/40 hover:border-neutral-200 rounded-xl p-5 shadow-3xs transition-all relative group"
                  id={`note-card-${note.id}`}
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div>
                      <span className="text-[14px] font-mono text-neutral-900 font-medium bg-neutral-50 px-2 py-0.5 rounded border border-neutral-100">
                        {note.expression}
                      </span>
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
              ))}

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

// Simulated simple SVG cross icon
function X({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
    </svg>
  );
}
