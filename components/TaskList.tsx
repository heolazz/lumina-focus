import React, { useState } from 'react';
import { Task, TaskTag } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PersimmonMascot } from './Mascot';

// --- HELPER: ID GENERATOR ---
const generateId = () => {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// --- CONFIG KATEGORI ---
const CATEGORIES: Record<TaskTag, { label: string; bg: string; text: string; dot: string; border: string }> = {
  Work: { label: 'Work', bg: 'bg-blue-100', text: 'text-blue-600', dot: 'bg-blue-500', border: 'border-blue-200' },
  Study: { label: 'Study', bg: 'bg-pink-100', text: 'text-pink-600', dot: 'bg-pink-500', border: 'border-pink-200' },
  Personal: { label: 'Personal', bg: 'bg-emerald-100', text: 'text-emerald-600', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  Creative: { label: 'Creative', bg: 'bg-purple-100', text: 'text-purple-600', dot: 'bg-purple-500', border: 'border-purple-200' },
};

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId, onDelete }) => {
  // State
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [estPomos, setEstPomos] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<TaskTag>('Work');
  const [isCatDropdownOpen, setIsCatDropdownOpen] = useState(false);

  // Edit State
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editEstPomos, setEditEstPomos] = useState(1);
  const [editCategory, setEditCategory] = useState<TaskTag>('Work');

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: generateId(),
      title: newTaskTitle,
      completed: false,
      estimatedPomos: estPomos,
      completedPomos: 0,
      tag: selectedCategory
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setEstPomos(1);
    setIsCatDropdownOpen(false);
  };

  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditEstPomos(task.estimatedPomos);
    setEditCategory((task.tag as TaskTag) || 'Work');
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;
    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, title: editTitle, estimatedPomos: editEstPomos, tag: editCategory } 
        : t
    ));
    setEditingTaskId(null);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    // CONTAINER UTAMA: Hapus padding di sini untuk menghindari double padding dengan sticky header
    <div className="w-full min-h-full max-w-3xl mx-auto pb-40">
       
       {/* --- STICKY HEADER & INPUT FORM --- */}
       {/* Menggunakan padding internal agar align dengan list di bawahnya */}
       <div className="sticky top-0 z-40 bg-nature-50/95 transition-all px-6 md:px-12 pt-6 pb-4">
           
           <div className="flex items-end justify-between mb-4">
              <div>
                <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-1">Tasks</h2>
                <p className="text-slate-400 font-bold text-base">Organize your focus targets.</p>
              </div>
              <div className="hidden md:block transform translate-y-2">
                 <motion.div
                    animate={{ y: [0, -5, 0], rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                 >
                    <PersimmonMascot happy={tasks.length > 0} className="w-20 h-20" />
                 </motion.div>
              </div>
           </div>

           {/* ADD TASK FORM (CARD STYLE) */}
           <form onSubmit={handleAddTask} className="relative z-30">
              <div className="bg-white p-2 pl-4 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 flex flex-col sm:flex-row items-center gap-3 focus-within:ring-4 ring-nature-100 transition-all">
                 
                 {/* Input Title */}
                 <input 
                   type="text" 
                   value={newTaskTitle}
                   onChange={(e) => setNewTaskTitle(e.target.value)}
                   placeholder="Add a new task..." 
                   className="flex-1 bg-transparent font-bold text-slate-700 placeholder:text-slate-300 outline-none py-3 w-full text-lg"
                 />

                 {/* Controls Group */}
                 <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end pr-1 pb-1 sm:pb-0">
                     
                     {/* Category Selector */}
                     <div className="relative">
                        <button 
                            type="button"
                            onClick={() => setIsCatDropdownOpen(!isCatDropdownOpen)}
                            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition-colors border ${CATEGORIES[selectedCategory].bg} ${CATEGORIES[selectedCategory].text} ${CATEGORIES[selectedCategory].border}`}
                        >
                            <div className={`w-2 h-2 rounded-full ${CATEGORIES[selectedCategory].dot}`}></div>
                            {selectedCategory}
                        </button>
                        
                        <AnimatePresence>
                            {isCatDropdownOpen && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                    className="absolute top-full right-0 mt-2 bg-white rounded-2xl p-2 shadow-2xl border border-slate-100 min-w-[140px] flex flex-col gap-1 z-50"
                                >
                                    {(Object.keys(CATEGORIES) as TaskTag[]).map(cat => (
                                        <button
                                            key={cat}
                                            type="button"
                                            onClick={() => { setSelectedCategory(cat); setIsCatDropdownOpen(false); }}
                                            className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-slate-50 text-left text-xs font-bold text-slate-600"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${CATEGORIES[cat].dot}`}></div>
                                            {cat}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                     </div>

                     {/* Est Pomos */}
                     <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl shrink-0">
                        <button type="button" onClick={() => setEstPomos(Math.max(1, estPomos - 1))} className="text-slate-400 hover:text-nature-600 font-black text-lg w-4 leading-none">-</button>
                        <span className="font-black text-slate-800 w-4 text-center text-base">{estPomos}</span>
                        <button type="button" onClick={() => setEstPomos(Math.min(10, estPomos + 1))} className="text-slate-400 hover:text-nature-600 font-black text-lg w-4 leading-none">+</button>
                     </div>

                     {/* Submit Btn */}
                     <button type="submit" className="bg-nature-500 hover:bg-nature-600 text-white p-3.5 rounded-2xl transition-colors shadow-lg shadow-nature-200">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
                     </button>
                 </div>
              </div>
           </form>
       </div>

       {/* TASK LIST DISPLAY */}
       <div className="px-6 md:px-12 pt-6 space-y-4">
          <AnimatePresence mode='popLayout'>
            {tasks.length === 0 && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="flex flex-col items-center justify-center py-12 opacity-50">
                    <PersimmonMascot confused={true} className="w-24 h-24 mb-4 grayscale opacity-50" />
                    <p className="font-bold text-slate-300">No tasks yet. Plan your day!</p>
                </motion.div>
            )}

            {tasks.map(task => {
              const catConfig = CATEGORIES[task.tag] || CATEGORIES['Work'];
              const progressPercent = task.estimatedPomos > 0 
                ? Math.min(100, (task.completedPomos / task.estimatedPomos) * 100)
                : 0;
              
              return (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`group relative rounded-[2.5rem] border transition-all duration-300 overflow-hidden
                   ${activeTaskId === task.id 
                      ? `bg-white ring-4 ring-offset-2 ring-nature-200 border-nature-500 shadow-xl z-10` 
                      : 'bg-white border-slate-100 shadow-sm hover:shadow-lg hover:border-slate-200'
                   }
                   ${task.completed ? 'opacity-60 bg-slate-50' : ''}
                `}
              >
                 {editingTaskId === task.id ? (
                    // --- EDIT MODE (Inside Card) ---
                    <div className="p-6 flex flex-col gap-4">
                        <input 
                            autoFocus
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="bg-slate-50 rounded-2xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-nature-400 w-full text-lg"
                        />
                        
                        <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="flex items-center gap-2">
                                {/* Edit Category */}
                                <div className="flex bg-slate-50 rounded-xl p-1">
                                    {(Object.keys(CATEGORIES) as TaskTag[]).map(cat => (
                                        <button
                                            key={cat}
                                            onClick={() => setEditCategory(cat)}
                                            className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${editCategory === cat ? 'bg-white shadow-sm scale-110' : 'opacity-30 hover:opacity-100'}`}
                                            title={cat}
                                        >
                                            <div className={`w-3 h-3 rounded-full ${CATEGORIES[cat].dot}`}></div>
                                        </button>
                                    ))}
                                </div>

                                {/* Edit Pomos */}
                                <div className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl">
                                    <button onClick={() => setEditEstPomos(Math.max(1, editEstPomos - 1))} className="text-slate-400 font-bold px-2">-</button>
                                    <span className="font-black text-slate-700 w-4 text-center">{editEstPomos}</span>
                                    <button onClick={() => setEditEstPomos(Math.min(10, editEstPomos + 1))} className="text-slate-400 font-bold px-2">+</button>
                                </div>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => saveEdit(task.id)} className="bg-nature-500 text-white px-5 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-nature-600">Save</button>
                                <button onClick={cancelEdit} className="text-slate-400 font-bold text-sm px-4 hover:text-slate-600">Cancel</button>
                            </div>
                        </div>
                    </div>
                 ) : (
                    // --- VIEW MODE (Clean Card Style) ---
                    <div className="p-6 flex items-center gap-5">
                         {/* Checkbox */}
                         <button 
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all shrink-0
                                ${task.completed ? 'bg-nature-500 border-nature-500' : 'border-slate-200 hover:border-nature-400'}
                              `}
                         >
                               {task.completed && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>}
                         </button>
                         
                         {/* Content */}
                         <div className="flex-1 min-w-0 cursor-pointer" onClick={() => !task.completed && setActiveTaskId(task.id)}>
                             
                             <div className="flex items-center justify-between mb-2">
                                 <h3 className={`font-bold text-xl leading-tight transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                                    {task.title}
                                 </h3>
                                 
                                 {/* Category Pill */}
                                 <span className={`shrink-0 text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg ${catConfig.bg} ${catConfig.text}`}>
                                     {catConfig.label}
                                 </span>
                             </div>

                             {/* Progress Bar & Info */}
                             <div className="flex items-center gap-3">
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                    <motion.div 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPercent}%` }}
                                        className={`h-full rounded-full ${activeTaskId === task.id ? 'bg-nature-500' : 'bg-slate-300'}`}
                                    />
                                </div>
                                {/* Hapus Icon Tomat di sini, ganti teks saja */}
                                <div className="text-xs font-bold text-slate-400 whitespace-nowrap">
                                    {task.completedPomos} / <span className="text-slate-600">{task.estimatedPomos}</span>
                                </div>
                             </div>

                         </div>

                         {/* Action Buttons (Edit/Delete) */}
                         <div className="flex flex-col gap-1 pl-3 border-l border-slate-50 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEditing(task)} className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" /></svg></button>
                            <button onClick={() => onDelete(task.id)} className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" /></svg></button>
                         </div>
                    </div>
                 )}
              </motion.div>
              );
            })}
          </AnimatePresence>
       </div>
    </div>
  );
};