import React, { useMemo } from 'react';
import { DailyStat } from '../types';

interface StatsProps {
  stats: DailyStat[];
}

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
  
  // 1. CALCULATE REAL STREAK
  const currentStreak = useMemo(() => {
    // Sort stats by date descending (newest first)
    const sortedStats = [...stats].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (sortedStats.length === 0) return 0;

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

    // Check if the latest stat is today or yesterday (streak still alive)
    const latestDate = sortedStats[0].date;
    if (latestDate !== today && latestDate !== yesterday) {
        return 0; // Streak broken
    }

    let streak = 0;
    let checkDate = new Date(latestDate); // Start checking from the last active day

    // Iterate backwards to count consecutive days
    for (let i = 0; i < sortedStats.length; i++) {
        const statDate = sortedStats[i].date;
        const expectedDateStr = checkDate.toISOString().split('T')[0];

        if (statDate === expectedDateStr) {
            streak++;
            // Move checkDate to previous day
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            break; // Sequence broken
        }
    }
    return streak;
  }, [stats]);

  // 2. PREPARE CHART DATA (LAST 7 DAYS)
  const chartData = useMemo(() => {
    const data = [];
    const today = new Date();
    
    // Generate last 7 days (including today)
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setDate(today.getDate() - i);
        const dateStr = d.toISOString().split('T')[0];
        const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
        
        // Find stat for this date
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

  // 3. AGGREGATE TOTALS
  const totalMinutes = stats.reduce((acc, curr) => acc + curr.minutes, 0);
  const totalSessions = stats.reduce((acc, curr) => acc + curr.sessions, 0);
  const maxMinutesInChart = Math.max(...chartData.map(d => d.minutes), 60); // Min scale 60m

  return (
    <div className="w-full h-full pb-32 px-4 md:px-12 pt-6 md:pt-12 max-w-6xl mx-auto">
      
      {/* HEADER */}
      <div className="flex items-end justify-between mb-8">
        <div>
           <h2 className="text-4xl font-black text-slate-800 tracking-tighter">Weekly Insight</h2>
           <p className="text-slate-400 font-bold mt-1">Your focus journey at a glance.</p>
        </div>
      </div>

      {/* BENTO GRID SUMMARY */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        
        {/* CARD 1: TOTAL FOCUS (HERO CARD - GREEN) */}
        <div className="md:col-span-1 bg-nature-500 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-xl shadow-nature-200 group hover:-translate-y-1 transition-transform duration-300">
           {/* Background Decorations */}
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
            
            {/* CARD 2: SESSIONS (White Card) */}
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

            {/* CARD 3: STREAK (Orange Card) */}
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
                     {/* Visual bar streak sederhana */}
                     {[...Array(3)].map((_, i) => (
                        <div key={i} className={`w-2 h-8 rounded-full ${i < Math.min(currentStreak, 3) ? 'bg-orange-400' : 'bg-orange-200'}`}></div>
                     ))}
                  </div>
                  <span className="text-orange-400 text-xs font-bold ml-2">Keep it up!</span>
               </div>
            </div>

        </div>
      </div>

      {/* CHART SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         
         {/* BAR CHART */}
         <div className="lg:col-span-2 bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-50">
            <div className="flex justify-between items-center mb-8">
               <h3 className="text-xl font-bold text-slate-800">Activity (Last 7 Days)</h3>
               <div className="flex gap-2">
                  <span className="w-3 h-3 rounded-full bg-nature-500"></span>
                  <span className="text-xs font-bold text-slate-400">Focus Minutes</span>
               </div>
            </div>

            <div className="flex items-end justify-between h-56 gap-3 md:gap-6">
               {chartData.map((d, idx) => {
                  const heightPercent = (d.minutes / maxMinutesInChart) * 100;
                  
                  return (
                  <div key={idx} className="flex flex-col items-center flex-1 group relative">
                     {/* Tooltip */}
                     <div className="opacity-0 group-hover:opacity-100 absolute bottom-full mb-2 bg-slate-800 text-white text-[10px] font-bold py-1 px-2 rounded-lg transition-all duration-300 z-10 whitespace-nowrap">
                        {d.minutes}m
                     </div>
                     
                     {/* Bar Track */}
                     <div className="w-full bg-slate-50 rounded-t-2xl rounded-b-lg relative h-full flex items-end overflow-hidden group-hover:bg-slate-100 transition-colors">
                        {/* Bar Fill */}
                        <div 
                           className={`w-full rounded-t-2xl rounded-b-lg relative transition-all duration-1000 ease-out 
                              ${d.isToday ? 'bg-nature-500' : 'bg-nature-300 opacity-60 group-hover:opacity-100'}
                           `}
                           style={{ height: `${d.minutes > 0 ? Math.max(heightPercent, 8) : 0}%` }}
                        >
                        </div>
                     </div>
                     
                     <div className={`text-[10px] mt-3 font-bold uppercase tracking-wider ${d.isToday ? 'text-nature-600' : 'text-slate-300'}`}>
                        {d.day}
                     </div>
                  </div>
                  );
               })}
            </div>
         </div>

         {/* TIP CARD WITH MASCOT */}
         <div className="bg-nature-50 rounded-[2.5rem] p-8 flex flex-col items-center text-center justify-center border border-nature-100 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none">
               <div className="absolute top-10 left-10 w-20 h-20 bg-white rounded-full blur-2xl"></div>
               <div className="absolute bottom-10 right-10 w-32 h-32 bg-nature-200 rounded-full blur-3xl"></div>
            </div>

            <div className="relative z-10">
               <div className="mb-6 transform hover:scale-110 transition-transform duration-300 cursor-pointer">
                  <MascotHead />
               </div>
               
               <h4 className="font-black text-slate-800 text-xl mb-3">Daily Tip</h4>
               <p className="text-slate-600 text-sm font-semibold leading-relaxed mb-6">
                  "Take a <span className="text-nature-600 underline decoration-2 underline-offset-2">5 min break</span> after every 25 mins of work. Your brain needs to recharge!"
               </p>
               
               <button className="bg-white text-nature-600 px-6 py-3 rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95">
                  Read More
               </button>
            </div>
         </div>

      </div>
    </div>
  );
};