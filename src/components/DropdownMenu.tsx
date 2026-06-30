import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  LayoutDashboard, 
  FolderHeart, 
  Link2, 
  BookOpen, 
  Camera, 
  Mic2,
  ChevronDown
} from "lucide-react";

interface DropdownMenuProps {
  onSelectSection: (section: string) => void;
  activeSection: string;
}

export default function DropdownMenu({ onSelectSection, activeSection }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "dashboard", label: "学习看板 & 记忆曲线", eng: "Dashboard & Review", icon: LayoutDashboard },
    { id: "corpus", label: "场景口语精准同境词库", eng: "Scened Corpus Library", icon: FolderHeart },
    { id: "extractor", label: "多维网址/视频提炼中心", eng: "Smart Link Extractor", icon: Link2 },
    { id: "notebook", label: "NotebookLM 原版书思维导图", eng: "Book Mindmap Analyzer", icon: BookOpen },
    { id: "camera", label: "随手拍场景口语识别", eng: "Camera Speech Recognizer", icon: Camera },
    { id: "speaking", label: "去模板口语实战 & Solid 反馈", eng: "Speaking Lab & Feedback", icon: Mic2 },
  ];

  return (
    <div 
      className="relative z-50"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100/60 hover:bg-neutral-100 border border-neutral-200/40 text-neutral-800 text-[13px] font-light tracking-wide transition-all cursor-pointer"
        aria-haspopup="true"
        aria-expanded={isOpen}
        id="dropdown-menu-trigger"
      >
        <span>探索英语口语知识库</span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2, ease: "easeInOut" }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="absolute left-0 mt-2 w-72 bg-white/95 backdrop-blur-xl border border-neutral-200/50 rounded-2xl shadow-xl overflow-hidden py-2.5"
            id="dropdown-menu-list"
          >
            <div className="px-3.5 pb-2 border-b border-neutral-100 mb-1.5">
              <span className="text-[10px] font-medium tracking-wider text-neutral-400 uppercase">
                快速导航目录 • DIRECTORY
              </span>
            </div>

            <div className="flex flex-col">
              {menuItems.map((item, index) => {
                const Icon = item.icon;
                const isActive = activeSection === item.id;
                return (
                  <motion.button
                    key={item.id}
                    id={`menu-item-${item.id}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.04, duration: 0.2 }}
                    onClick={() => {
                      onSelectSection(item.id);
                      setIsOpen(false);
                    }}
                    className={`flex items-start gap-3.5 px-4 py-2.5 text-left transition-colors cursor-pointer w-full group ${
                      isActive 
                        ? "bg-neutral-50 text-neutral-900 font-normal" 
                        : "hover:bg-neutral-50/70 text-neutral-600 hover:text-neutral-900"
                    }`}
                  >
                    <div className={`mt-0.5 p-1 rounded-lg transition-colors ${
                      isActive ? "bg-neutral-200/60 text-neutral-900" : "bg-neutral-100 text-neutral-500 group-hover:bg-neutral-200/50 group-hover:text-neutral-800"
                    }`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-[12px] font-light tracking-wide leading-tight group-hover:translate-x-0.5 transition-transform duration-200">
                        {item.label}
                      </div>
                      <div className="text-[10px] text-neutral-400 font-mono tracking-wider uppercase mt-0.5">
                        {item.eng}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            <div className="mt-2 pt-2 px-4 border-t border-neutral-100 bg-neutral-50/50 -mb-2.5 py-2.5">
              <p className="text-[10px] text-neutral-400 leading-normal text-center">
                底层逻辑 + 同境词 • 去模板化口语体系
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
