import React, { useState, useRef, useEffect } from 'react';
import { Task, TaskTag } from '../types';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
}

const TAG_COLORS: Record<TaskTag, string> = {
  Work: 'bg-blue-100 text-blue-700 border-blue-200',
  Study: 'bg-amber-100 text-amber-700 border-amber-200',
  Code: 'bg-purple-100 text-purple-700 border-purple-200',
  Read: 'bg-nature-100 text-nature-700 border-nature-200',
  Other: 'bg-slate-100 text-slate-600 border-slate-200',
};

// Maskot untuk Empty State
const FloatingMascot = () => (
  <svg width="120" height="120" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-bounce-slow drop-shadow-xl opacity-80">
    <circle cx="50" cy="55" r="35" fill="#FB923C" />
    <circle cx="50" cy="55" r="35" stroke="#F97316" strokeWidth="3" />
    <path d="M50 20C50 20 35 30 35 45H65C65 30 50 20 50 20Z" fill="#4ADE80" stroke="#22C55E" strokeWidth="3" strokeLinejoin="round"/>
    <path d="M50 20V35" stroke="#166534" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="40" cy="52" r="3" fill="#7C2D12" />
    <circle cx="60" cy="52" r="3" fill="#7C2D12" />
    <path d="M48 60H52" stroke="#7C2D12" strokeWidth="3" strokeLinecap="round"/>
    <circle cx="35" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
    <circle cx="65" cy="58" r="4" fill="#FECACA" opacity="0.6"/>
  </svg>
);

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId }) => {
  const [title, setTitle] = useState('');
  const [est, setEst] = useState(1);
  const [tag, setTag] = useState<TaskTag>('Work');
  const [isAdding, setIsAdding] = useState(false);
  
  // STATE BARU UNTUK EDITING
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null); // Ref untuk input edit

  useEffect(() => {
    if (isAdding && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isAdding]);

  // Efek untuk fokus otomatis saat mode edit aktif
  useEffect(() => {
    if (editingId && editInputRef.current) {
        editInputRef.current.focus();
    }
  }, [editingId]);

  const addTask = () => {
    if (!title.trim()) return;
    const newTask: Task = {
      id: Date.now().toString(),
      title: title.trim(),
      completed: false,
      estimatedPomos: Math.max(1, est),
      completedPomos: 0,
      tag
    };
    setTasks(prev => [newTask, ...prev]);
    setTitle('');
    setEst(1);
    setIsAdding(false);
  };

  const startEditing = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(task.id);
    setEditTitle(task.title);
  };

  const saveEdit = (id: string, e?: React.MouseEvent | React.KeyboardEvent) => {
    if (e) e.stopPropagation();
    if (!editTitle.trim()) return;
    
    setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, title: editTitle.trim() } : t
    ));
    setEditingId(null);
  };

  const cancelEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(null);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setTasks(prev => prev.filter(t => t.id !== id));
    if (activeTaskId === id) setActiveTaskId(null);
  };

  const activeCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="w-full h-full pb-32 px-4 md:px-12 pt-6 md:pt-12 max-w-6xl mx-auto">
      
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter">My Tasks</h2>
          <p className="text-slate-400 font-bold mt-1">
            You have <span className="text-nature-500">{activeCount}</span> tasks remaining.
          </p>
        </div>
        
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className={`
            px-6 py-3 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center gap-2 active:scale-95
            ${isAdding ? 'bg-slate-200 text-slate-600' : 'bg-nature-500 text-white hover:bg-nature-600 hover:shadow-nature-200'}
          `}
        >
          {isAdding ? 'Cancel' : '+ New Task'}
        </button>
      </div>

      {/* ADD TASK FORM */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isAdding ? 'max-h-96 opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
        <div className="bg-white p-6 md:p-8 rounded-[2.5rem] shadow-xl shadow-slate-200/50 border border-slate-50">
          <input 
            ref={inputRef}
            type="text" 
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?" 
            className="w-full text-2xl font-bold placeholder:text-slate-300 border-none focus:ring-0 p-0 mb-6 text-slate-800 bg-transparent"
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          
          <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
            <div className="flex items-center gap-3 overflow-x-auto pb-2 md:pb-0">
               <div className="flex items-center gap-1 bg-slate-50 p-1.5 rounded-2xl border border-slate-100">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider pl-2 pr-1">Est</span>
                  <button onClick={() => setEst(Math.max(1, est - 1))} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 font-bold hover:text-nature-500 transition-colors">-</button>
                  <span className="w-8 text-center font-mono text-lg font-bold text-slate-800">{est}</span>
                  <button onClick={() => setEst(est + 1)} className="w-8 h-8 flex items-center justify-center bg-white rounded-xl shadow-sm text-slate-600 font-bold hover:text-nature-500 transition-colors">+</button>
               </div>
               
               <div className="flex gap-2">
                  {Object.keys(TAG_COLORS).map((t) => (
                    <button
                      key={t}
                      onClick={() => setTag(t as TaskTag)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${
                        tag === t 
                          ? TAG_COLORS[t as TaskTag] + ' ring-2 ring-offset-1 ring-nature-100' 
                          : 'bg-white border-slate-100 text-slate-400 hover:bg-slate-50'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
               </div>
            </div>
            
            <button 
              onClick={addTask}
              disabled={!title.trim()}
              className="bg-slate-800 text-white px-8 py-3 rounded-2xl font-bold disabled:opacity-50 hover:bg-slate-900 transition-colors shadow-lg w-full md:w-auto"
            >
              Add to List
            </button>
          </div>
        </div>
      </div>

      {/* TASK GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {tasks.length === 0 && !isAdding && (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-center">
             <FloatingMascot />
             <p className="mt-6 text-slate-500 font-bold text-lg">All caught up!</p>
             <p className="text-slate-400 text-sm">Take a break or add a new goal.</p>
          </div>
        )}

        {tasks.map(task => (
          <div 
            key={task.id}
            onClick={() => setActiveTaskId(task.id)}
            className={`
              relative group p-6 rounded-[2.5rem] border transition-all cursor-pointer bg-white overflow-hidden
              ${activeTaskId === task.id 
                ? 'border-nature-500 shadow-xl shadow-nature-500/10 ring-2 ring-nature-500 ring-offset-2' 
                : 'border-transparent shadow-sm hover:shadow-md hover:-translate-y-1'
              }
              ${task.completed ? 'opacity-60 bg-slate-50' : ''}
            `}
          >
            {/* Progress Background Bar */}
            <div className="absolute bottom-0 left-0 h-1.5 bg-slate-100 w-full">
               <div 
                 className={`h-full transition-all duration-500 ${task.completed ? 'bg-slate-400' : 'bg-nature-500'}`}
                 style={{ width: `${Math.min(100, (task.completedPomos / task.estimatedPomos) * 100)}%` }}
               ></div>
            </div>

            <div className="flex items-start gap-4 mb-2">
               {/* Checkbox */}
               <button 
                 onClick={(e) => { e.stopPropagation(); toggleTask(task.id); }}
                 className={`flex-shrink-0 w-7 h-7 rounded-full border-[3px] flex items-center justify-center transition-all duration-300 mt-0.5
                   ${task.completed ? 'bg-nature-500 border-nature-500' : 'border-slate-200 hover:border-nature-400 group-hover:scale-110'}
                 `}
               >
                 {task.completed && (
                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5 text-white stroke-[3]">
                     <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
                   </svg>
                 )}
               </button>
               
               <div className="flex-1 min-w-0">
                 {/* EDIT MODE TOGGLE */}
                 {editingId === task.id ? (
                    <div className="flex items-center gap-2 mb-2">
                        <input 
                            ref={editInputRef}
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id, e)}
                            onClick={(e) => e.stopPropagation()} // Prevent triggering parent click
                            className="w-full text-lg font-bold border-b-2 border-nature-500 focus:outline-none bg-transparent p-0 text-slate-800"
                        />
                        <button onClick={(e) => saveEdit(task.id, e)} className="text-nature-600 hover:bg-nature-50 p-1.5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
                        </button>
                        <button onClick={cancelEdit} className="text-red-400 hover:bg-red-50 p-1.5 rounded-lg">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" /></svg>
                        </button>
                    </div>
                 ) : (
                    <h3 className={`font-bold text-lg leading-tight mb-2 truncate ${task.completed ? 'line-through text-slate-400' : 'text-slate-800'}`}>
                        {task.title}
                    </h3>
                 )}
                 
                 <div className="flex items-center flex-wrap gap-2">
                   <span className={`text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-lg border font-bold ${TAG_COLORS[task.tag]}`}>
                     {task.tag}
                   </span>
                   <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-50 text-xs font-bold text-slate-500 border border-slate-100">
                      <span className={task.completedPomos >= task.estimatedPomos ? "text-nature-600" : ""}>{task.completedPomos}</span>
                      <span className="text-slate-300">/</span>
                      <span>{task.estimatedPomos}</span>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3 text-nature-400 ml-0.5"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z" clipRule="evenodd" /></svg>
                   </div>
                 </div>
               </div>

               {/* Action Buttons (Visible on Hover) */}
               <div className="flex gap-1 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                   {/* Edit Button */}
                   <button 
                      onClick={(e) => startEditing(task, e)}
                      className="text-slate-300 hover:text-nature-600 hover:bg-nature-50 p-2 rounded-xl transition-all"
                      title="Edit Task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5"><path d="M5.433 13.917l1.262-3.155A4 4 0 017.58 9.42l6.92-6.918a2.121 2.121 0 013 3l-6.92 6.918c-.383.383-.84.685-1.343.886l-3.154 1.262a.5.5 0 01-.65-.65z" /><path d="M3.5 5.75c0-.69.56-1.25 1.25-1.25H10A.75.75 0 0010 3H4.75A2.75 2.75 0 002 5.75v9.5A2.75 2.75 0 004.75 18h9.5A2.75 2.75 0 0017 15.25V10a.75.75 0 00-1.5 0v5.25c0 .69-.56 1.25-1.25 1.25h-9.5c-.69 0-1.25-.56-1.25-1.25v-9.5z" /></svg>
                   </button>
                   {/* Delete Button */}
                   <button 
                      onClick={(e) => deleteTask(task.id, e)}
                      className="text-slate-300 hover:text-red-500 hover:bg-red-50 p-2 rounded-xl transition-all"
                      title="Delete Task"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                        <path fillRule="evenodd" d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z" clipRule="evenodd" />
                      </svg>
                   </button>
               </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};