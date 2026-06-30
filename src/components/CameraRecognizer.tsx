import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Camera, 
  Upload, 
  Sparkles, 
  RefreshCw, 
  Check, 
  Image as ImageIcon, 
  FolderPlus, 
  Play, 
  X, 
  Mic, 
  Eye, 
  Video 
} from "lucide-react";
import { SpeakingScene, NoteItem, SceneCategory } from "../types";

interface CameraRecognizerProps {
  onAddScene: (scene: SpeakingScene) => void;
  onAddNote: (note: NoteItem) => void;
  onDirectToPractice: (scene: SpeakingScene) => void;
}

export default function CameraRecognizer({ 
  onAddScene, 
  onAddNote, 
  onDirectToPractice 
}: CameraRecognizerProps) {
  const [selectedImageBase64, setSelectedImageBase64] = useState<string | null>(null);
  const [imageMimeType, setImageMimeType] = useState("image/jpeg");
  const [isLoading, setIsLoading] = useState(false);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [saved, setSaved] = useState(false);

  // Gemini vision output
  const [analyzedScene, setAnalyzedScene] = useState<{
    sceneName: string;
    sceneDescription: string;
    thinkingChain: string;
    expressions: Array<{
      expression: string;
      standard: string;
      native: string;
      memoryHook: string;
      example: string;
    }>;
    speakingPracticePrompt: string;
  } | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Preset mock scenes for standard fallback
  const samplePresets = [
    {
      id: "preset_1",
      name: "繁忙地铁 (Crowded Subway)",
      url: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=400&q=80",
      description: "A bumper-to-bumper bustling subway carriage."
    },
    {
      id: "preset_2",
      name: "户外公园 (Sunny Park Picnic)",
      url: "https://images.unsplash.com/photo-1519331379826-f10be5486c6f?auto=format&fit=crop&w=400&q=80",
      description: "People relaxing outdoors on grass under sunlight."
    },
    {
      id: "preset_3",
      name: "商务会议 (Office Boardroom)",
      url: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=80",
      description: "Professionals discussing projects in a meeting room."
    }
  ];

  // Enable Device Camera
  const startCamera = async () => {
    setIsCameraActive(true);
    setAnalyzedScene(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
      setCameraStream(stream);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error("Camera access failed", err);
      alert("无法访问摄像机，可能被浏览器拦截。请选择下方预设图片或通过上传图片进行AI口语识别！");
      setIsCameraActive(false);
    }
  };

  // Turn off Camera Stream
  const stopCamera = () => {
    if (cameraStream) {
      cameraStream.getTracks().forEach(track => track.stop());
      setCameraStream(null);
    }
    setIsCameraActive(false);
  };

  // Capture frame from webcam
  const captureFrame = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL("image/jpeg");
        setSelectedImageBase64(dataUrl.split(",")[1]);
        setImageMimeType("image/jpeg");
        stopCamera();
      }
    }
  };

  // Handle Preset Image Selection
  const handleSelectPreset = async (presetUrl: string) => {
    setIsLoading(true);
    setAnalyzedScene(null);
    setSaved(false);
    
    // Convert public image url to base64 by fetching it (using proxy-safe local blob style or simple mock fetch)
    try {
      const res = await fetch(presetUrl);
      const blob = await res.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result as string;
        setSelectedImageBase64(base64data.split(",")[1]);
        setImageMimeType(blob.type);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (e) {
      // Direct base64 mockup for high fidelity offline usage
      const fallbackPresetMap: Record<string, string> = {
        preset_1: "subway_base64_teaser",
        preset_2: "park_base64_teaser",
        preset_3: "office_base64_teaser"
      };
      setSelectedImageBase64("MOCK_BASE64_IMAGE");
      setIsLoading(false);
    }
  };

  // Handle Local File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setAnalyzedScene(null);
    setSaved(false);
    setImageMimeType(file.type);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64data = reader.result as string;
      setSelectedImageBase64(base64data.split(",")[1]);
    };
    reader.readAsDataURL(file);
  };

  // Trigger Gemini Multimodal vision analysis
  const handleAnalyzeScene = async () => {
    if (!selectedImageBase64) return;

    setIsLoading(true);
    setAnalyzedScene(null);

    try {
      const res = await fetch("/api/gemini/analyze-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          base64Image: selectedImageBase64,
          mimeType: imageMimeType 
        })
      });

      if (!res.ok) {
        throw new Error("Visual analyzer backend failed.");
      }

      const data = await res.json();
      setAnalyzedScene(data);
    } catch (err: any) {
      alert("AI 图像识别失败，正在加载精细视觉口语大纲作为兜底！");
      
      // Resilient fallback speaking scenario based on image presets
      const fallbackResult = {
        sceneName: "An Active Urban Commute (城市通勤)",
        sceneDescription: "People standing shoulder to shoulder inside a high-speed metro train, focused on their phones or checking their stop maps.",
        thinkingChain: "描述类：场景背景 (Packed carriage, squeaking brakes) ➔ 细节动作 (Squeezing past commuters, gripping handles) ➔ 个人感受 (Soul-crushing morning hustle).",
        expressions: [
          {
            expression: "Packed like sardines",
            standard: "Very crowded inside (极度拥挤)",
            native: "The subway carriage is packed like sardines. (完美母语原生)",
            memoryHook: "联想法：小鱼罐头。沙丁鱼一排排挤在一起，形容车厢拥挤得一动不能动最贴切不过了！",
            example: "I had to skip two trains because they were packed like sardines."
          },
          {
            expression: "Squeeze past",
            standard: "Walk through people (挤过去)",
            native: "Excuse me, can I squeeze past, please? (温柔实用)",
            memoryHook: "谐音记忆：‘死瑰姿’ ➔ squeeze 意思是挤压、借过。开口极具亲和力，完全没有中式粗鲁感。",
            example: "I need to get off at the next stop, let me squeeze past."
          },
          {
            expression: "Bumper-to-bumper",
            standard: "Heavy traffic (拥堵的大车流)",
            native: "It is bumper-to-bumper out there on the streets. (原生老饕词)",
            memoryHook: "词义拆解：Bumper是保险杠。前车的后杠和后车的前杠对在一起，形容车堵成了长龙，超级生动！",
            example: "I took the subway because the highway is bumper-to-bumper today."
          }
        ],
        speakingPracticePrompt: "Look at the busy metropolitan scene. Speak on your typical daily commute. Do you prefer subway transit or ride-hailing? Describe your typical actions and how you deal with the crowds."
      };
      setAnalyzedScene(fallbackResult);
    } finally {
      setIsLoading(false);
    }
  };

  // Save the custom scene and trigger navigation
  const handleDirectPractice = () => {
    if (!analyzedScene) return;

    const sceneId = `visual_scene_${Date.now()}`;
    const newScene: SpeakingScene = {
      id: sceneId,
      name: analyzedScene.sceneName,
      category: "Custom" as SceneCategory,
      thinkingChainType: "descriptive" as const,
      thinkingChainDescription: analyzedScene.thinkingChain,
      speakingPracticePrompt: analyzedScene.speakingPracticePrompt,
      isCustom: true
    };

    onAddScene(newScene);

    // Save notes
    analyzedScene.expressions.forEach((expr, index) => {
      const newNote: NoteItem = {
        id: `visual_note_${Date.now()}_${index}`,
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
    // Directly injects active scene and navigates user to speaking tab
    onDirectToPractice(newScene);
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8" id="camera-recognizer-root">
      
      {/* HEADER SECTION */}
      <div className="border-b border-neutral-200/50 pb-6 mb-8">
        <span className="text-[10px] text-amber-600 font-mono tracking-widest uppercase block">
          MULTIMODAL COMPUTER VISION LAB
        </span>
        <h2 className="text-2xl font-light tracking-wide text-neutral-900 mt-1 font-serif">
          随手拍场景口语识别
        </h2>
        <p className="text-xs text-neutral-400 mt-1 leading-normal">
          用手机或相机抓拍日常生活物品、街景或特定场景，AI 将瞬间识别并打包输出地道“同境词”和“思维练”进行深度输出
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: CAMERA VIEWER & CAPTURE CONTROLS (5 cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-5 shadow-3xs space-y-4">
            
            {/* Camera viewport frame */}
            <div className="relative aspect-[4/3] bg-neutral-950 rounded-xl overflow-hidden border border-neutral-800 flex items-center justify-center">
              
              {!isCameraActive && !selectedImageBase64 && !isLoading && (
                <div className="text-center text-neutral-500 p-4 space-y-3">
                  <Camera className="w-8 h-8 mx-auto text-neutral-600 animate-pulse" />
                  <p className="text-[11px] leading-relaxed max-w-[200px] mx-auto">
                    开启相机抓拍或上传图片、选择下方预设进行AI场景分析。
                  </p>
                </div>
              )}

              {isCameraActive && (
                <div className="absolute inset-0">
                  <video 
                    ref={videoRef} 
                    playsInline 
                    muted 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
                    <button
                      onClick={captureFrame}
                      className="px-4 py-1.5 bg-white text-neutral-900 hover:bg-neutral-100 rounded-full text-[11px] font-semibold tracking-wide transition-all shadow-md cursor-pointer"
                    >
                      📸 拍摄取景
                    </button>
                    <button
                      onClick={stopCamera}
                      className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-full text-[11px] font-medium transition-all shadow-md cursor-pointer"
                    >
                      取消
                    </button>
                  </div>
                </div>
              )}

              {!isCameraActive && selectedImageBase64 && (
                <div className="absolute inset-0 flex items-center justify-center bg-neutral-900">
                  <img
                    src={`data:${imageMimeType};base64,${selectedImageBase64}`}
                    alt="Captured Scene"
                    className="max-h-full max-w-full object-contain"
                  />
                  <button
                    onClick={() => {
                      setSelectedImageBase64(null);
                      setAnalyzedScene(null);
                    }}
                    className="absolute top-3 right-3 p-1.5 bg-neutral-950/70 hover:bg-neutral-950 text-white rounded-full transition-colors cursor-pointer"
                    title="清除图片"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Hidden Canvas for capture */}
              <canvas ref={canvasRef} className="hidden" />

            </div>

            {/* Input buttons row */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={startCamera}
                disabled={isCameraActive}
                className="flex-1 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Video className="w-4 h-4 text-neutral-500" />
                <span>开启摄像机</span>
              </button>

              <label className="flex-1 py-2 bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 text-neutral-700 rounded-xl text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer text-center">
                <Upload className="w-4 h-4 text-neutral-500" />
                <span>上传照片</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            {/* Core Action triggers */}
            {selectedImageBase64 && (
              <button
                onClick={handleAnalyzeScene}
                disabled={isLoading}
                className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-400 text-white rounded-xl text-xs font-medium transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>AI 正在识别图像内涵中...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 fill-current" />
                    <span>AI 分析画面 ➔ 生成场景口语大纲</span>
                  </>
                )}
              </button>
            )}

          </div>

          {/* Preset templates selector */}
          <div className="bg-white border border-neutral-200/50 rounded-2xl p-4.5 shadow-3xs space-y-3">
            <span className="text-[10px] font-bold text-neutral-400 font-mono block tracking-wider uppercase">
              或者从预设精美场景中选取
            </span>
            <div className="grid grid-cols-3 gap-2">
              {samplePresets.map((preset) => (
                <div 
                  key={preset.id}
                  onClick={() => handleSelectPreset(preset.url)}
                  className="group relative aspect-square rounded-lg overflow-hidden border border-neutral-200 hover:border-indigo-500 cursor-pointer transition-all shadow-3xs"
                  title={preset.name}
                >
                  <img 
                    src={preset.url} 
                    alt={preset.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-neutral-950/70 p-1 text-[8px] text-white text-center font-medium truncate">
                    {preset.name.split(" ")[0]}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: AI ANALYZED ORAL SYLLABUS DISCOVERY (7 cols) */}
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
                  <div className="absolute inset-0 border-4 border-amber-100 rounded-full" />
                  <div className="absolute inset-0 border-4 border-amber-500 border-t-transparent rounded-full animate-spin" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-medium text-neutral-800">正在分析照片的视觉特征...</h4>
                  <p className="text-[11px] text-neutral-400 max-w-xs font-mono">
                    • 识别主要物理元素, 正在为您定制精准口语语料...
                  </p>
                </div>
              </motion.div>
            )}

            {!isLoading && analyzedScene && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-neutral-200/50 rounded-2xl p-6 shadow-xs space-y-6 select-text"
                id="camera-result-card"
              >
                {/* Result header */}
                <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
                  <div>
                    <span className="text-[9px] font-mono text-emerald-600 bg-emerald-50 border border-emerald-100 px-2 py-0.5 rounded-full uppercase">
                      📷 Visual Recognized Scene
                    </span>
                    <h3 className="text-[16px] font-medium text-neutral-900 mt-1.5 font-serif">
                      {analyzedScene.sceneName}
                    </h3>
                  </div>

                  <button
                    onClick={handleDirectPractice}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-[11px] font-medium shadow-xs transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <Mic className="w-3.5 h-3.5 animate-bounce" />
                    <span>直通口语实战演练</span>
                  </button>
                </div>

                {/* Picture layout details */}
                <p className="text-xs text-neutral-500 leading-relaxed font-light italic">
                  <strong>画面细节特征：</strong> "{analyzedScene.sceneDescription}"
                </p>

                {/* Thinking chain detail */}
                <div className="p-4 bg-neutral-50 border border-neutral-200/30 rounded-xl">
                  <span className="text-[9px] font-semibold text-neutral-400 font-mono block tracking-wider">
                    🧠 画面定制：底层表达思维链 (THINKING CHAIN)
                  </span>
                  <p className="text-xs text-neutral-800 leading-relaxed mt-2 font-sans">
                    {analyzedScene.thinkingChain}
                  </p>
                </div>

                {/* Expressions native contrast list */}
                <div className="space-y-4">
                  <span className="text-[10px] font-bold text-neutral-400 font-mono block tracking-wider uppercase">
                    💎 画面专属“同境原生词伙” ({analyzedScene.expressions.length})
                  </span>

                  <div className="space-y-3.5">
                    {analyzedScene.expressions.map((expr, index) => (
                      <div key={index} className="p-4 rounded-xl border border-neutral-100 bg-neutral-50/20 space-y-2 text-xs">
                        
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-[13px] font-medium bg-white px-2 py-0.5 rounded border border-neutral-200/45">
                            {expr.expression}
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 border-t border-neutral-100 text-[11.5px]">
                          <div>
                            <span className="text-[9px] text-neutral-400 block mb-0.5">普通教材中式表达</span>
                            <span className="text-neutral-500 leading-tight block">{expr.standard}</span>
                          </div>
                          <div className="sm:border-l border-neutral-100 sm:pl-3">
                            <span className="text-[9px] text-emerald-600 font-medium block mb-0.5">母语高频原生说法</span>
                            <span className="text-neutral-900 font-medium leading-tight block">{expr.native}</span>
                          </div>
                        </div>

                        <div className="pt-1.5 text-[11px] text-neutral-500 leading-normal flex items-start gap-1 font-sans">
                          <span className="text-amber-500 font-bold">💡</span>
                          <p><strong className="text-neutral-700">场景记忆钩:</strong> {expr.memoryHook}</p>
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

                {/* AI practice speaking task */}
                <div className="p-4 bg-indigo-50/40 border border-indigo-100/40 rounded-xl">
                  <span className="text-[9px] font-semibold text-indigo-700 font-mono block tracking-wider">
                    🎙️ 照片口语实战考核 (SPEAKING PROMPT)
                  </span>
                  <p className="text-xs text-indigo-900 italic leading-relaxed mt-1.5 font-light">
                    "{analyzedScene.speakingPracticePrompt}"
                  </p>
                </div>

              </motion.div>
            )}

            {!isLoading && !analyzedScene && (
              <div className="bg-white border border-neutral-200/50 rounded-2xl p-12 text-center h-[380px] flex flex-col items-center justify-center space-y-3">
                <ImageIcon className="w-8 h-8 text-neutral-300 animate-pulse" />
                <h4 className="text-sm font-medium text-neutral-800">等待图像摄入分析...</h4>
                <p className="text-xs text-neutral-400 max-w-xs leading-normal font-light">
                  在左侧打开您的设备摄像头进行现场抓拍、上传照片，或者直接点击下方的精美环境预设。
                </p>
              </div>
            )}

          </AnimatePresence>
        </div>

      </div>

    </div>
  );
}
