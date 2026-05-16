import { useApp } from '../context/AppContext';
import { StickyNote } from 'lucide-react';

export const NotesArea = () => {
  const { state, updateNotes } = useApp();

  return (
    <div className="bg-white border-4 border-black p-6 flex flex-col h-full min-h-[300px] transition-colors">
      <div className="flex items-center gap-2 mb-4 text-black">
        <StickyNote size={20} />
        <h2 className="text-2xl font-black uppercase tracking-tighter">Notas</h2>
      </div>
      
      <textarea
        value={state.notes}
        onChange={(e) => updateNotes(e.target.value)}
        placeholder="Escreva algo aqui..."
        className="flex-1 bg-transparent text-black font-medium resize-none focus:outline-none placeholder:text-zinc-400 leading-relaxed text-sm"
      />
      
      <div className="mt-4 pt-4 border-t border-zinc-100 text-[10px] text-zinc-400 uppercase font-black flex justify-between">
        <span>Yellow Focus Alpha</span>
        <span>{state.notes.length} caracteres</span>
      </div>
    </div>
  );
};
