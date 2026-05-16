import { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  startOfDay,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, List, Clock } from 'lucide-react';
import { ptBR } from 'date-fns/locale';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type ViewType = 'month' | 'week' | 'day';

export const CalendarView = ({ 
  selectedDate, 
  onDateSelect 
}: { 
  selectedDate: Date, 
  onDateSelect: (date: Date) => void 
}) => {
  const [view, setView] = useState<ViewType>('month');
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const daysInMonth = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentMonth)),
    end: endOfWeek(endOfMonth(currentMonth)),
  });

  const daysInWeek = eachDayOfInterval({
    start: startOfWeek(selectedDate),
    end: endOfWeek(selectedDate),
  });

  const next = () => {
    if (view === 'month') setCurrentMonth(addMonths(currentMonth, 1));
    if (view === 'week') onDateSelect(addWeeks(selectedDate, 1));
    if (view === 'day') onDateSelect(addWeeks(selectedDate, 1 / 7)); // wait addDays...
  };

  const prev = () => {
    if (view === 'month') setCurrentMonth(subMonths(currentMonth, 1));
    if (view === 'week') onDateSelect(subWeeks(selectedDate, 1));
  };

  return (
    <div className="bg-white border-4 border-black p-4 transition-colors">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-black uppercase tracking-tighter">
          {format(view === 'month' ? currentMonth : selectedDate, 'MMMM yyyy', { locale: ptBR })}
        </h2>
        
        <div className="flex bg-black p-1">
          <button 
            onClick={() => setView('month')}
            className={cn(
              "px-3 py-1 text-xs font-bold uppercase transition-colors",
              view === 'month' ? "bg-yellow-400 text-black" : "text-white hover:bg-zinc-800"
            )}
          >
            Mês
          </button>
          <button 
            onClick={() => setView('week')}
            className={cn(
              "px-3 py-1 text-xs font-bold uppercase transition-colors",
              view === 'week' ? "bg-yellow-400 text-black" : "text-white hover:bg-zinc-800"
            )}
          >
            Semana
          </button>
          <button 
            onClick={() => setView('day')}
            className={cn(
              "px-3 py-1 text-xs font-bold uppercase transition-colors",
              view === 'day' ? "bg-yellow-400 text-black" : "text-white hover:bg-zinc-800"
            )}
          >
            Dia
          </button>
        </div>

        <div className="flex gap-2">
          <button onClick={prev} className="p-2 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors">
            <ChevronLeft size={20} />
          </button>
          <button onClick={next} className="p-2 border-2 border-black hover:bg-yellow-400 hover:text-black transition-colors">
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
          <div key={day} className="text-center font-black text-xs uppercase py-2 bg-black text-white">
            {day}
          </div>
        ))}
        
        {(view === 'month' ? daysInMonth : daysInWeek).map((day, idx) => {
          const isSelected = isSameDay(day, selectedDate);
          const isToday = isSameDay(day, new Date());
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <button
              key={idx}
              onClick={() => {
                onDateSelect(day);
                if (view === 'month' && !isSameMonth(day, currentMonth)) {
                  setCurrentMonth(startOfMonth(day));
                }
              }}
              className={cn(
                "h-16 md:h-24 border-2 p-1 flex flex-col items-end transition-all relative overflow-hidden group",
                isSelected 
                  ? "border-yellow-400 bg-yellow-50 z-10" 
                  : "border-zinc-100 hover:border-black",
                !isCurrentMonth && view === 'month' && "opacity-20",
              )}
            >
              <span className={cn(
                "text-sm font-black",
                isToday && "bg-black text-white px-1"
              )}>
                {format(day, 'd')}
              </span>
              {isSelected && <div className="absolute inset-0 border-2 border-yellow-400 pointer-events-none" />}
            </button>
          );
        })}
      </div>
      
      {view === 'day' && (
        <div className="mt-4 p-4 border-4 border-black bg-yellow-400 text-black animate-in fade-in slide-in-from-bottom-4 duration-300">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} />
            <h3 className="font-black uppercase text-sm">Visão do Dia</h3>
          </div>
          <p className="text-2xl font-black">
            {format(selectedDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
          </p>
        </div>
      )}
    </div>
  );
};
