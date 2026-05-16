/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { CalendarView } from './components/CalendarView';
import { TaskSection } from './components/TaskSection';
import { HabitTracker } from './components/HabitTracker';
import { PomodoroTimer } from './components/PomodoroTimer';
import { NotesArea } from './components/NotesArea';
import { 
  LayoutDashboard, 
  Calendar as CalendarIcon, 
  CheckSquare, 
  Activity, 
  Timer, 
  Menu, 
  X,
  Target,
  Sun,
  LogIn,
  LogOut,
  User
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { useApp } from './context/AppContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Tab = 'dashboard' | 'calendar' | 'habits' | 'pomodoro';

function LoginPage() {
  const { login, register } = useApp();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  
  // Registration States
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Login States
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const result = await login(loginEmail, loginPassword, rememberMe);
    if (!result.success) {
      setError(result.message);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (email !== confirmEmail) {
      setError('Os e-mails não coincidem.');
      return;
    }
    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    const result = await register({ name, email, password });
    if (result.success) {
      setMessage(result.message);
      setMode('login');
      // Clear registration fields
      setName('');
      setEmail('');
      setConfirmEmail('');
      setPassword('');
      setConfirmPassword('');
    } else {
      setError(result.message);
    }
  };

  return (
    <div className="min-h-screen bg-yellow-400 flex items-center justify-center p-4 transition-colors duration-300">
      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-8 md:p-12 w-full max-w-md border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)]"
      >
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-yellow-400 flex items-center justify-center mb-4 border-2 border-black">
            <Target className="text-black" size={32} />
          </div>
          <h1 className="text-4xl font-black text-black uppercase tracking-tighter text-center leading-none">Yellow Focus</h1>
          <p className="text-zinc-500 font-bold uppercase text-[10px] tracking-widest mt-4">Organize seu mundo hoje</p>
        </div>

        {message && (
          <div className="mb-6 p-3 bg-green-100 border-2 border-green-600 text-green-800 text-[10px] font-black uppercase text-center">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 p-3 bg-red-100 border-2 border-red-600 text-red-800 text-[10px] font-black uppercase text-center">
            {error}
          </div>
        )}

        {mode === 'login' ? (
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">E-mail</label>
              <input 
                type="email" 
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full bg-zinc-100 border-2 border-zinc-200 p-3 text-black font-bold focus:outline-none focus:border-yellow-400 placeholder:text-zinc-400"
              />
            </div>
            <div>
              <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">Senha</label>
              <input 
                type="password" 
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="******"
                className="w-full bg-zinc-100 border-2 border-zinc-200 p-3 text-black font-bold focus:outline-none focus:border-yellow-400 placeholder:text-zinc-400"
              />
            </div>

            <div className="flex items-center gap-2 py-2">
              <input 
                type="checkbox" 
                id="remember"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 accent-black"
              />
              <label htmlFor="remember" className="text-[10px] font-black uppercase tracking-widest cursor-pointer select-none">
                Manter-me logado
              </label>
            </div>

            <button 
              type="submit"
              className="w-full bg-yellow-400 text-black border-2 border-black p-4 font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-x-0 active:translate-y-0"
            >
              Acessar Conta
            </button>

            <p className="text-center text-[10px] font-black uppercase tracking-widest mt-6">
              Novo por aqui?{' '}
              <button 
                type="button"
                onClick={() => setMode('register')}
                className="text-zinc-500 hover:text-black underline underline-offset-2"
              >
                Crie sua conta
              </button>
            </p>
          </form>
        ) : (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">Seu Nome</label>
              <input 
                type="text" 
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Como te chamamos?"
                className="w-full bg-zinc-100 border-2 border-zinc-200 p-2 text-black font-bold focus:outline-none focus:border-yellow-400 text-sm"
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">E-mail</label>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Seu e-mail"
                  className="w-full bg-zinc-100 border-2 border-zinc-200 p-2 text-black font-bold focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">Confirmar E-mail</label>
                <input 
                  type="email" 
                  required
                  value={confirmEmail}
                  onChange={(e) => setConfirmEmail(e.target.value)}
                  placeholder="Repita o e-mail"
                  className="w-full bg-zinc-100 border-2 border-zinc-200 p-2 text-black font-bold focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">Senha</label>
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Senha"
                  className="w-full bg-zinc-100 border-2 border-zinc-200 p-2 text-black font-bold focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
              <div>
                <label className="block text-black font-black uppercase text-[10px] mb-1 tracking-widest">Confirmar Senha</label>
                <input 
                  type="password" 
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita a senha"
                  className="w-full bg-zinc-100 border-2 border-zinc-200 p-2 text-black font-bold focus:outline-none focus:border-yellow-400 text-sm"
                />
              </div>
            </div>

            <button 
              type="submit"
              className="w-full bg-black text-white border-2 border-black p-4 font-black uppercase tracking-widest hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,0,0.3)] active:shadow-none active:translate-x-0 active:translate-y-0 mt-4"
            >
              Criar minha conta
            </button>

            <p className="text-center text-[10px] font-black uppercase tracking-widest mt-6">
              Já tem conta?{' '}
              <button 
                type="button"
                onClick={() => setMode('login')}
                className="text-zinc-500 hover:text-black underline underline-offset-2"
              >
                Faça login
              </button>
            </p>
          </form>
        )}

        <div className="mt-8 pt-8 border-t border-zinc-200 text-center">
          <p className="text-zinc-400 text-[10px] font-bold uppercase">FOCO / DISCIPLINA / RESULTADO</p>
        </div>
      </motion.div>
    </div>
  );
}

