import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TimerMode, Task, AppSettings, TabView, DailyStat } from './types';
import { CircularTimer } from './components/CircularTimer';
import { TaskList } from './components/TaskList';
import { BottomNav } from './components/BottomNav';
import { Sidebar } from './components/Sidebar';
import { Stats } from './components/Stats';
import { Settings } from './components/Settings';

// ... (DEFAULT_SETTINGS, MODE_CONFIG, HELPER QUOTES, DAN MASKOT TETAP SAMA SEPERTI SEBELUMNYA) ...
// (Saya tidak menulis ulang bagian atas untuk menghemat tempat, pastikan kode Maskot dll tetap ada)

const DEFAULT_SETTINGS: AppSettings = {
  durations: {
    [TimerMode.POMODORO]: 25,
    [TimerMode.SHORT_BREAK]: 5,
    [TimerMode.LONG_BREAK]: 15,
  },
  autoStartBreaks: false,
  autoStartPomos: false,
  whiteNoise: 'NONE',
  volume: 0.5
};

const MODE_CONFIG = {
  [TimerMode.POMODORO]: {
    label: 'FOCUS TIME',
    title: "Let's Focus",
    startBtn: "Start Focus",
    pauseBtn: "Pause Focus",
    color: "text-nature-600"
  },
  [TimerMode.SHORT_BREAK]: {
    label: 'SHORT BREAK',
    title: "Time to Chill",
    startBtn: "Start Break",
    pauseBtn: "Pause Break",
    color: "text-blue-500"
  },
  [TimerMode.LONG_BREAK]: {
    label: 'LONG BREAK',
    title: "Deep Recharge",
    startBtn: "Start Rest",
    pauseBtn: "Pause Rest",
    color: "text-indigo-500"
  }
};

const FOCUS_QUOTES = [
  "Productivity level: Expert! 🚀",
  "Look at you go! 🔥",
  "Another block secured. 🧱",
  "Brain gains! 🧠",
  "You are on fire today! ✨",
  "Consistency is key. Great job! 🔑"
];

const getRandomQuote = () => FOCUS_QUOTES[Math.floor(Math.random() * FOCUS_QUOTES.length)];

// --- KOMPONEN MASKOT (PASTIKAN KODE MASKOT ANDA TETAP DISINI) ---
const PersimmonMascot = ({ happy = false, frozen = false, confused = false, celebrating = false, className = "" }: { happy?: boolean, frozen?: boolean, confused?: boolean, celebrating?: boolean, className?: string }) => (
  <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className={`drop-shadow-xl ${className} ${frozen ? 'animate-pulse-slow' : 'animate-bounce-slow'}`}>
    {/* ... (ISI SVG MASKOT SAMA SEPERTI SEBELUMNYA) ... */}
    <circle cx="50" cy="55" r="35" fill={frozen ? "#93C5FD" : "#FB923C"} /> 
    <circle cx="50" cy="55" r="35" stroke={frozen ? "#60A5FA" : "#F97316"} strokeWidth="3" />
    <path d="M50 20C50 20 35 30 35 45H65C65 30 50 20 50 20Z" fill={frozen ? "#A7F3D0" : "#4ADE80"} stroke={frozen ? "#34D399" : "#22C55E"} strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 20V35" stroke={frozen ? "#065F46" : "#166534"} strokeWidth="3" strokeLinecap="round"/>
    {celebrating ? (
      <>
         <path d="M35 55L40 50L45 55" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M55 55L60 50L65 55" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
         <path d="M45 65C45 65 50 68 55 65" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <circle cx="32" cy="60" r="3" fill="#FECACA" opacity="0.8"/>
         <circle cx="68" cy="60" r="3" fill="#FECACA" opacity="0.8"/>
      </>
    ) : happy ? (
      <>
         <path d="M38 52C38 52 40 50 42 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <path d="M58 52C58 52 60 50 62 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <path d="M45 62C45 62 50 68 55 62" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
         <circle cx="35" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
         <circle cx="65" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
      </>
    ) : frozen ? (
      <>
        <path d="M38 52L42 52" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M58 52L62 52" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M42 65C42 65 50 60 58 65" stroke="#1E3A8A" strokeWidth="3" strokeLinecap="round"/>
        <path d="M20 55L25 55" stroke="#BFDBFE" strokeWidth="2" />
        <path d="M75 55L80 55" stroke="#BFDBFE" strokeWidth="2" />
      </>
    ) : confused ? (
      <>
        <circle cx="38" cy="52" r="3" fill="#7C2D12" />
        <circle cx="62" cy="52" r="3" fill="#7C2D12" />
        <path d="M45 62C45 62 50 60 55 62" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
        <path d="M35 45C35 45 38 42 42 45" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
        <path d="M58 45C58 45 62 48 65 45" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
      </>
    ) : (
      <>
        <circle cx="40" cy="52" r="3" fill="#7C2D12" />
        <circle cx="60" cy="52" r="3" fill="#7C2D12" />
        <path d="M48 60H52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
        <circle cx="35" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
        <circle cx="65" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
      </>
    )}
  </svg>
);

