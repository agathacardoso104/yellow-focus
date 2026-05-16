import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Coffee, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export const PomodoroTimer = () => {
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [sessions, setSessions] = useState(0);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      handleSwitch();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const handleSwitch = () => {
    if (mode === 'work') {
      const nextSessions = sessions + 1;
      setSessions(nextSessions);
      if (nextSessions % 4 === 0) {
        // Long break or reset? User asked for 4 sessions.
        // For simplicity, let's keep it at 5 min break as requested.
        setMode('break');
        setTimeLeft(5 * 60);
      } else {
        setMode('break');
        setTimeLeft(5 * 60);
      }
    } else {
      setMode('work');
      setTimeLeft(30 * 60);
    }
    setIsActive(false);
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setMode('work');
    setTimeLeft(30 * 60);
    setSessions(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-black border-4 border-yellow-400 p-8 flex flex-col items-center justify-center space-y-6 text-white min-h-[400px]">
      <div className="flex items-center gap-2 mb-2">
        {mode === 'work' ? <Zap className="text-yellow-400" /> : <Coffee className="text-yellow-400" />}
        <span className="uppercase font-black text-xl tracking-tighter">
          {mode === 'work' ? 'Foco Intenso' : 'Pausa Rápida'}
        </span>
      </div>

      <div className="text-8xl font-black text-yellow-400 tracking-tighter tabular-nums mb-4">
        {formatTime(timeLeft)}
      </div>

      <div className="flex gap-4">
        <button 
          onClick={toggleTimer}
          className="bg-yellow-400 text-black px-8 py-3 font-black uppercase text-sm hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] active:shadow-none active:translate-x-0 active:translate-y-0"
        >
          {isActive ? <Pause /> : <Play />}
        </button>
        <button 
          onClick={resetTimer}
          className="bg-white text-black px-8 py-3 font-black uppercase text-sm hover:translate-x-1 hover:-translate-y-1 transition-transform shadow-[4px_4px_0px_0px_rgba(254,240,138,1)] active:shadow-none"
        >
          <RotateCcw />
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        {[1, 2, 3, 4].map(s => (
          <div 
            key={s} 
            className={`w-4 h-4 border-2 ${s <= sessions % 5 ? 'bg-yellow-400 border-yellow-400' : 'border-white'}`}
          />
        ))}
      </div>
      <p className="text-xs opacity-50 uppercase font-bold tracking-widest">Sessões: {sessions % 5}/4</p>
    </div>
  );
};