function MainApp() {
  const { state, logout } = useApp();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const tabs: { id: Tab; label: string; icon: any }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'calendar', label: 'Calendário', icon: CalendarIcon },
    { id: 'habits', label: 'Hábitos', icon: Activity },
    { id: 'pomodoro', label: 'Cronômetro', icon: Timer },
  ];

  if (!state.user) return <LoginPage />;

  return (
    <div className="min-h-screen bg-white flex font-sans text-black selection:bg-yellow-400 selection:text-black transition-colors duration-300">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className={cn(
        "fixed inset-y-0 left-0 w-64 bg-white text-black z-50 transition-transform duration-300 lg:relative lg:translate-x-0 flex flex-col border-r-4 border-black",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2 mb-8 text-black">
            <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center">
              <Target className="text-black" />
            </div>
            <h1 className="text-2xl font-black uppercase tracking-tighter">Yellow Focus</h1>
          </div>
          
          <nav className="space-y-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  setIsSidebarOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-4 px-4 py-3 font-black uppercase text-xs tracking-widest transition-all",
                  activeTab === tab.id 
                    ? "bg-yellow-400 text-black translate-x-2" 
                    : "text-zinc-400 hover:text-black hover:bg-zinc-100"
                )}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto p-4 space-y-4">
          <div className="bg-zinc-50 p-4 border-2 border-zinc-200 flex items-center gap-3">
             <div className="w-10 h-10 bg-yellow-400 flex items-center justify-center text-black font-black uppercase shrink-0">
               {state.user.name.charAt(0)}
             </div>
             <div className="min-w-0">
               <p className="font-bold truncate text-sm leading-tight">{state.user.name}</p>
               <p className="text-[10px] font-medium text-zinc-400 truncate tracking-tight">{state.user.email}</p>
             </div>
          </div>

          <button 
            onClick={logout}
            className="w-full flex items-center justify-center gap-2 p-3 border-2 border-zinc-200 hover:bg-red-500 hover:border-red-500 transition-all text-[10px] font-black uppercase tracking-widest text-zinc-400 hover:text-white"
          >
            <LogOut size={14} />
            Sair do App
          </button>

          <div className="p-4 bg-zinc-50 border-2 border-zinc-200">
             <div className="flex items-center justify-center gap-2 mb-2 opacity-40">
               <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
               <p className="text-[8px] font-black uppercase">Sincronização Ativa (Nuvem)</p>
             </div>
             <p className="text-[10px] font-black uppercase text-center opacity-40">O progresso é constante.</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b-4 border-black flex items-center justify-between px-6 shrink-0 transition-colors">
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="lg:hidden p-2 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors"
          >
            <Menu size={20} />
          </button>

          <div className="hidden lg:flex items-center gap-2">
            <CheckSquare size={16} className="text-yellow-500" />
            <span className="font-black uppercase text-xs tracking-widest">
              Organize / Foque / Conquiste
            </span>
          </div>

          <div className="flex items-center gap-4">
            <div className="h-8 w-[1px] bg-zinc-200" />
            <span className="font-black uppercase text-xs sm:text-sm whitespace-nowrap">
              {new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
            </span>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto space-y-8"
            >
              {activeTab === 'dashboard' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-8 flex flex-col gap-6">
                    <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                    <HabitTracker />
                  </div>
                  <div className="lg:col-span-4 flex flex-col gap-6">
                    <PomodoroTimer />
                    <TaskSection selectedDate={selectedDate} />
                    <NotesArea />
                  </div>
                </div>
              )}

              {activeTab === 'calendar' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                  <div className="lg:col-span-12">
                    <CalendarView selectedDate={selectedDate} onDateSelect={setSelectedDate} />
                  </div>
                  <div className="lg:col-span-12">
                    <TaskSection selectedDate={selectedDate} />
                  </div>
                </div>
              )}

              {activeTab === 'habits' && (
                <div className="space-y-6">
                  <HabitTracker />
                </div>
              )}

              {activeTab === 'pomodoro' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  <PomodoroTimer />
                  <div className="space-y-6">
                    <TaskSection selectedDate={selectedDate} />
                    <NotesArea />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
