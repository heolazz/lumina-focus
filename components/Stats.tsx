import React, { useMemo } from 'react';
import { DailyStat } from '../types';

interface StatsProps {
  stats: DailyStat[];
}

// --- DATA TIPS HARIAN ---
const DAILY_TIPS = [
  "Take a 5 min break after every 25 mins. Your brain needs it! 🧠",
  "Hydrate! Drinking water boosts focus by 20%. 💧",
  "Multitasking kills productivity. Focus on one thing. 🎯",
  "Clean space, clear mind. Tidy up your desk! 🧹",
  "The 2-minute rule: If it takes < 2 mins, do it now. ⚡",
  "Sleep is the best productivity app. Get 8 hours. 😴",
  "Write down your top 3 goals before starting the day. 📝"
];

const MascotHead = () => (
  <svg width="80" height="80" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-lg transform -rotate-12">
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

export const Stats: React.FC<StatsProps> = ({ stats }) => {
  
  // 1. GENERATE DAILY TIP
  const todaysTip = useMemo(() => {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
    return DAILY_TIPS[dayOfYear % DAILY_TIPS.length];
  }, []);

  // 2. CALCULATE STREAK
  const currentStreak = useMemo(() => {
    const sortedStats = [...stats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    if (sortedStats.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    const latestDate = sortedStats[0].date;
    if (latestDate !== today && latestDate !== yesterday) return 0;

    let streak = 0;
    let checkDate = new Date(latestDate);

    for (let i = 0; i < sortedStats.length; i++) {
        const statDate = sortedStats[i].date;
        const expectedDateStr = checkDate.toISOString().split('T')[0];

        if (statDate === expectedDateStr) {
            streak++;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break;
        }
    }
    return streak;
  }, [stats]);

  // 3. PREPARE CHART DATA
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        const stat = stats.find(s => s.date === dateStr);
        
        data.push({
            day: dayName,
            date: dateStr,
            minutes: stat ? stat.minutes : 0,
            isToday: i === 0
        });
    }
    return data;
  }, [stats]);

  const totalMinutes = stats.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalSessions = stats.reduce((acc, curr) => acc + curr.sessions, 0);
  
  // 4. CHART SCALING (Y-AXIS)
  const maxMinutesInChart = Math.max(...chartData.map(d => d.minutes), 60); // Min scale 60m
  // Buat 4 level index untuk garis bantu (0%, 33%, 66%, 100%)
  const yAxisLabels = [
     Math.ceil(maxMinutesInChart),
     Math.ceil(maxMinutesInChart * 0.66),
     Math.ceil(maxMinutesInChart * 0.33),
     0
  ];

  return (
    <div className="w-full h-full pb-32 px-4 md:px-12 pt-6 md:pt-12 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">
        <div>
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Weekly Insight</h2>
           <p className="text-slate-400 font-bold mt-1">Your focus journey at a glance.</p>
        </div>
      </div>

      {/* BENTO GRID SUMMARY (Total, Sessions, Streak) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: TOTAL FOCUS */}
        <div className="md:col-span-1 bg-nature-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-nature-200 group hover:-translate-y-1 transition-transform duration-300">
           <div className="absolute -right-6 -top-6 w-32 h-32 bg-white opacity-10 rounded-full"></div>
           <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-yellow-300 opacity-20 rounded-full"></div>
           <div className="relative z-10 h-full flex flex-col justify-between">
              <div className="flex items-center gap-2 opacity-80">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clipRule="evenodd" /></svg>
                <span className="font-bold text-sm tracking-wider uppercase">Total Focus</span>
              </div>
              <div className="mt-4">
                 <div className="text-6xl font-black tracking-tighter">
                    {Math.floor(totalMinutes / 60)}<span className="text-2xl opacity-60 ml-1">h</span>
                 </div>
                 <div className="text-3xl font-bold opacity-80">
                    {totalMinutes % 60}<span className="text-lg ml-1">m</span>
                 </div>
              </div>
              <div className="mt-6 inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1.5 rounded-xl text-sm font-bold w-fit">
                 {totalMinutes > 0 ? "🔥 You are doing great!" : "🌱 Start your journey"}
              </div>
           </div>
        </div>

        {/* RIGHT COLUMN SPLIT */}
        <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-50 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
               <div className="absolute top-0 right-0 p-6 text-slate-100">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-24 h-24 transform translate-x-4 -translate-y-4"><path d="M15.5 2A1.5 1.5 0 0014 3.5v1.5h-1v-1.5a1.5 1.5 0 00-1.5-1.5h-9A1.5 1.5 0 001 3.5v13A1.5 1.5 0 002.5 18h9a1.5 1.5 0 001.5-1.5v-1.5h1v1.5a1.5 1.5 0 001.5 1.5h2.5a1.5 1.5 0 001.5-1.5v-13a1.5 1.5 0 00-1.5-1.5h-2.5z" /></svg>
               </div>
               <div>
                  <span className="text-slate-400 font-bold text-xs uppercase tracking-wider">Sessions</span>
                  <div className="text-5xl font-black text-slate-800 mt-2">{totalSessions}</div>
               </div>
               <div className="text-nature-600 font-bold text-sm bg-nature-50 px-3 py-1 rounded-lg w-fit mt-4">
                  Awesome consistency!
               </div>
            </div>

            <div className="bg-[#FFF8F0] rounded-[2.5rem] p-8 shadow-sm border border-orange-50 flex flex-col justify-between relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
               <div className="absolute -right-4 -bottom-4 w-24 h-24 bg-orange-100 rounded-full opacity-50"></div>
               <div>
                  <span className="text-orange-400 font-bold text-xs uppercase tracking-wider">Current Streak</span>
                  <div className="flex items-baseline gap-1 mt-2">
                     <div className="text-5xl font-black text-slate-800">{currentStreak}</div>
                     <div className="text-xl font-bold text-orange-500">Days</div>
                  </div>
               </div>
               <div className="flex items-center gap-2 mt-4">
                  <div className="flex gap-1">
                     {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-2 h-8 rounded-full ${i < Math.min(currentStreak, 3) ? 'bg-orange-400' : 'bg-orange-200'}`}></div>
                     ))}
                  </div>
                  <span className="text-orange-400 text-xs font-bold ml-2">Keep it up!</span>
               </div>
            </div>
        </div>
      </div>

      {/* --- CHART SECTION (DIPERBAIKI DENGAN GRAPHIC INDEX) --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* BAR CHART WITH INDEX */}
         <div className="lg:col-span-2 bg-white p-6 md:p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xl font-bold text-slate-800">Activity (Last 7 Days)</h3>
               <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-nature-500"></span>
                  <span className="text-xs font-bold text-slate-400">Focus Minutes</span>
               </div>
            </div>

            <div className="flex h-64 gap-4">
               {/* Y-AXIS INDEX (ANGKA KIRI) */}
               <div className="flex flex-col justify-between text-xs font-bold text-slate-300 py-6 text-right w-8">
                  {yAxisLabels.map((label, i) => (
                     <span key={i}>{label}m</span>
                  ))}
               </div>

               {/* CHART AREA */}
               <div className="flex-1 relative flex items-end justify-between gap-2 md:gap-6 border-l-2 border-slate-50 pl-4">
                  
                  {/* BACKGROUND GRID LINES */}
                  <div className="absolute inset-0 flex flex-col justify-between py-6 pointer-events-none w-full">
                     <div className="w-full h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                     <div className="w-full h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                     <div className="w-full h-px bg-slate-100 border-t border-dashed border-slate-200"></div>
                     <div className="w-full h-px bg-slate-100 border-t border-slate-200"></div> {/* Garis dasar */}
                  </div>

                  {/* BARS */}
                  {chartData.map((d, idx) => {
                     const heightPercent = (d.minutes / maxMinutesInChart) * 100;
                     const visualHeight = d.minutes > 0 ? Math.max(heightPercent, 8) : 4; 
                     
                     return (
                     <div key={idx} className="flex flex-col items-center flex-1 group relative z-10 h-full justify-end">
                        {/* Tooltip */}
                        <div className="opacity-0 group-hover:opacity-100 absolute bottom-[calc(100%+10px)] mb-2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-all duration-300 z-20 whitespace-nowrap pointer-events-none transform translate-y-2 group-hover:translate-y-0">
                           {d.minutes} mins
                           <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-slate-800"></div>
                        </div>
                        
                        {/* Bar Track & Fill */}
                        <div className="w-full max-w-[40px] relative flex items-end overflow-hidden transition-all duration-300 group-hover:scale-105" style={{ height: '90%' }}>
                           <div 
                              className={`w-full rounded-t-xl rounded-b-md absolute bottom-0 transition-all duration-1000 ease-out 
                                 ${d.isToday ? 'bg-nature-500 shadow-lg shadow-nature-200' : d.minutes > 0 ? 'bg-nature-300/80 hover:bg-nature-400' : 'bg-slate-100'}
                              `}
                              style={{ height: `${visualHeight}%` }}
                           ></div>
                        </div>
                        
                        {/* X-AXIS LABELS */}
                        <div className={`text-[10px] mt-3 font-bold uppercase tracking-wider ${d.isToday ? 'text-nature-600' : 'text-slate-300'}`}>
                           {d.day.charAt(0)}
                           <span className="hidden md:inline">{d.day.slice(1)}</span>
                        </div>
                     </div>
                     );
                  })}
               </div>
            </div>
         </div>

         {/* TIP CARD WITH MASCOT */}
         <div className="bg-nature-50 rounded-[2.5rem] p-8 flex flex-col items-center text-center justify-center border border-nature-100 relative overflow-hidden min-h-[300px]">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
               <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl"></div>
               <div className="absolute bottom-10 right-10 w-32 h-32 bg-nature-200 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10 flex flex-col items-center">
               <div className="mb-6 transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <MascotHead />
               </div>
               
               <h4 className="font-black text-slate-800 text-xl mb-3">Daily Tip</h4>
               <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-6 px-2">
                  "{todaysTip}"
               </p>
               
               <button className="bg-white text-nature-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
                  Okay, got it!
               </button>
            </div>
         </div>
      </div>
    </div>
  );
};