import React, { useState } from 'react';
import { Task } from '../types';
import { motion, AnimatePresence } from 'framer-motion';

interface TaskListProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTaskId: string | null;
  setActiveTaskId: (id: string | null) => void;
  onDelete: (id: string) => void; // Prop baru
}

export const TaskList: React.FC<TaskListProps> = ({ tasks, setTasks, activeTaskId, setActiveTaskId, onDelete }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [estPomos, setEstPomos] = useState(1);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;

    const newTask: Task = {
      // Gunakan crypto.randomUUID() untuk ID unik string (cocok dgn Supabase)
      id: crypto.randomUUID(), 
      title: newTaskTitle,
      completed: false,
      estimatedPomos: estPomos,
      completedPomos: 0,
      tag: "Work"
    };

    // Tambah ke state lokal (App.tsx akan handle sync upsert ke DB)
    setTasks([newTask, ...tasks]);
    setNewTaskTitle("");
    setEstPomos(1);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(prev => prev.map(t => 
      t.id === taskId ? { ...t, completed: !t.completed } : t
    ));
  };

  return (
    <div className="w-full h-full max-w-3xl mx-auto p-6 md:p-12 pb-32">
       
       {/* HEADER */}
       <div className="mb-8">
          <h2 className="text-4xl font-black text-slate-800 tracking-tighter mb-2">Tasks</h2>
          <p className="text-slate-400 font-bold">What are we focusing on today?</p>
       </div>

       {/* ADD TASK FORM */}
       <form onSubmit={handleAddTask} className="mb-10 relative z-20">
          <div className="bg-white p-2 rounded-[2rem] shadow-xl shadow-slate-100 border border-slate-100 flex items-center gap-2 pr-2">
             <div className="w-12 h-12 bg-nature-50 rounded-full flex items-center justify-center text-nature-500 font-bold">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6"><path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" /></svg>
             </div>
             <input 
               type="text" 
               value={newTaskTitle}
               onChange={(e) => setNewTaskTitle(e.target.value)}
               placeholder="Add a new task..." 
               className="flex-1 bg-transparent font-bold text-slate-700 placeholder:text-slate-300 outline-none px-2"
             />
             
             {/* Est Pomodoro Selector */}
             <div className="flex items-center gap-1 bg-slate-50 px-3 py-2 rounded-xl">
                <span className="text-xs font-bold text-slate-400 uppercase mr-1">Est</span>
                <button type="button" onClick={() => setEstPomos(Math.max(1, estPomos - 1))} className="text-slate-400 hover:text-nature-600 font-bold">-</button>
                <span className="font-black text-slate-700 w-4 text-center">{estPomos}</span>
                <button type="button" onClick={() => setEstPomos(Math.min(10, estPomos + 1))} className="text-slate-400 hover:text-nature-600 font-bold">+</button>
             </div>

             <button type="submit" className="bg-nature-500 hover:bg-nature-600 text-white p-4 rounded-full transition-colors shadow-lg shadow-nature-200">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z" clipRule="evenodd" /></svg>
             </button>
          </div>
       </form>

       {/* TASK LIST */}
       <div className="space-y-4">
          <AnimatePresence mode='popLayout'>
            {tasks.length === 0 && (
                <motion.div initial={{opacity: 0}} animate={{opacity: 1}} className="text-center py-10 opacity-50">
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
                className={`group relative p-5 rounded-[1.5rem] border transition-all duration-300 flex items-center justify-between
                   ${activeTaskId === task.id 
                      ? 'bg-nature-50 border-nature-200 shadow-lg shadow-nature-50 scale-[1.02]' 
                      : 'bg-white border-slate-50 shadow-sm hover:border-nature-100 hover:shadow-md'
                   }
                   ${task.completed ? 'opacity-60 bg-slate-50' : ''}
                `}
              >
                 {/* Left Side: Checkbox & Title */}
                 <div className="flex items-center gap-4 flex-1">
                    <button 
                      onClick={() => toggleTaskCompletion(task.id)}
                      className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all
                        ${task.completed ? 'bg-nature-500 border-nature-500' : 'border-slate-200 hover:border-nature-400'}
                      `}
                    >
                       {task.completed && <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-white"><path fillRule="evenodd" d="M19.916 4.626a.75.75 0 01.208 1.04l-9 13.5a.75.75 0 01-1.154.114l-6-6a.75.75 0 011.06-1.06l5.353 5.353 8.493-12.739a.75.75 0 011.04-.208z" clipRule="evenodd" /></svg>}
                    </button>
                    
                    <div className="flex-1 cursor-pointer" onClick={() => !task.completed && setActiveTaskId(task.id)}>
                       <h3 className={`font-bold text-lg leading-tight transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-slate-700'}`}>
                          {task.title}
                       </h3>
                       <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold px-2 py-0.5 rounded-md ${activeTaskId === task.id ? 'bg-nature-200 text-nature-700' : 'bg-slate-100 text-slate-400'}`}>
                             {task.completedPomos}/{task.estimatedPomos} Pomos
                          </span>
                          {activeTaskId === task.id && <span className="text-[10px] font-black uppercase text-nature-500 tracking-wider animate-pulse">• Active</span>}
                       </div>
                    </div>
                 </div>

                 {/* Right Side: Delete Button */}
                 <button 
                    onClick={() => onDelete(task.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-300 hover:text-red-400 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Task"
                 >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M16.5 4.478v.227a48.816 48.816 0 013.878.512.75.75 0 11-.256 1.478l-.209-.035-1.005 13.07a3 3 0 01-2.991 2.77H8.084a3 3 0 01-2.991-2.77L4.087 6.66l-.209.035a.75.75 0 01-.256-1.478A48.567 48.567 0 017.5 4.705v-.227c0-1.564 1.213-2.9 2.816-2.951a52.662 52.662 0 013.369 0c1.603.051 2.815 1.387 2.815 2.951zm-6.136-1.452a51.196 51.196 0 013.273 0C14.39 3.05 15 3.684 15 4.478v.113a49.488 49.488 0 00-6 0v-.113c0-.794.609-1.428 1.364-1.452zm-.355 5.945a.75.75 0 10-1.5.058l.347 9a.75.75 0 101.499-.058l-.346-9zm5.48.058a.75.75 0 10-1.498-.058l-.347 9a.75.75 0 001.5.058l.345-9z" clipRule="evenodd" /></svg>
                 </button>
              </motion.div>
            ))}
          </AnimatePresence>
       </div>
    </div>
  );
};