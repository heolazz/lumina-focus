import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PersimmonMascot } from './Mascot';

interface AuthProps {
  onLogin: () => void;
}

export const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [greeting, setGreeting] = useState('');
  
  // STATE BARU: Untuk trigger animasi exit
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning!');
    else if (hour < 18) setGreeting('Good Afternoon!');
    else setGreeting('Good Evening!');
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulasi proses login
    setTimeout(() => {
        setIsLoading(false);
        setIsSuccess(true); // Trigger animasi
        
        // Tunggu animasi selesai baru pindah state
        setTimeout(() => {
            onLogin();
        }, 800); 
    }, 1500);
  };

  return (
    <div className="min-h-screen w-full flex flex-row overflow-hidden font-sans relative">
      
      {/* --- ANIMASI FULL SCREEN SAAT SUCCESS --- */}
      <AnimatePresence>
        {isSuccess && (
            <motion.div 
                className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
            >
                {/* Lingkaran Oranye Membesar */}
                <motion.div 
                    className="absolute bg-orange-500 rounded-full"
                    initial={{ width: 0, height: 0 }}
                    animate={{ width: 4000, height: 4000 }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                />
                
                {/* Maskot di Tengah */}
                <motion.div 
                    className="relative z-10 flex flex-col items-center"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1.5, opacity: 1 }}
                    transition={{ delay: 0.2, type: "spring" }}
                >
                    <PersimmonMascot happy={true} celebrating={true} className="w-40 h-40" />
                    <motion.h2 
                        className="text-white font-black text-3xl mt-4"
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 }}
                    >
                        Let's Go!
                    </motion.h2>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* --- KONTEN UTAMA --- */}
      <div className="hidden lg:flex lg:w-5/12 bg-nature-500 relative flex-col items-center justify-center p-12 text-white z-10">
         <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-nature-400 rounded-full blur-[80px] opacity-50"></div>
         <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-yellow-400 rounded-full blur-[80px] opacity-20"></div>
         
         <div className="relative z-10 flex flex-col items-center text-center">
             <motion.div 
                initial={{ scale: 0, rotate: -15 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: "spring", duration: 0.8 }}
                className="mb-8"
             >
                <div className="bg-white/20 backdrop-blur-md p-8 rounded-full border border-white/30 shadow-2xl">
                   <PersimmonMascot happy={true} className="w-48 h-48" />
                </div>
             </motion.div>
             <h1 className="text-5xl font-black tracking-tighter mb-3 drop-shadow-sm">Lumina Focus</h1>
             <p className="text-nature-100 text-xl font-medium max-w-xs leading-relaxed">Your cozy space to stay productive.</p>
         </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative bg-nature-500 lg:bg-white transition-colors duration-500">
         <div className="lg:hidden absolute top-[-10%] left-[-10%] w-[70%] h-[70%] bg-nature-400 rounded-full blur-[100px] opacity-60"></div>
         <div className="lg:hidden absolute bottom-[-10%] right-[-10%] w-[70%] h-[70%] bg-yellow-300 rounded-full blur-[100px] opacity-40"></div>

         <div className="w-full max-w-sm lg:max-w-md relative z-10 bg-white/95 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none rounded-[2.5rem] lg:rounded-none p-8 lg:p-0 shadow-2xl lg:shadow-none transition-all">
             
             <div className="lg:hidden flex justify-center mb-6 -mt-16">
                 <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white p-3 rounded-full shadow-lg ring-4 ring-nature-100"
                 >
                    <PersimmonMascot happy={isLogin} className="w-20 h-20" />
                 </motion.div>
             </div>

             <div className="mb-8 text-center lg:text-left">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={isLogin ? 'login' : 'signup'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                    >
                        <h2 className="text-3xl lg:text-4xl font-black text-slate-800 mb-2 tracking-tight">
                           {isLogin ? greeting : "Join Lumina"}
                        </h2>
                        <p className="text-slate-400 font-bold text-sm lg:text-lg">
                           {isLogin ? "Let's make today count." : "Start your focus journey."}
                        </p>
                    </motion.div>
                </AnimatePresence>
             </div>

             <form onSubmit={handleSubmit} className="space-y-5 lg:space-y-6">
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 hidden lg:block">Email Address</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400 group-focus-within:text-nature-500 transition-colors">
                                <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
                                <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
                            </svg>
                        </div>
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full bg-slate-50 lg:bg-white border-2 border-slate-100 lg:border-slate-200 rounded-2xl pl-12 pr-4 py-4 font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-nature-500 focus:bg-white transition-all shadow-sm lg:shadow-none"
                            placeholder="Email Address"
                        />
                    </div>
                </div>
                
                <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider ml-1 hidden lg:block">Password</label>
                    <div className="relative group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-slate-400 group-focus-within:text-nature-500 transition-colors">
                                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
                            </svg>
                        </div>
                        <input 
                            type={showPassword ? "text" : "password"} 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full bg-slate-50 lg:bg-white border-2 border-slate-100 lg:border-slate-200 rounded-2xl pl-12 pr-12 py-4 font-bold text-slate-700 placeholder:text-slate-400 focus:outline-none focus:border-nature-500 focus:bg-white transition-all shadow-sm lg:shadow-none"
                            placeholder="Password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-nature-600 transition-colors focus:outline-none"
                        >
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M12 15a3 3 0 100-6 3 3 0 000 6z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 010-1.113zM17.25 12a5.25 5.25 0 11-10.5 0 5.25 5.25 0 0110.5 0z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path d="M3.53 2.47a.75.75 0 00-1.06 1.06l18 18a.75.75 0 101.06-1.06l-18-18zM22.676 12.553a11.249 11.249 0 01-2.631 4.31l-3.099-3.099a5.25 5.25 0 00-6.71-6.71L7.759 4.577a11.217 11.217 0 014.242-.827c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113z" />
                                    <path d="M15.75 12c0 .18-.013.357-.037.53l-4.244-4.243A3.75 3.75 0 0115.75 12zM12.53 15.713l-4.243-4.244a3.75 3.75 0 004.243 4.243z" />
                                    <path d="M6.75 12c0-.619.107-1.213.304-1.764l-3.1-3.1a11.25 11.25 0 00-2.63 4.31c-.12.362-.12.752 0 1.114 1.489 4.467 5.704 7.69 10.675 7.69 1.176 0 2.29-.154 3.344-.437l-3.119-3.119C11.115 16.613 10.224 16.5 9.32 16.146l-.004-.002-.004-.002a3.752 3.752 0 01-2.56-4.143z" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                <button 
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-nature-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-nature-200 hover:bg-nature-600 hover:shadow-2xl hover:-translate-y-1 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center gap-2 group mt-6"
                >
                    {isLoading ? (
                        <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                        <>
                           <span className="text-lg tracking-wide">{isLogin ? "LET'S GO" : "CREATE ACCOUNT"}</span>
                           <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6 group-hover:translate-x-1 transition-transform">
                              <path fillRule="evenodd" d="M16.72 7.72a.75.75 0 011.06 0l3.75 3.75a.75.75 0 010 1.06l-3.75 3.75a.75.75 0 11-1.06-1.06l2.47-2.47H3a.75.75 0 010-1.5h16.19l-2.47-2.47a.75.75 0 010-1.06z" clipRule="evenodd" />
                           </svg>
                        </>
                    )}
                </button>
             </form>

             <div className="mt-8 text-center relative z-10">
                <p className="text-slate-500 lg:text-slate-400 font-bold text-sm">
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button 
                        onClick={() => {
                            setIsLogin(!isLogin);
                            setEmail('');
                            setPassword('');
                        }}
                        className="text-nature-600 ml-2 hover:text-nature-700 hover:underline transition-all font-black"
                    >
                        {isLogin ? "Sign Up" : "Log In"}
                    </button>
                </p>
             </div>
         </div>
      </div>
    </div>
  );
};