import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Sparkles, 
  Flame, 
  Layers, 
  Hourglass, 
  BookOpen, 
  FolderHeart, 
  Link2, 
  Camera, 
  Mic, 
  LayoutDashboard,
  RefreshCw,
  Clock
} from "lucide-react";

import { SpeakingScene, NoteItem, PracticeLog, SceneCategory } from "./types";
import { INITIAL_SCENES, INITIAL_NOTES } from "./initialData";

// Components
import DropdownMenu from "./components/DropdownMenu";
import MacbookMockup from "./components/MacbookMockup";
import EbbinghausPlanner from "./components/EbbinghausPlanner";
import CorpusLibrary from "./components/CorpusLibrary";
import NetExtractor from "./components/NetExtractor";
import BookAnalyzer from "./components/BookAnalyzer";
import CameraRecognizer from "./components/CameraRecognizer";
import SpeakingLab from "./components/SpeakingLab";

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("home");

  // State core databases
  const [scenes, setScenes] = useState<SpeakingScene[]>([]);
  const [notes, setNotes] = useState<NoteItem[]>([]);
  const [practiceLogs, setPracticeLogs] = useState<PracticeLog[]>([]);

  // Transient state for camera-to-practice redirect
  const [prefilledScene, setPrefilledScene] = useState<SpeakingScene | null>(null);

  // 1. Initialise State from localStorage or fallback
  useEffect(() => {
    const storedScenes = localStorage.getItem("oral_lab_scenes");
    const storedNotes = localStorage.getItem("oral_lab_notes");
    const storedLogs = localStorage.getItem("oral_lab_logs");

    if (storedScenes) {
      setScenes(JSON.parse(storedScenes));
    } else {
      setScenes(INITIAL_SCENES);
      localStorage.setItem("oral_lab_scenes", JSON.stringify(INITIAL_SCENES));
    }

    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    } else {
      setNotes(INITIAL_NOTES);
      localStorage.setItem("oral_lab_notes", JSON.stringify(INITIAL_NOTES));
    }

    if (storedLogs) {
      setPracticeLogs(JSON.parse(storedLogs));
    } else {
      setPracticeLogs([]);
    }
  }, []);

  // 2. State persistence hooks
  const saveScenes = (newScenes: SpeakingScene[]) => {
    setScenes(newScenes);
    localStorage.setItem("oral_lab_scenes", JSON.stringify(newScenes));
  };

  const saveNotes = (newNotes: NoteItem[]) => {
    setNotes(newNotes);
    localStorage.setItem("oral_lab_notes", JSON.stringify(newNotes));
  };

  const saveLogs = (newLogs: PracticeLog[]) => {
    setPracticeLogs(newLogs);
    localStorage.setItem("oral_lab_logs", JSON.stringify(newLogs));
  };

  // 3. Database operations
  const handleAddScene = (scene: SpeakingScene) => {
    const updated = [...scenes, scene];
    saveScenes(updated);
  };

  const handleAddNote = (note: NoteItem) => {
    const updated = [note, ...notes];
    saveNotes(updated);
  };

  const handleDeleteNote = (noteId: string) => {
    const updated = notes.filter(n => n.id !== noteId);
    saveNotes(updated);
  };

  const handleDeleteScene = (sceneId: string) => {
    const updatedScenes = scenes.filter(s => s.id !== sceneId);
    const updatedNotes = notes.filter(n => n.sceneId !== sceneId);
    saveScenes(updatedScenes);
    saveNotes(updatedNotes);
  };

  const handleAddPracticeLog = (log: PracticeLog) => {
    const updated = [...practiceLogs, log];
    saveLogs(updated);
  };

  // 4. Ebbinghaus interval math calculator
  const handleUpdateNoteEbbinghaus = (noteId: string, success: boolean) => {
    const updatedNotes = notes.map(note => {
      if (note.id !== noteId) return note;

      const currentStage = note.ebbinghaus.stage;
      let nextStage = success ? currentStage + 1 : 0;
      nextStage = Math.min(nextStage, 7); // Cap at Stage 7 (max)

      // Repetition intervals multiplier in hours: 1d, 2d, 4d, 7d, 15d, 30d, 60d, 360d
      const stageIntervalsInHours = [24, 48, 96, 168, 360, 720, 1440, 8640];
      const addedHours = stageIntervalsInHours[nextStage];

      const nextReviewDate = new Date();
      nextReviewDate.setHours(nextReviewDate.getHours() + addedHours);

      const reviewHistory = [
        ...note.ebbinghaus.reviewHistory,
        { date: new Date().toISOString(), success }
      ];

      return {
        ...note,
        ebbinghaus: {
          stage: nextStage,
          nextReviewDate: nextReviewDate.toISOString(),
          reviewHistory
        }
      };
    });

    saveNotes(updatedNotes);
  };

  // Direct redirection from camera recognition scene straight into practice lab
  const handleDirectToPractice = (scene: SpeakingScene) => {
    setPrefilledScene(scene);
    setActiveSection("speaking");
  };

  // Stats for the top quick navigation banner
  const dueCount = notes.filter(n => new Date(n.ebbinghaus.nextReviewDate) <= new Date()).length;

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-between" id="app-viewport">
      
      {/* 1. HIGH-CONTRAST FLOATING TOP HEADER */}
      <header className="sticky top-0 z-40 w-full bg-white/70 backdrop-blur-xl border-b border-neutral-200/30">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          
          {/* Logo & Dropper menu trigger */}
          <div className="flex items-center gap-4">
            <button 
              onClick={() => {
                setActiveSection("home");
                setPrefilledScene(null);
              }}
              className="font-serif font-semibold tracking-wide text-neutral-800 text-[13.5px] hover:text-neutral-900 cursor-pointer flex items-center gap-1.5 transition-colors"
              id="header-home-logo"
            >
              <span> VERBUM</span>
              <span className="font-sans font-light text-[10px] bg-neutral-100 px-1.5 py-0.5 rounded text-neutral-400 border border-neutral-200/20 uppercase tracking-widest">
                Speech Lab
              </span>
            </button>
            <DropdownMenu 
              onSelectSection={(sectionId) => {
                setActiveSection(sectionId);
                setPrefilledScene(null);
              }} 
              activeSection={activeSection} 
            />
          </div>

          {/* Quick Stats banner */}
          <div className="flex items-center gap-4 text-xs font-light text-neutral-500">
            <div className="hidden sm:flex items-center gap-1.5 bg-neutral-50 border border-neutral-200/35 px-3 py-1 rounded-full font-mono text-[10.5px]">
              <Clock className="w-3.5 h-3.5 text-neutral-400" />
              <span>待复习: {dueCount} 项</span>
            </div>
            
            <div className="flex items-center gap-1 text-orange-600 font-mono font-medium">
              <Flame className="w-4 h-4 fill-current animate-pulse" />
              <span>8 DAY STREAK</span>
            </div>
          </div>

        </div>
      </header>

      {/* 2. CORE VIEW SWITCH CANVAS AREA */}
      <main className="flex-1 pb-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="w-full"
          >
            {activeSection === "home" && (
              <div className="space-y-6">
                {/* Visual Header introduction */}
                <div className="text-center pt-8 max-w-xl mx-auto px-4 space-y-2">
                  <h1 className="text-3xl font-light tracking-tight text-neutral-900 font-serif leading-tight">
                    去模板化的个人英语口语知识库
                  </h1>
                  <p className="text-neutral-400 text-xs font-light leading-relaxed">
                    以 <span className="font-medium text-neutral-800">“底层逻辑 + 同境词”</span> 为表达打底，借用艾宾浩斯记忆周期保障高频原生搭配输出。摆脱生硬中式模板，拥抱自然流畅口语。
                  </p>
                </div>

                <MacbookMockup 
                  onNavigateSection={(sectionId) => {
                    setActiveSection(sectionId);
                    setPrefilledScene(null);
                  }} 
                />
              </div>
            )}

            {activeSection === "dashboard" && (
              <EbbinghausPlanner 
                notes={notes} 
                scenes={scenes} 
                onUpdateNoteEbbinghaus={handleUpdateNoteEbbinghaus} 
              />
            )}

            {activeSection === "corpus" && (
              <CorpusLibrary 
                scenes={scenes} 
                notes={notes} 
                onAddScene={handleAddScene} 
                onAddNote={handleAddNote}
                onDeleteNote={handleDeleteNote}
                onDeleteScene={handleDeleteScene}
              />
            )}

            {activeSection === "extractor" && (
              <NetExtractor 
                onAddScene={handleAddScene} 
                onAddNote={handleAddNote} 
              />
            )}

            {activeSection === "notebook" && (
              <BookAnalyzer />
            )}

            {activeSection === "camera" && (
              <CameraRecognizer 
                onAddScene={handleAddScene} 
                onAddNote={handleAddNote} 
                onDirectToPractice={handleDirectToPractice} 
              />
            )}

            {activeSection === "speaking" && (
              <SpeakingLab 
                scenes={scenes} 
                notes={notes} 
                onAddPracticeLog={handleAddPracticeLog} 
                practiceLogs={practiceLogs}
                prefilledActiveScene={prefilledScene}
              />
            )}

          </motion.div>
        </AnimatePresence>
      </main>

      {/* 3. MINIMALIST FOOTER */}
      <footer className="w-full border-t border-neutral-200/30 py-6 bg-white/50 backdrop-blur-xs">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-neutral-400 font-light">
          <div className="flex items-center gap-1.5 font-mono text-[10px]">
            <span>底层逻辑 • 同境词伙 • 输出倒逼输入</span>
          </div>
          <div>
            <span>© 2026 VERBUM SPEECH LAB • Designed for Fluency</span>
          </div>
        </div>
      </footer>

    </div>
  );
}
