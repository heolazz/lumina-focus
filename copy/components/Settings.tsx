import React from 'react';
import { AppSettings, TimerMode } from '../types';

interface SettingsProps {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  // Menambahkan props baru untuk PWA
  installApp?: () => void;
  isInstallable?: boolean;
}

// Reuse Mascot Visual for Settings Aesthetic
const MascotHead = () => (
  <svg width="140" height="140" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="55" r="35" fill="#FB923C" />
    <circle cx="50" cy="55" r="35" stroke="#F97316" strokeWidth="3" />
    <path d="M50 20C50 20 35 30 35 45H65C65 30 50 20 50 20Z" fill="#4ADE80" stroke="#22C55E" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 20V35" stroke="#166534" strokeWidth="3" strokeLinecap="round"/>
    <path d="M38 52C38 52 40 50 42 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
    <path d="M58 52C58 52 60 50 62 52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
    <path d="M48 60H52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="35" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
    <circle cx="65" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
  </svg>
);

export const Settings: React.FC<SettingsProps> = ({ settings, updateSettings, installApp, isInstallable }) => {
  
  const presets = [1, 25, 30, 45, 60, 90];

  const updateDuration = (mode: TimerMode, val: number) => {
    updateSettings({
      durations: { ...settings.durations, [mode]: val }
    });
  };

  return (
    <div className="w-full h-full min-h-screen flex flex-col lg:flex-row pb-24 md:pb-0">
      
      {/* LEFT PANEL (Info & Mascot) */}
      <div className="w-full lg:w-5/12 p-8 lg:p-12 lg:pl-40 flex flex-col justify-start items-center lg:items-start text-white relative z-10 pt-10 lg:pt-20">
         <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4 text-center lg:text-left">Set Duration</h2>
         <p className="text-white/80 font-medium text-lg mb-10 max-w-xs leading-relaxed text-center lg:text-left">
           Choose your focus session length.
         </p>
         
         <div className="transform hover:scale-105 transition-transform duration-500 mb-8 lg:mb-0">
            <MascotHead />
         </div>

         <div className="mt-8 bg-white/20 backdrop-blur-md p-6 rounded-3xl border border-white/20 max-w-sm hidden lg:block">
            <p className="text-sm font-bold leading-relaxed opacity-90">
               "Sitting for more than 90 minutes increases health risks significantly. Take breaks!"
            </p>
         </div>
      </div>

      {/* RIGHT PANEL (Settings Cards) */}
      <div className="flex-1 p-4 lg:p-12 lg:pt-20 overflow-y-auto">
         <div className="max-w-xl mx-auto space-y-10">
            
            {/* --- FOCUS DURATION GRID --- */}
            <div>
               <div className="grid grid-cols-3 gap-4">
                  {presets.map(min => (
                    <button
                      key={min}
                      onClick={() => updateDuration(TimerMode.POMODORO, min)}
                      className={`
                        aspect-square rounded-[2rem] flex flex-col items-center justify-center transition-all duration-300 border-2
                        ${settings.durations[TimerMode.POMODORO] === min
                          ? 'bg-white border-white text-nature-500 shadow-xl scale-105 z-10' // Active State
                          : 'bg-transparent border-white/30 text-white hover:bg-white/10 hover:border-white/50' // Inactive State
                        }
                      `}
                    >
                       <span className="text-4xl md:text-5xl font-black tracking-tight">{min}</span>
                       <span className="text-sm font-bold mt-1 opacity-80">min</span>
                    </button>
                  ))}
               </div>
            </div>

            {/* --- BREAK DURATIONS --- */}
            <div className="grid grid-cols-2 gap-4">
               {/* Short Break */}
               <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-4 border border-white/20 flex flex-col items-center">
                  <span className="text-white/80 text-xs font-bold uppercase mb-3 tracking-wider">Short Break</span>
                  <div className="flex items-center justify-between w-full px-2">
                     <button 
                        onClick={() => updateDuration(TimerMode.SHORT_BREAK, Math.max(1, settings.durations[TimerMode.SHORT_BREAK] - 1))} 
                        className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors font-bold text-xl"
                     >-</button>
                     <span className="text-3xl font-black text-white">{settings.durations[TimerMode.SHORT_BREAK]}</span>
                     <button 
                        onClick={() => updateDuration(TimerMode.SHORT_BREAK, settings.durations[TimerMode.SHORT_BREAK] + 1)} 
                        className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors font-bold text-xl"
                     >+</button>
                  </div>
               </div>
               
               {/* Long Break */}
               <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-4 border border-white/20 flex flex-col items-center">
                  <span className="text-white/80 text-xs font-bold uppercase mb-3 tracking-wider">Long Break</span>
                  <div className="flex items-center justify-between w-full px-2">
                     <button 
                        onClick={() => updateDuration(TimerMode.LONG_BREAK, Math.max(1, settings.durations[TimerMode.LONG_BREAK] - 5))} 
                        className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors font-bold text-xl"
                     >-</button>
                     <span className="text-3xl font-black text-white">{settings.durations[TimerMode.LONG_BREAK]}</span>
                     <button 
                        onClick={() => updateDuration(TimerMode.LONG_BREAK, settings.durations[TimerMode.LONG_BREAK] + 5)} 
                        className="w-10 h-10 flex items-center justify-center bg-white/20 rounded-full text-white hover:bg-white/40 transition-colors font-bold text-xl"
                     >+</button>
                  </div>
               </div>
            </div>

            {/* --- TOGGLES & AMBIENCE --- */}
            <div className="space-y-4">
               <div className="bg-white/20 backdrop-blur-md rounded-[2rem] p-1 flex gap-1">
                  <button 
                     onClick={() => updateSettings({ autoStartPomos: !settings.autoStartPomos })}
                     className={`flex-1 py-4 rounded-[1.8rem] flex items-center justify-center gap-3 transition-all ${settings.autoStartPomos ? 'bg-white shadow-lg' : 'hover:bg-white/10'}`}
                  >
                     <span className={`text-sm font-bold ${settings.autoStartPomos ? 'text-nature-600' : 'text-white'}`}>Auto Focus</span>
                     <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.autoStartPomos ? 'bg-nature-500' : 'bg-nature-800/40'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.autoStartPomos ? 'left-5' : 'left-1'}`}></div>
                     </div>
                  </button>

                  <button 
                     onClick={() => updateSettings({ autoStartBreaks: !settings.autoStartBreaks })}
                     className={`flex-1 py-4 rounded-[1.8rem] flex items-center justify-center gap-3 transition-all ${settings.autoStartBreaks ? 'bg-white shadow-lg' : 'hover:bg-white/10'}`}
                  >
                     <span className={`text-sm font-bold ${settings.autoStartBreaks ? 'text-nature-600' : 'text-white'}`}>Auto Break</span>
                     <div className={`w-10 h-6 rounded-full relative transition-colors ${settings.autoStartBreaks ? 'bg-nature-500' : 'bg-nature-800/40'}`}>
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow-sm transition-all ${settings.autoStartBreaks ? 'left-5' : 'left-1'}`}></div>
                     </div>
                  </button>
               </div>

               {/* Ambience */}
               <div className="bg-white/10 backdrop-blur rounded-[2rem] p-6 border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-white font-bold">Sound</span>
                     <div className="flex bg-black/20 rounded-xl p-1 gap-1">
                        {(['NONE', 'RAIN', 'BROWN'] as const).map(sound => (
                           <button
                              key={sound}
                              onClick={() => updateSettings({ whiteNoise: sound })}
                              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                                 settings.whiteNoise === sound ? 'bg-white text-nature-600 shadow-sm' : 'text-white/60 hover:text-white'
                              }`}
                           >
                              {sound === 'NONE' ? 'OFF' : sound}
                           </button>
                        ))}
                     </div>
                  </div>
                  
                  {settings.whiteNoise !== 'NONE' && (
                     <input 
                        type="range" 
                        min="0" max="100" 
                        value={settings.volume * 100}
                        onChange={(e) => updateSettings({ volume: parseInt(e.target.value) / 100 })}
                        className="w-full accent-white h-2 bg-black/20 rounded-lg appearance-none cursor-pointer"
                     />
                  )}
               </div>
            </div>

            {/* --- NEW: INSTALL APP (PWA) --- */}
            {isInstallable && (
               <div className="bg-white/10 backdrop-blur-sm rounded-[2rem] p-6 border border-white/20 flex items-center justify-between transition-all hover:bg-white/15">
                  <div>
                     <h3 className="text-white font-black text-lg">Install App</h3>
                     <p className="text-white/70 text-sm font-medium">Get the native experience.</p>
                  </div>
                  <button 
                     onClick={installApp}
                     className="bg-white text-nature-600 px-6 py-3 rounded-xl font-bold shadow-lg hover:bg-slate-100 transition-all active:scale-95 flex items-center gap-2"
                  >
                     <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25a.75.75 0 01.75.75v11.69l3.22-3.22a.75.75 0 111.06 1.06l-4.5 4.5a.75.75 0 01-1.06 0l-4.5-4.5a.75.75 0 111.06-1.06l3.22 3.22V3a.75.75 0 01.75-.75zm0 16.5a.75.75 0 01.75.75v1.5h9a.75.75 0 01.75.75v1.5a.75.75 0 01-.75.75h-9a.75.75 0 01-.75-.75v-1.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
                     Install
                  </button>
               </div>
            )}

            <div className="text-center text-white/50 text-md font-bold py-4">
               Lumina Focus v1.0 • Harth
            </div>

         </div>
      </div>
    </div>
  );
};