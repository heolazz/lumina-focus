import React, { useState } from 'react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';
import { PersimmonMascot } from './Mascot'; // Import Maskot

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  onDelete: (id: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId, onDelete }) => {
  // --- STATE UNTUK ADD TASK ---
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [estPomos, setEstPomos] = useState(1);

  // --- STATE UNTUK EDIT TASK ---
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editEstPomos, setEditEstPomos] = useState(1);

  // --- LOGIC ADD ---
  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      id: crypto.randomUUID(), 
      title: newTaskTitle,
      completed: false,
      estimatedPomos: estPomos,
      completedPomos: 0,
      tag: "Work"
    };

    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setEstPomos(1);
  };

  // --- LOGIC EDIT ---
  const startEditing = (task: Task) => {
    setEditingTaskId(task.id);
    setEditTitle(task.title);
    setEditEstPomos(task.estimatedPomos);
  };

  const cancelEdit = () => {
    setEditingTaskId(null);
    setEditTitle("");
    setEditEstPomos(1);
  };

  const saveEdit = (id: string) => {
    if (!editTitle.trim()) return;

    setTasks(prev => prev.map(t => 
      t.id === id 
        ? { ...t, title: editTitle, estimatedPomos: editEstPomos } 
        : t
    ));
    setEditingTaskId(null);
  };

  // --- LOGIC TOGGLE COMPLETE ---
  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto p-6 md:p-12 pb-32">
       
       {/* HEADER DENGAN MASKOT & ANIMASI */}
       <div className="flex items-end justify-between mb-8 relative">
          <div>
            <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Tasks</h2>
            <p className="text-slate-400 font-bold">What are we focusing on today?</p>
          </div>
          
          {/* Maskot Animasi */}
          <div className="hidden md:block transform translate-y-4">
             <motion.div
                animate={{ 
                   y: [0, -10, 0],
                   rotate: [0, 5, -5, 0] 
                }}
                transition={{ 
                   duration: 4, 
                   repeat: Infinity, 
                   ease: "easeInOut" 
                }}
             >
                <PersimmonMascot happy={tasks.length > 0} className="w-24 h-24" />
             </motion.div>
          </div>
       </div>

       {/* ADD TASK FORM */}
       <form onSubmit={handleAddTask} className="mb-10 relative z-20">
          <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 flex items-center gap-2 pr-2 transition-transform focus-within:scale-[1.02]">
             <div className="w-12 h-12 bg-nature-50 rounded-full flex items-center justify-center text-nature-500 font-bold shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
             </div>
             <input 
               type="text" 
               value={newTaskTitle}
               onChange={(e) => setNewTaskTitle(e.target.value)}
               placeholder="Add a new task..." 
               className="flex-1 bg-transparent font-bold text-slate-700 placeholder:text-slate-300 outline-none px-2 min-w-0"
             />
             
             {/* Est Pomodoro Selector */}
             <div className="hidden sm:flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-xl shrink-0">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">Est</span>
                <button type="button" onClick={() => setEstPomos(Math.max(1, estPomos - 1))} className="text-slate-400 hover:text-nature-600 font-bold w-6">-</button>
                <span className="font-black text-slate-700 w-4 text-center">{estPomos}</span>
                <button type="button" onClick={() => setEstPomos(Math.min(10, estPomos + 1))} className="text-slate-400 hover:text-nature-600 font-bold w-6">+</button>
             </div>

             <button type="submit" className="bg-nature-500 hover:bg-nature-600 text-white p-4 rounded-full transition-colors shadow-lg shadow-nature-200 shrink-0">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
             </button>
          </div>
       </form>

       {/* TASK LIST */}
       <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {tasks.length === 0 && (
                <motion.div 
                    initial={{opacity: 0, y: 20}} 
                    animate={{opacity: 1, y: 0}} 
                    className="flex flex-col items-center py-10 opacity-70"
                >
                    <PersimmonMascot confused={true} className="w-20 h-20 mb-4 opacity-50 grayscale" />
                    <p className="font-bold text-slate-300">No tasks yet. Add one above!</p>
                </motion.div>
            )}

            {tasks.map(task => (
              <motion.div 
                key={task.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                className={`group relative rounded-[1.5rem] border transition-all duration-300 
                   ${activeTaskId === task.id 
                      ? 'bg-nature-50 border-nature-200 shadow-lg shadow-nature-50 scale-[1.02] z-10' 
                      : 'bg-white border-slate-50 shadow-sm hover:border-nature-100 hover:shadow-md'
                   }
                   ${task.completed ? 'opacity-60 bg-slate-50' : ''}
                `}
              >
                 {/* KONDISI: EDIT MODE vs VIEW MODE */}
                 {editingTaskId === task.id ? (
                    // --- EDIT MODE ---
                    <div className="p-4 flex flex-col sm:flex-row gap-3 items-center w-full">
                        <input 
                            autoFocus
                            type="text" 
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            className="flex-1 bg-slate-100 rounded-xl px-4 py-3 font-bold text-slate-700 outline-none focus:ring-2 focus:ring-nature-400 w-full"
                        />
                        
                        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
                            <div className="flex items-center gap-1 bg-slate-100 px-3 py-2 rounded-xl">
                                <button onClick={() => setEditEstPomos(Math.max(1, editEstPomos - 1))} className="text-slate-400 font-bold px-2">-</button>
                                <span className="font-black text-slate-700 w-4 text-center">{editEstPomos}</span>
                                <button onClick={() => setEditEstPomos(Math.min(10, editEstPomos + 1))} className="text-slate-400 font-bold px-2">+</button>
                            </div>
                            
                            <div className="flex gap-2">
                                <button onClick={() => saveEdit(task.id)} className="bg-nature-500 text-white p-3 rounded-xl hover:bg-nature-600 transition-colors shadow-md shadow-nature-200">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>
                                </button>
                                <button onClick={cancelEdit} className="bg-slate-200 text-slate-500 p-3 rounded-xl hover:bg-slate-300 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                                </button>
                            </div>
                        </div>
                    </div>
                 ) : (
                    // --- VIEW MODE ---
                    <div className="p-5 flex items-center justify-between">
                         <div className="flex items-center gap-4 flex-1 overflow-hidden">
                            <button 
                              onClick={() => toggleTaskCompletion(task.id)}
                              className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all shrink-0
                                ${task.completed ? 'bg-nature-500 border-nature-500' : 'border-slate-200 hover:border-nature-400'}
                              `}
                            >
                               {task.completed && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>}
                            </button>
                            
                            <div className="flex-1 cursor-pointer min-w-0" onClick={() => !task.completed && setActiveTaskId(task.id)}>
                               <h3 className={`font-bold text-lg leading-tight transition-all truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                                  {task.title}
                               </h3>
                               <div className="flex items-center gap-2 mt-1">
                                  <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${activeTaskId === task.id ? 'bg-nature-200 text-nature-700' : 'bg-slate-100 text-slate-400'}`}>
                                     {task.completedPomos}/{task.estimatedPomos} Pomos
                                  </span>
                                  {activeTaskId === task.id && <span className="text-[10px] font-black uppercase text-nature-500 tracking-wider animate-pulse whitespace-nowrap">• Active</span>}
                               </div>
                            </div>
                         </div>

                         {/* Action Buttons (Edit & Delete) */}
                         <div className="flex items-center gap-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                            <button 
                                onClick={() => startEditing(task)}
                                className="p-2 text-slate-300 hover:text-blue-500 hover:bg-blue-50 rounded-xl transition-all"
                                title="Edit Task"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path d="M21.731 2.269a2.625 2.625 0 00-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 000-3.712zM19.513 8.199l-3.712-3.712-12.15 12.15a5.25 5.25 0 00-1.32 2.214l-.8 2.685a.75.75 0 00.933.933l2.685-.8a5.25 5.25 0 002.214-1.32L19.513 8.2z" /></svg>
                            </button>
                            <button 
                                onClick={() => onDelete(task.id)}
                                className="p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                                title="Delete Task"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" /></svg>
                            </button>
                         </div>
                    </div>
                 )}
              </motion.div>
            ))}
          </AnimatePresence>
       </div>
    </div>
  );
};