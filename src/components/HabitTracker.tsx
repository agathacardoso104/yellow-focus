import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit3, Check, X } from 'lucide-react';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const HabitTracker = () => {
  const { state, addHabit, toggleHabit, deleteHabit, updateHabit } = useApp();
  const [newHabitName, setNewHabitName] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const last7Days = eachDayOfInterval({
    start: subDays(new Date(), 6),
    end: new Date()
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newHabitName.trim()) {
      addHabit(newHabitName.trim());
      setNewHabitName('');
    }
  };

  const startEdit = (id: string, name: string) => {
    setEditingId(id);
    setEditValue(name);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      updateHabit(id, editValue.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="bg-white border-4 border-black p-6 transition-colors">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-6">Hábitos</h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-8">
        <input 
          type="text" 
          value={newHabitName}
          onChange={(e) => setNewHabitName(e.target.value)}
          placeholder="Novo hábito..."
          className="flex-1 bg-zinc-100 border-2 border-black p-2 font-bold focus:outline-none focus:bg-yellow-100"
        />
        <button 
          type="submit"
          className="bg-black text-white p-2 hover:bg-yellow-400 hover:text-black transition-colors"
        >
          <Plus />
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="text-left py-2 px-4 font-black uppercase text-xs">Hábito</th>
              {last7Days.map(day => (
                <th key={day.toISOString()} className="py-2 px-2 font-black uppercase text-[10px] text-center">
                  {format(day, 'eee')}
                  <br />
                  {format(day, 'd')}
                </th>
              ))}
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {state.habits.map(habit => (
              <tr key={habit.id} className="group border-b border-zinc-200 hover:bg-zinc-50 transition-colors">
                <td className="py-4 px-4">
                  {editingId === habit.id ? (
                    <div className="flex gap-1">
                      <input 
                        autoFocus
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        className="bg-transparent border-b-2 border-black font-bold outline-none w-32"
                      />
                      <button onClick={() => saveEdit(habit.id)} className="text-green-600"><Check size={16}/></button>
                      <button onClick={() => setEditingId(null)} className="text-red-500"><X size={16}/></button>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{habit.name}</span>
                      <button 
                        onClick={() => startEdit(habit.id, habit.name)}
                        className="opacity-0 group-hover:opacity-100 p-1 hover:bg-black hover:text-white transition-all scale-75"
                      >
                        <Edit3 size={12} />
                      </button>
                    </div>
                  )}
                </td>
                {last7Days.map(day => {
                  const dStr = format(day, 'yyyy-MM-dd');
                  const isCompleted = habit.completedDates.includes(dStr);
                  return (
                    <td key={dStr} className="py-4 px-2 text-center">
                      <button
                        onClick={() => toggleHabit(habit.id, dStr)}
                        className={cn(
                          "w-8 h-8 border-2 transition-all mx-auto flex items-center justify-center",
                          isCompleted 
                            ? "bg-yellow-400 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]" 
                            : "border-zinc-300 hover:border-black"
                        )}
                      >
                        {isCompleted && <Check size={16} className="text-black" />}
                      </button>
                    </td>
                  );
                })}
                <td className="py-4 text-right">
                  <button 
                    onClick={() => deleteHabit(habit.id)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-zinc-400 hover:text-red-500 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
