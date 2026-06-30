import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Calendar, 
  CheckCircle2, 
  HelpCircle, 
  TrendingUp, 
  RefreshCw, 
  Award, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Flame,
  Hourglass,
  ListTodo
} from "lucide-react";
import { NoteItem, SpeakingScene } from "../types";

interface EbbinghausPlannerProps {
  notes: NoteItem[];
  scenes: SpeakingScene[];
  onUpdateNoteEbbinghaus: (noteId: string, success: boolean) => void;
}

export default function EbbinghausPlanner({ 
  notes, 
  scenes, 
  onUpdateNoteEbbinghaus 
}: EbbinghausPlannerProps) {
  const [activeRecallNoteId, setActiveRecallNoteId] = useState<string | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [selectedRecallResult, setSelectedRecallResult] = useState<boolean | null>(null);

  // Manual counter for "Output forces Input" daily streak rule (used 3+ times today)
  const [dailyOutputUses, setDailyOutputUses] = useState(2); // Starts at 2 out of 3 as visual teaser

  // 1. Calculate due cards based on nextReviewDate
  const now = new Date();
  const dueNotes = notes.filter(note => {
    return new Date(note.ebbinghaus.nextReviewDate) <= now;
  });

  const completedNotes = notes.filter(note => {
    return new Date(note.ebbinghaus.nextReviewDate) > now;
  });

  // 2. Active Recall Game selection
  const currentRecallNote = notes.find(n => n.id === activeRecallNoteId) || dueNotes[0];

  const handleStartRecall = (noteId: string) => {
    setActiveRecallNoteId(noteId);
    setShowAnswer(false);
    setSelectedRecallResult(null);
  };

  const handleRecallResult = (success: boolean) => {
    if (!currentRecallNote) return;
    onUpdateNoteEbbinghaus(currentRecallNote.id, success);
    setSelectedRecallResult(success);
    setShowAnswer(true);

    // Increment daily use counter on success to reinforce output forces input
    if (success) {
      setDailyOutputUses(prev => Math.min(prev + 1, 5));
    }
  };

  const handleNextRecall = () => {
    setShowAnswer(false);
    setSelectedRecallResult(null);
    setActiveRecallNoteId(null);
  };

  // Ebbinghaus interval info text helper
  const getStageInterval = (stage: number) => {
    const intervals = ["1天 (1d)", "2天 (2d)", "4天 (4d)", "7天 (7d)", "15天 (15d)", "30天 (30d)", "60天 (60d)", "已永久牢记 (Mastered)"];
    return intervals[Math.min(stage, intervals.length - 1)];
  };

  // Stats calculation
  const totalNotes = notes.length;
  const masteredNotes = notes.filter(n => n.ebbinghaus.stage >= 6).length;
  const inProgressNotes = totalNotes - masteredNotes;
  const currentStreak = 8; // Simulated study streak for high fidelity

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="ebbinghaus-planner-root">
      
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-200/50 pb-6 mb-8">
        <span className="text-[10px] text-emerald-600 font-mono tracking-widest uppercase block">
          EBBINGHAUS COGNITIVE ENGINE
        </span>
        <h2 className="text-2xl font-light tracking-wide text-neutral-900 mt-1 font-serif">
          学习看板 & 记忆曲线规划
        </h2>
        <p className="text-xs text-neutral-400 mt-1 leading-normal">
          依据艾宾浩斯规律分配每日记忆审查 • 输出倒逼输入实战检测机制
        </p>
      </div>

      {/* STATISTICS STATS CARDS GRID */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        {/* Stat 1: Total accumulated */}
        <div className="bg-white border border-neutral-200/55 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
          <span className="text-[10px] font-mono text-neutral-400 uppercase">词伙总量</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-semibold text-neutral-800">{totalNotes}</span>
            <span className="text-[10px] text-neutral-400">个</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-2 font-light">已打包的高频原生语料</div>
        </div>

        {/* Stat 2: Streak */}
        <div className="bg-white border border-neutral-200/55 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">学习打卡</span>
            <Flame className="w-4 h-4 text-orange-500 fill-current animate-pulse" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-semibold text-neutral-800">{currentStreak}</span>
            <span className="text-[10px] text-orange-600 font-medium">天连续</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-2 font-light">保持大脑开口活跃度</div>
        </div>

        {/* Stat 3: Due Today */}
        <div className="bg-white border border-neutral-200/55 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono text-neutral-400 uppercase">今日待复习</span>
            <Hourglass className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-semibold text-indigo-600">{dueNotes.length}</span>
            <span className="text-[10px] text-neutral-400">个</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-2 font-light">
            {dueNotes.length > 0 ? "急需进行主动记忆回溯" : "今日复习已全部完成！"}
          </div>
        </div>

        {/* Stat 4: Mastery progress */}
        <div className="bg-white border border-neutral-200/55 rounded-2xl p-4 shadow-3xs flex flex-col justify-between">
          <span className="text-[10px] font-mono text-neutral-400 uppercase">永久牢记率</span>
          <div className="flex items-baseline gap-1.5 mt-2">
            <span className="text-2xl font-semibold text-neutral-800">
              {totalNotes > 0 ? Math.round((masteredNotes / totalNotes) * 100) : 0}%
            </span>
            <span className="text-[10px] text-neutral-400">({masteredNotes}/{totalNotes})</span>
          </div>
          <div className="text-[10px] text-neutral-400 mt-2 font-light">突破第6复习阶段</div>
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ACTIVE RECALL RECONSTRUCTION GAME (8 cols) */}
        <div className="md:col-span-8 space-y-6">
          
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-xs">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-indigo-600" />
                <h3 className="text-[14px] font-medium text-neutral-800">
                  主动记忆提取卡片 (Active Recall)
                </h3>
              </div>
              <span className="text-[9px] font-mono text-neutral-400 bg-neutral-100 px-2 py-0.5 rounded-full">
                {dueNotes.length} 待审
              </span>
            </div>

            {currentRecallNote ? (
              <div className="space-y-6">
                {/* Scene category context */}
                <div className="flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase bg-neutral-100 border border-neutral-200/40 px-2 py-0.5 rounded-full text-neutral-500">
                    本句语境：{scenes.find(s => s.id === currentRecallNote.sceneId)?.name || "日常交流"}
                  </span>
                  <span className="text-[9px] font-mono bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full">
                    当前复习段: {getStageInterval(currentRecallNote.ebbinghaus.stage)}
                  </span>
                </div>

                {/* Challenge Prompt */}
                <div className="text-center py-6 px-4 bg-neutral-50/50 rounded-2xl border border-dashed border-neutral-200/60 relative overflow-hidden">
                  <span className="text-[10px] font-semibold text-neutral-400 uppercase tracking-widest block mb-1">
                    中文含义与场景联想
                  </span>
                  
                  {/* Standard translation prompt */}
                  <div className="text-[15px] font-serif text-neutral-800 font-medium leading-relaxed max-w-md mx-auto">
                    "{currentRecallNote.standard}"
                  </div>

                  {/* Association tip */}
                  <div className="text-[11px] text-neutral-400 mt-3 font-light leading-normal max-w-sm mx-auto">
                    联想点：{currentRecallNote.memoryHook}
                  </div>
                </div>

                {/* FLASHCARD ACTION INTERACTION */}
                <AnimatePresence mode="wait">
                  {!showAnswer ? (
                    <motion.div 
                      key="actions-recall"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -5 }}
                      className="flex flex-col items-center gap-3"
                    >
                      <p className="text-[10px] text-neutral-400">在大脑中默念或说出对应的地道英语表达，然后进行评定：</p>
                      <div className="flex gap-4 w-full">
                        <button
                          onClick={() => handleRecallResult(false)}
                          className="flex-1 py-2.5 bg-neutral-50 hover:bg-red-50 text-neutral-600 hover:text-red-600 rounded-xl border border-neutral-200/60 hover:border-red-200 text-xs font-medium transition-colors cursor-pointer"
                        >
                          ❌ 忘记了/卡壳
                        </button>
                        <button
                          onClick={() => handleRecallResult(true)}
                          className="flex-1 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-medium transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-sm"
                        >
                          <span>💡 记住了/秒答</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="answer-card"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="space-y-4 pt-2 border-t border-neutral-100"
                    >
                      {/* Recall feedback banner */}
                      <div className={`p-3 rounded-xl flex items-center gap-2.5 text-xs ${
                        selectedRecallResult ? "bg-emerald-50 text-emerald-800 border border-emerald-100/40" : "bg-red-50 text-red-800 border border-red-100/40"
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="font-medium">
                          {selectedRecallResult ? "极佳！下个阶段复习已顺延，继续加油！" : "已记录！本句艾宾浩斯复习曲线已重置。"}
                        </span>
                      </div>

                      {/* Revealed expressions */}
                      <div className="space-y-3">
                        <div>
                          <span className="text-[10px] text-neutral-400 font-mono">地道词伙:</span>
                          <div className="text-[15px] font-mono text-neutral-900 font-semibold mt-0.5">
                            {currentRecallNote.expression}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-neutral-400 font-mono">母语实操完整句 (Native Equivalent):</span>
                          <div className="text-[13px] text-emerald-700 font-medium font-serif mt-0.5 leading-relaxed bg-emerald-50/20 p-3 rounded-lg border border-emerald-100/20">
                            {currentRecallNote.native}
                          </div>
                        </div>

                        <div>
                          <span className="text-[10px] text-neutral-400 font-mono">场景造句:</span>
                          <div className="text-[12px] text-neutral-600 font-light italic leading-normal mt-0.5">
                            "{currentRecallNote.example}"
                          </div>
                        </div>
                      </div>

                      {/* Next button */}
                      <div className="pt-4 flex justify-end">
                        <button
                          onClick={handleNextRecall}
                          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[11px] font-medium transition-colors cursor-pointer"
                        >
                          切换到下一张
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="text-center py-12 text-neutral-400 font-light text-xs">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                <p>今日复习指标已全部搞定！</p>
                <p className="text-[10px] text-neutral-400 mt-1">
                  可以在“口语词库”中增加新表达，或通过“网络链接提炼”自动提取。
                </p>
              </div>
            )}

          </div>

          {/* COMPLETED LIST OF CARDS */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-3xs">
            <h4 className="text-[12px] font-semibold text-neutral-800 mb-3 flex items-center gap-1.5">
              <ListTodo className="w-4 h-4 text-neutral-500" />
              <span>今日复习一览 ({notes.length})</span>
            </h4>
            
            <div className="divide-y divide-neutral-100 max-h-48 overflow-y-auto pr-1">
              {notes.map(note => {
                const isDue = new Date(note.ebbinghaus.nextReviewDate) <= now;
                return (
                  <div key={note.id} className="py-2.5 flex items-center justify-between text-xs font-light">
                    <div className="truncate pr-4">
                      <span className="font-mono text-neutral-900 font-medium">{note.expression}</span>
                      <span className="text-neutral-400 text-[10px] ml-2 block truncate md:inline md:mt-0 mt-0.5">
                        {note.standard}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="text-[9px] text-neutral-400 font-mono">阶段 {note.ebbinghaus.stage}</span>
                      {isDue ? (
                        <button 
                          onClick={() => handleStartRecall(note.id)}
                          className="px-2 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[10px] font-medium rounded-lg transition-colors cursor-pointer"
                        >
                          复习
                        </button>
                      ) : (
                        <span className="text-[10px] text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg font-medium">
                          未到期
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: OUTPUT FORCES INPUT INTERACTIVE PANEL (4 cols) */}
        <div className="md:col-span-4 space-y-6">
          
          {/* Output forces input circle progress */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-3xs text-center flex flex-col items-center">
            <span className="text-[9px] font-mono tracking-widest text-orange-600 font-medium uppercase block">
              RULE: OUTPUT FORCES INPUT
            </span>
            <h4 className="text-[13px] font-medium text-neutral-800 mt-1">
              输出倒逼输入打卡器
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1 leading-normal max-w-[200px] mx-auto">
              当天学的地道原生表达，当天必须在口语中开口讲够3次以上！
            </p>

            {/* Simulated circular progress */}
            <div className="relative w-32 h-32 flex items-center justify-center my-6">
              
              {/* SVG circular background */}
              <svg className="w-full h-full transform -rotate-90">
                <circle 
                  cx="64" cy="64" r="52" 
                  className="text-neutral-100 stroke-current" 
                  strokeWidth="8" fill="transparent" 
                />
                <circle 
                  cx="64" cy="64" r="52" 
                  className="text-orange-500 stroke-current transition-all duration-500 ease-out" 
                  strokeWidth="8" fill="transparent" 
                  strokeDasharray="326.7"
                  strokeDashoffset={326.7 - (326.7 * Math.min(dailyOutputUses, 3)) / 3}
                />
              </svg>

              {/* Central text representation */}
              <div className="absolute flex flex-col items-center">
                <span className="text-3xl font-semibold text-neutral-800 font-serif">
                  {Math.min(dailyOutputUses, 3)}/3
                </span>
                <span className="text-[10px] text-neutral-400 font-mono">讲够次数</span>
              </div>
            </div>

            {/* Manual increment buttons for self-evaluation */}
            <div className="w-full space-y-2">
              <button
                onClick={() => setDailyOutputUses(prev => Math.min(prev + 1, 3))}
                disabled={dailyOutputUses >= 3}
                className={`w-full py-2 rounded-xl text-xs font-medium transition-all cursor-pointer ${
                  dailyOutputUses >= 3 
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-100 cursor-not-allowed" 
                    : "bg-orange-50 hover:bg-orange-100 text-orange-700 border border-orange-100/50"
                }`}
              >
                {dailyOutputUses >= 3 ? "🎉 今日开口达标！" : "➕ 我又开口念了一次！"}
              </button>

              <button
                onClick={() => setDailyOutputUses(0)}
                className="text-[10px] text-neutral-400 hover:text-neutral-600 transition-colors font-mono cursor-pointer"
              >
                重置今日计数
              </button>
            </div>
          </div>

          {/* De-templatized speaking checklist card */}
          <div className="bg-neutral-900 text-neutral-300 rounded-2xl p-5 shadow-md">
            <span className="text-[9px] font-mono tracking-widest text-amber-400 font-medium uppercase block">
              CRITICAL FORMULA
            </span>
            <h4 className="text-[13px] font-medium text-white mt-1">
              地道高频 ＞ 复杂难词
            </h4>
            <p className="text-[11px] text-neutral-400 mt-1.5 leading-relaxed">
              母语者的日常交流往往是简单词汇的精准搭配。不要去堆砌背诵GRE词汇。
            </p>

            <div className="space-y-3 mt-4 text-[11.5px] leading-relaxed border-t border-neutral-800 pt-3">
              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <p>
                  <strong className="text-white">描述类思维链：</strong>
                  <br />
                  场景背景 ➔ 细节动作 ➔ 个人感受
                </p>
              </div>

              <div className="flex items-start gap-2">
                <span className="text-amber-400 font-bold">•</span>
                <p>
                  <strong className="text-white">交流类思维链：</strong>
                  <br />
                  回应核心 ➔ 补充细节 ➔ 抛回话题
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