const mascotVariants = {
    hidden: { scale: 0, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: "spring", stiffness: 200, damping: 15 } },
    celebrating: {
        y: [0, -15, 0],
        rotate: [0, -5, 5, 0],
        scale: [1, 1.05, 1],
        transition: { duration: 0.6, repeat: Infinity, repeatType: "reverse" as const, ease: "easeInOut" }
    },
    ready: {
        scale: [1, 1.03, 1],
        transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
    }
};

const AnimatedMascotView = ({ type }: { type: 'FOCUS_DONE' | 'BREAK_DONE' }) => {
    const isCelebrating = type === 'FOCUS_DONE';
    return (
        <motion.div
            variants={mascotVariants}
            initial="hidden"
            animate={["visible", isCelebrating ? "celebrating" : "ready"]}
            className="mb-4"
        >
            <PersimmonMascot 
                celebrating={isCelebrating} 
                happy={!isCelebrating}       
                className="w-32 h-32"
            />
        </motion.div>
    );
};

const AUDIO_URLS = {
  ALARM: 'https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3',
  RAIN: 'https://assets.mixkit.co/active_storage/sfx/249/249-preview.mp3',
  BROWN: 'https://assets.mixkit.co/active_storage/sfx/209/209-preview.mp3',
};

function usePersistedState<T>(key: string, initialValue: T): [T, React.Dispatch<React.SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      return initialValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);

  return [state, setState];
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabView>('TIMER');
  const [mode, setMode] = useState<TimerMode>(TimerMode.POMODORO);
  
  const [settings, setSettings] = usePersistedState<AppSettings>('lumina_settings', DEFAULT_SETTINGS);
  const [tasks, setTasks] = usePersistedState<Task[]>('lumina_tasks', []);
  const [dailyStats, setDailyStats] = usePersistedState<DailyStat[]>('lumina_stats', []);
  
  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  
  const [timeLeft, setTimeLeft] = useState(DEFAULT_SETTINGS.durations[TimerMode.POMODORO] * 60);
  const [isActive, setIsActive] = useState(false);
  
  const [isTransitioning, setIsTransitioning] = useState(false); 
  const [isPausedMode, setIsPausedMode] = useState(false);
  const [pendingMode, setPendingMode] = useState<TimerMode | null>(null);
  const [completionType, setCompletionType] = useState<'FOCUS_DONE' | 'BREAK_DONE' | null>(null);
  const [currentQuote, setCurrentQuote] = useState("");

  const [endTime, setEndTime] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);

  // STATE UNTUK PWA INSTALL
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  const alarmRef = useRef<HTMLAudioElement>(null);
  const noiseRef = useRef<HTMLAudioElement>(null);

  // --- LOGIC PWA: Cek apakah bisa diinstall ---
  useEffect(() => {
    const handleBeforeInstallPrompt = (e: any) => {
      e.preventDefault(); // Mencegah browser menampilkan prompt default mini
      setDeferredPrompt(e); // Simpan event untuk dipanggil nanti di tombol
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Fungsi Install App (dipass ke Settings)
  const handleInstallApp = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt(); // Munculkan prompt native
      deferredPrompt.userChoice.then((choiceResult: any) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the install prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  // --- LOGIC 2: NOTIFICATION PERMISSION ---
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  // --- LOGIC 3: DYNAMIC TAB TITLE ---
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  useEffect(() => {
    if (isActive) {
      document.title = `${formattedTime} - ${MODE_CONFIG[mode].label} | Lumina`;
    } else if (isPausedMode) {
      document.title = `⏸️ Paused | Lumina`;
    } else {
      document.title = `Lumina Focus`;
    }
  }, [formattedTime, isActive, isPausedMode, mode]);


  // Timer Reset Logic
  useEffect(() => {
    if (!isActive && !isPausedMode && !pendingMode && !completionType) {
      setTimeLeft(settings.durations[mode] * 60);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settings.durations, mode]); 

  // Audio Logic
  useEffect(() => {
    if (!noiseRef.current) return;
    if (settings.whiteNoise === 'NONE' || !isActive || isPausedMode || pendingMode || completionType || mode !== TimerMode.POMODORO) {
      noiseRef.current.pause();
    } else {
      const src = settings.whiteNoise === 'RAIN' ? AUDIO_URLS.RAIN : AUDIO_URLS.BROWN;
      if (noiseRef.current.src !== src) {
        noiseRef.current.src = src;
        noiseRef.current.load();
      }
      noiseRef.current.loop = true;
      noiseRef.current.volume = settings.volume;
      const playPromise = noiseRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {});
      }
    }
  }, [settings.whiteNoise, settings.volume, isActive, isPausedMode, pendingMode, completionType, mode]);

  const switchMode = useCallback((newMode: TimerMode, autoStart = false) => {
    setMode(newMode);
    const newDuration = settings.durations[newMode] * 60;
    setTimeLeft(newDuration);
    setEndTime(null);
    setIsActive(autoStart);
    setIsPausedMode(false); 
    setPendingMode(null);
    setCompletionType(null);
    setShowConfetti(false);
    
    if (autoStart) {
       setEndTime(Date.now() + newDuration * 1000);
    }
  }, [settings.durations]);

  const handleModeClick = (targetMode: TimerMode) => {
    if (isActive) {
      setPendingMode(targetMode);
    } else {
      switchMode(targetMode);
    }
  };

  const confirmSwitch = (action: 'ABANDON' | 'FINISH') => {
    if (!pendingMode) return;
    if (action === 'FINISH') {
      handleTimerComplete(); 
      switchMode(pendingMode);
    } else {
      switchMode(pendingMode);
    }
  };

  const handleTimerComplete = () => {
    setIsActive(false);
    setIsPausedMode(false);
    setEndTime(null);
    setShowConfetti(true);
    
    // --- TRIGGER SYSTEM NOTIFICATION ---
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification(mode === TimerMode.POMODORO ? "Session Complete! 🎉" : "Break is Over! ⏰", {
        body: mode === TimerMode.POMODORO ? "Great job! Time to take a break." : "Ready to focus again?",
        icon: "/favicon.ico" // Pastikan ada icon
      });
    }

    if (alarmRef.current) {
      alarmRef.current.currentTime = 0;
      alarmRef.current.play().catch(e => console.log(e));
    }

    if (mode === TimerMode.POMODORO) {
      if (activeTaskId) {
        setTasks(prev => prev.map(t => 
          t.id === activeTaskId ? { ...t, completedPomos: t.completedPomos + 1 } : t
        ));
      }
      const today = new Date().toISOString().split('T')[0];
      setDailyStats(prev => {
        const existing = prev.find(s => s.date === today);
        if (existing) {
          return prev.map(s => s.date === today ? { ...s, minutes: s.minutes + settings.durations[mode], sessions: s.sessions + 1 } : s);
        } else {
          return [...prev, { date: today, minutes: settings.durations[mode], sessions: 1 }];
        }
      });

      setCurrentQuote(getRandomQuote());
      setCompletionType('FOCUS_DONE');

      if (settings.autoStartBreaks && !pendingMode) {
        setTimeout(() => switchMode(TimerMode.SHORT_BREAK, true), 3500);
      }
    } else {
      setCompletionType('BREAK_DONE');
      if (settings.autoStartPomos && !pendingMode) {
        setTimeout(() => switchMode(TimerMode.POMODORO, true), 3500);
      }
    }
  };

  const handleToggleTimer = () => {
    if (isActive) {
        setIsActive(false);
        setIsPausedMode(true);
        setEndTime(null);
    } else if (isPausedMode) {
        setIsPausedMode(false);
        setIsActive(true);
        setEndTime(Date.now() + timeLeft * 1000);
    } else {
        setIsTransitioning(true);
    }
  };

  const handleResetTimer = (e?: React.MouseEvent) => {
    if(e) e.stopPropagation();
    setIsActive(false);
    setIsPausedMode(false);
    setEndTime(null);
    setTimeLeft(settings.durations[mode] * 60);
  };

  const onStartAnimationComplete = () => {
    setIsTransitioning(false);
    setIsActive(true);
    setEndTime(Date.now() + timeLeft * 1000);
  };

  const handleManualNext = () => {
      if (completionType === 'FOCUS_DONE') {
          switchMode(TimerMode.SHORT_BREAK);
      } else if (completionType === 'BREAK_DONE') {
          switchMode(TimerMode.POMODORO);
      }
  };

  useEffect(() => {
    let interval: number;
    if (isActive && endTime && !pendingMode && !completionType) {
      interval = window.setInterval(() => {
        const now = Date.now();
        const diff = endTime - now;
        if (diff <= 0) {
          setTimeLeft(0);
          handleTimerComplete();
          clearInterval(interval);
        } else {
          setTimeLeft(Math.ceil(diff / 1000));
        }
      }, 200);
    }
    return () => clearInterval(interval);
  }, [isActive, endTime, pendingMode, completionType]);

  const updateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const totalTime = settings.durations[mode] * 60;
  const progress = totalTime > 0 ? ((totalTime - timeLeft) / totalTime) * 100 : 0;
  
  const bgClass = (activeTab === 'TIMER' || activeTab === 'SETTINGS') ? 'bg-nature-500' : 'bg-nature-50';
  const isFocusMode = (activeTab === 'TIMER' || activeTab === 'SETTINGS');

  const todayStr = new Date().toISOString().split('T')[0];
  const todayStats = dailyStats.find(s => s.date === todayStr);
  const sessionsToday = todayStats ? todayStats.sessions : 0;

  return (
    <div className={`flex flex-col h-[100dvh] font-sans transition-colors duration-500 overflow-hidden ${bgClass}`}>
      <audio ref={alarmRef} src={AUDIO_URLS.ALARM} />
      <audio ref={noiseRef} />

      <AnimatePresence>
        {/* --- 1. ANIMASI START FOCUS --- */}
        {isTransitioning && (
            <motion.div 
                className="fixed inset-0 z-[40] flex items-center justify-center pointer-events-auto"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="absolute inset-0 bg-nature-500" 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                />
                <motion.div 
                    className="absolute bg-orange-400 rounded-full"
                    initial={{ width: 0, height: 0 }}
                    animate={{ width: 2500, height: 2500 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                <motion.div 
                    className="relative z-10"
                    initial={{ scale: 0, rotate: 0 }}
                    animate={{ scale: 2, rotate: 360 }}
                    transition={{ duration: 0.8, ease: "backOut" }}
                    onAnimationComplete={() => setTimeout(onStartAnimationComplete, 200)}
                >
                    <PersimmonMascot happy={true} className="w-32 h-32" />
                    <motion.p 
                        className="text-white font-black text-2xl mt-4 text-center"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                    >
                        Let's Go!
                    </motion.p>
                </motion.div>
            </motion.div>
        )}

        {/* --- 2. ANIMASI PAUSE MODE --- */}
        {isPausedMode && (
            <motion.div 
                className="fixed inset-0 z-[40] flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="absolute bg-blue-400 rounded-full"
                    initial={{ width: 0, height: 0 }}
                    animate={{ width: 2500, height: 2500 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "circOut" }}
                />
                <div className="relative z-10 flex flex-col items-center p-8 text-center">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5, rotate: -10 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                        className="mb-6"
                    >
                       <PersimmonMascot frozen={true} className="w-32 h-32" />
                    </motion.div>
                    <motion.h2 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="text-4xl font-black text-white mb-2 drop-shadow-md"
                    >
                        Time Frozen!
                    </motion.h2>
                    <motion.p 
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.1 }}
                        className="text-blue-100 font-bold mb-10 text-lg max-w-xs"
                    >
                       Don't stay cold for too long.
                    </motion.p>
                    <motion.button
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleToggleTimer}
                        className="bg-white text-blue-500 font-black px-10 py-5 rounded-[2rem] text-xl shadow-xl hover:shadow-2xl hover:bg-blue-50 transition-all flex items-center gap-3"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8"><path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" /></svg>
                        RESUME
                    </motion.button>
                </div>
            </motion.div>
        )}

        {/* --- 3. SMART SWITCH CONFIRMATION --- */}
        {pendingMode && (
            <motion.div 
                className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className="bg-white rounded-[2.5rem] p-6 w-full max-w-sm shadow-2xl relative overflow-hidden"
                    initial={{ scale: 0.8, y: 50 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                >
                    <div className="flex flex-col items-center text-center">
                        <PersimmonMascot confused={true} className="w-20 h-20 mb-4" />
                        <h3 className="text-xl font-black text-slate-800 mb-2">Wait, timer is running!</h3>
                        <p className="text-slate-500 text-sm font-medium mb-6">
                            Switching modes will end your current session. What do you want to do?
                        </p>
                        
                        <div className="flex flex-col gap-3 w-full">
                            <button 
                                onClick={() => confirmSwitch('FINISH')}
                                className="w-full bg-nature-500 text-white font-bold py-3 rounded-xl hover:bg-nature-600 transition-colors shadow-lg shadow-nature-200"
                            >
                                Mark as Done & Switch
                            </button>
                            
                            <button 
                                onClick={() => confirmSwitch('ABANDON')}
                                className="w-full bg-orange-100 text-orange-500 font-bold py-3 rounded-xl hover:bg-orange-200 transition-colors"
                            >
                                Reset Timer
                            </button>
                            
                            <button 
                                onClick={() => setPendingMode(null)}
                                className="w-full text-slate-400 font-bold py-2 hover:text-slate-600 transition-colors text-sm"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </motion.div>
            </motion.div>
        )}

        {/* --- 4. COMPLETION OVERLAY --- */}
        {completionType && (
            <motion.div 
                className="fixed inset-0 z-[70] flex items-center justify-center p-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
            >
                <motion.div 
                    className={`absolute inset-0 ${completionType === 'FOCUS_DONE' ? 'bg-nature-500/95' : 'bg-blue-500/95'} backdrop-blur-md`}
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                />

                <motion.div 
                    className="relative z-10 bg-white rounded-[3rem] p-8 w-full max-w-sm text-center shadow-2xl overflow-hidden"
                    initial={{ scale: 0.5, y: 100 }}
                    animate={{ scale: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.5 }}
                >
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className={`absolute top-[-50%] left-[-50%] w-[200%] h-[200%] ${completionType === 'FOCUS_DONE' ? 'bg-gradient-to-r from-orange-200 to-yellow-200' : 'bg-gradient-to-r from-blue-200 to-cyan-200'} animate-spin-slow`}></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <AnimatedMascotView type={completionType} />

                        <h2 className="text-3xl font-black text-slate-800 mb-2 leading-tight">
                            {completionType === 'FOCUS_DONE' ? "Session Complete!" : "Break is Over!"}
                        </h2>
                        
                        {completionType === 'FOCUS_DONE' ? (
                            <div className="mb-6">
                                <p className="text-slate-500 font-bold text-sm uppercase tracking-wider mb-1">Today's Progress</p>
                                <div className="text-4xl font-black text-nature-600 mb-3">{sessionsToday} <span className="text-xl text-slate-400">sessions</span></div>
                                <p className="text-slate-600 font-medium italic px-4">"{currentQuote}"</p>
                            </div>
                        ) : (
                            <p className="text-slate-500 font-medium mb-8 px-4">
                                Hope you feel refreshed. Ready to get back in the zone?
                            </p>
                        )}

                        <button 
                            onClick={handleManualNext}
                            className={`w-full font-black py-4 rounded-2xl text-lg shadow-lg transform active:scale-95 transition-all text-white
                                ${completionType === 'FOCUS_DONE' 
                                    ? 'bg-nature-500 hover:bg-nature-600 shadow-nature-200' 
                                    : 'bg-blue-500 hover:bg-blue-600 shadow-blue-200'}
                            `}
                        >
                            {completionType === 'FOCUS_DONE' ? (settings.autoStartBreaks ? "Starting Break..." : "Take a Break") : (settings.autoStartPomos ? "Starting Focus..." : "Start Focus")}
                        </button>
                        
                        <button 
                            onClick={() => setCompletionType(null)}
                            className="mt-4 text-sm font-bold text-slate-400 hover:text-slate-600"
                        >
                            Close / Stay here
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        )}

      </AnimatePresence>

      <div className="relative z-50">
         <Sidebar currentTab={activeTab} setTab={setActiveTab} isDarkBg={isFocusMode} />
      </div>
      
      <main className="flex-1 w-full relative h-full overflow-hidden">
        
        {/* --- BAGIAN SETTINGS YANG DIPERBARUI --- */}
        <div className={`h-full w-full ${activeTab === 'SETTINGS' ? 'overflow-y-auto pb-24 md:pb-0' : 'hidden'}`}>
             <Settings 
                settings={settings} 
                updateSettings={updateSettings} 
                installApp={handleInstallApp} 
                isInstallable={!!deferredPrompt} // Pass status installable
             />
        </div>

        {/* --- BAGIAN LAIN TETAP SAMA (HANYA DITAMPILKAN KONDISIONAL) --- */}
        {activeTab === 'TIMER' && (
          <div className="flex flex-col md:flex-row items-center justify-center md:justify-center h-full w-full px-6 pt-8 pb-28 md:pb-0 md:pt-0 gap-4 md:gap-16 max-w-5xl mx-auto relative">
             
             <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-[5%] left-[5%] w-[50%] h-[50%] bg-white opacity-5 rounded-full blur-[120px]"></div>
             </div>

             {/* === MODE TOGGLES (MOBILE) === */}
             <div className="md:hidden w-full flex justify-center z-30 mb-2">
                <div className="bg-black/10 backdrop-blur-md p-1.5 rounded-full flex gap-1 shadow-inner">
                    {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((m) => (
                      <button
                        key={m}
                        onClick={() => handleModeClick(TimerMode[m])}
                        className={`
                          w-12 h-10 rounded-full transition-all flex items-center justify-center
                          ${mode === TimerMode[m] 
                            ? 'bg-white text-nature-600 shadow-md scale-100' 
                            : 'text-white/60 hover:text-white hover:bg-white/10 scale-95'
                          }
                        `}
                      >
                        {m === TimerMode.POMODORO && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>}
                        {m === TimerMode.SHORT_BREAK && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" clipRule="evenodd" /></svg>}
                        {m === TimerMode.LONG_BREAK && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" /></svg>}
                      </button>
                    ))}
                </div>
             </div>

             {/* === LEFT/TOP: TIMER VISUAL === */}
             <div className="flex-none md:flex-1 -mb-8 flex flex-col justify-center items-center relative z-10 w-full md:mb-0">
                <div className="transform transition-transform duration-500 scale-75 md:scale-110">
                  <CircularTimer progress={progress} isInverted={true} size={320} strokeWidth={6}>
                      <div className="flex flex-col items-center">
                        <span className="text-[6rem] font-black tracking-tighter text-white tabular-nums leading-none drop-shadow-sm">
                          {formattedTime}
                        </span>
                        
                        <div className="flex flex-col items-center gap-1 mt-2">
                           <span className="text-white/60 text-xs font-bold tracking-[0.2em] uppercase">
                              {MODE_CONFIG[mode].label}
                           </span>
                           
                           {/* STATUS PILL OR RESET BUTTON */}
                           {timeLeft !== settings.durations[mode] * 60 && !isActive ? (
                               <button 
                                  onClick={handleResetTimer}
                                  className="group flex items-center gap-1 text-white/50 hover:text-white transition-colors mt-2"
                                  title="Reset Timer"
                               >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 group-hover:-rotate-90 transition-transform"><path fillRule="evenodd" d="M4.755 10.059a7.5 7.5 0 0112.548-3.364l1.903 1.903h-3.183a.75.75 0 100 1.5h4.992a.75.75 0 00.75-.75V4.356a.75.75 0 00-1.5 0v3.18l-1.9-1.9A9 9 0 003.306 9.67a.75.75 0 101.45.388zm15.408 3.352a.75.75 0 00-.919.53 7.5 7.5 0 01-12.548 3.364l-1.902-1.903h3.183a.75.75 0 000-1.5H2.984a.75.75 0 00-.75.75v4.992a.75.75 0 001.5 0v-3.18l1.9 1.9a9 9 0 0015.059-4.035.75.75 0 00-.53-.919z" clipRule="evenodd" /></svg>
                                  <span className="text-[10px] font-bold uppercase tracking-widest">Reset</span>
                               </button>
                           ) : (
                               <span className="text-white/80 font-bold text-lg bg-white/10 px-5 py-2 rounded-full backdrop-blur-md">
                                  {isActive ? 'Keep Focusing' : 'Ready?'}
                               </span>
                           )}
                        </div>
                      </div>
                  </CircularTimer>
                </div>
             </div>

             {/* === RIGHT/BOTTOM: CONTROLS === */}
             <div className="flex-none md:flex-1 flex flex-col items-center md:items-start justify-center md:justify-center z-20 w-full md:w-auto text-white space-y-4 md:space-y-8 md:pl-8">
                
                {/* 1. Mode Toggles (DESKTOP) */}
                <div className="hidden md:flex bg-black/10 backdrop-blur-md p-1.5 rounded-full gap-1 shadow-inner scale-100">
                    {(Object.keys(TimerMode) as Array<keyof typeof TimerMode>).map((m) => (
                      <button
                        key={m}
                        onClick={() => handleModeClick(TimerMode[m])}
                        className={`
                          w-12 h-10 rounded-full transition-all flex items-center justify-center
                          ${mode === TimerMode[m] 
                            ? 'bg-white text-nature-600 shadow-md scale-100' 
                            : 'text-white/60 hover:text-white hover:bg-white/10 scale-95'
                          }
                        `}
                      >
                        {m === TimerMode.POMODORO && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" /></svg>}
                        {m === TimerMode.SHORT_BREAK && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M4.5 9.75a6 6 0 0111.573-2.226 3.75 3.75 0 014.133 4.303A4.5 4.5 0 0118 20.25H6.75a5.25 5.25 0 01-2.25-10.5z" clipRule="evenodd" /></svg>}
                        {m === TimerMode.LONG_BREAK && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" /></svg>}
                      </button>
                    ))}
                </div>

                {/* 2. Title & Task */}
                <div className="flex items-center gap-4 md:block text-left w-full md:w-auto justify-center md:justify-start px-4 md:px-0">
                   {/* MOBILE: Mascot KIRI Teks */}
                   <div className="md:hidden transform scale-90" onClick={() => setShowConfetti(true)}>
                      <PersimmonMascot happy={isActive} className="w-16 h-16 animate-bounce-slow" />
                   </div>

                   <div>
                      <h2 className="text-3xl md:text-5xl font-black mb-1 md:mb-3 tracking-tight leading-none">
                        {MODE_CONFIG[mode].title}
                      </h2>
                      {/* Task Pill Style */}
                      <div className="bg-white/10 border border-white/10 rounded-xl px-3 py-1.5 inline-flex items-center max-w-[200px] md:max-w-xs">
                         <p className="text-white text-sm md:text-base font-bold truncate">
                             {activeTaskId ? (
                               <span>{tasks.find(t => t.id === activeTaskId)?.title}</span>
                             ) : "Select a task or just start."}
                         </p>
                      </div>
                   </div>
                </div>

                {/* 3. Start Button */}
                <button
                  onClick={handleToggleTimer}
                  className={`
                    w-64 md:w-64 h-16 md:h-20 rounded-[2.5rem] font-black text-xl md:text-2xl tracking-wide shadow-xl transition-all transform active:scale-95 flex items-center justify-center gap-3
                    ${isActive 
                      ? 'bg-nature-800/30 text-white border-2 border-white/30 hover:bg-nature-800/50' 
                      : 'bg-white text-nature-600 hover:shadow-2xl hover:-translate-y-1'
                    }
                  `}
                >
                  {isActive ? MODE_CONFIG[mode].pauseBtn : MODE_CONFIG[mode].startBtn}
                </button>

                {/* 4. DESKTOP MASCOT */}
                <div 
                  className="hidden md:block absolute bottom-10 right-10 transform hover:scale-110 transition-transform cursor-pointer" 
                  onClick={() => setShowConfetti(true)}
                >
                   <PersimmonMascot happy={isActive} />
                </div>

             </div>
          </div>
        )}

        {/* Content scrollable area for other tabs */}
        <div className={`h-full w-full ${activeTab === 'TIMER' ? 'hidden' : 'overflow-y-auto pb-24 md:pb-0'}`}>
            {activeTab === 'TASKS' && (
               <TaskList 
                 tasks={tasks} 
                 setTasks={setTasks} 
                 activeTaskId={activeTaskId} 
                 setActiveTaskId={(id) => { setActiveTaskId(id); if(id) setActiveTab('TIMER'); }} 
               />
            )}

            {activeTab === 'STATS' && (
               <Stats stats={dailyStats} />
            )}
        </div>
      </main>

      {/* Floating Mobile Nav */}
      <div className="md:hidden relative z-50">
         <BottomNav currentTab={activeTab} setTab={setActiveTab} isDarkBg={isFocusMode} />
      </div>
    </div>
  );
} 