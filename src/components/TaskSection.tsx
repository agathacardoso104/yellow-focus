import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Plus, Trash2, Edit3, CheckCircle2, Circle } from 'lucide-react';
import { format } from 'date-fns';
import { motion, AnimatePresence } from 'motion/react';

export const TaskSection = ({ selectedDate }: { selectedDate: Date }) => {
  const { state, addTask, toggleTask, deleteTask, updateTask } = useApp();
  const [newTaskText, setNewTaskText] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editValue, setEditValue] = useState('');

  const dateStr = format(selectedDate, 'yyyy-MM-dd');
  const filteredTasks = state.tasks.filter(t => t.date === dateStr);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskText.trim()) {
      addTask(newTaskText.trim(), dateStr);
      setNewTaskText('');
    }
  };

  const startEdit = (id: string, text: string) => {
    setEditingId(id);
    setEditValue(text);
  };

  const saveEdit = (id: string) => {
    if (editValue.trim()) {
      updateTask(id, editValue.trim());
      setEditingId(null);
    }
  };

  return (
    <div className="bg-white border-4 border-black p-6 h-full flex flex-col transition-colors">
      <h2 className="text-3xl font-black uppercase tracking-tighter mb-6 flex items-center gap-2">
        Tarefas
        <span className="text-xs bg-black text-white px-2 py-0.5 rounded-full">{filteredTasks.length}</span>
      </h2>

      <form onSubmit={handleAdd} className="flex gap-2 mb-6">
        <input 
          type="text" 
          value={newTaskText}
          onChange={(e) => setNewTaskText(e.target.value)}
          placeholder="Nova tarefa..."
          className="flex-1 bg-zinc-100 border-2 border-black p-2 font-bold placeholder:text-zinc-400 focus:outline-none focus:bg-yellow-100"
        />
        <button 
          type="submit"
          className="bg-black text-white p-2 hover:bg-yellow-400 hover:text-black transition-colors"
        >
          <Plus />
        </button>
      </form>

      <div className="flex-1 space-y-3 overflow-y-auto pr-2">
        <AnimatePresence mode="popLayout">
          {filteredTasks.length === 0 ? (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              className="text-center font-bold uppercase italic py-8"
            >
              Nenhuma tarefa para hoje
            </motion.p>
          ) : (
            filteredTasks.map(task => (
              <motion.div 
                layout
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                key={task.id}
                className={`flex items-center gap-3 p-3 border-2 border-black group transition-all ${task.completed ? 'bg-zinc-50 border-dashed opacity-60' : 'bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]'}`}
              >
                <button 
                  onClick={() => toggleTask(task.id)}
                  className="text-black hover:text-yellow-600 transition-colors"
                >
                  {task.completed ? <CheckCircle2 className="fill-yellow-400 text-yellow-400" /> : <Circle />}
                </button>

                {editingId === task.id ? (
                  <input
                    autoFocus
                    value={editValue}
                    onChange={(e) => setEditValue(e.target.value)}
                    onBlur={() => saveEdit(task.id)}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit(task.id)}
                    className="flex-1 bg-transparent border-b-2 border-black font-bold outline-none"
                  />
                ) : (
                  <span className={`flex-1 font-bold ${task.completed ? 'line-through text-zinc-400' : ''}`}>
                    {task.text}
                  </span>
                )}

                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => startEdit(task.id, task.text)}
                    className="p-1 hover:bg-black hover:text-white transition-colors"
                  >
                    <Edit3 size={16} />
                  </button>
                  <button 
                    onClick={() => deleteTask(task.id)}
                    className="p-1 hover:bg-red-500 hover:text-white transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
