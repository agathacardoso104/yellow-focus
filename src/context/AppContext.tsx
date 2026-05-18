import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { syncService } from '../services/syncService';

async function hashPassword(email: string, password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(`${email.toLowerCase()}:${password}:yellow-focus-salt-v1`);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string; // ISO string YYYY-MM-DD
}

export interface Habit {
  id: string;
  name: string;
  completedDates: string[]; // List of ISO strings YYYY-MM-DD
}

export interface User {
  name: string;
  email: string;
  password?: string;
}

export interface AppState {
  tasks: Task[];
  habits: Habit[];
  notes: string;
  user: User | null;
}

const AppContext = createContext<{
  state: AppState;
  addTask: (text: string, date: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTask: (id: string, text: string) => void;
  addHabit: (name: string) => void;
  toggleHabit: (id: string, date: string) => void;
  deleteHabit: (id: string) => void;
  updateHabit: (id: string, name: string) => void;
  updateNotes: (text: string) => void;
  login: (email: string, password: string, remember: boolean) => Promise<{ success: boolean; message: string }>;
  register: (user: User) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
} | undefined>(undefined);

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('yellow_focus_app_state');
    const defaultData: AppState = { tasks: [], habits: [], notes: '', user: null };
    try {
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultData,
          ...parsed,
          user: parsed.user || null
        };
      }
    } catch (e) {
      console.error('Failed to load state from localStorage', e);
    }
    return defaultData;
  });

  const isRemoteChange = useRef(false);

  // Simulation of a Users Database in LocalStorage
  const getRegisteredUsers = (): User[] => {
    const users = localStorage.getItem('yellow_focus_registered_users');
    return users ? JSON.parse(users) : [];
  };

  const saveUserToDB = (user: User) => {
    const users = getRegisteredUsers();
    users.push(user);
    localStorage.setItem('yellow_focus_registered_users', JSON.stringify(users));
  };

  // Load from Firebase on login
  useEffect(() => {
    if (state.user?.email) {
      syncService.loadState(state.user.email).then(remoteState => {
        if (remoteState) {
          isRemoteChange.current = true;
          setState(prev => ({ ...prev, ...remoteState }));
        }
      });

      // Subscribe to real-time changes
      const unsubscribe = syncService.subscribeToChanges(state.user.email, (remoteData) => {
        isRemoteChange.current = true;
        setState(prev => ({ ...prev, ...remoteData }));
      });

      return () => unsubscribe();
    }
  }, [state.user?.email]);

  // Save changes to localStorage AND Firebase
  useEffect(() => {
    localStorage.setItem('yellow_focus_app_state', JSON.stringify(state));
    
    // Save to Firebase only if it wasn't a remote change that triggered this effect
    if (!isRemoteChange.current) {
      syncService.saveState(state);
    }
    isRemoteChange.current = false;
  }, [state]);

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark');
    root.style.colorScheme = 'light';
  }, []);

  const addTask = (text: string, date: string) => {
    const newTask: Task = { id: crypto.randomUUID(), text, completed: false, date };
    setState(prev => ({ ...prev, tasks: [...prev.tasks, newTask] }));
  };

  const toggleTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    }));
  };

  const deleteTask = (id: string) => {
    setState(prev => ({ ...prev, tasks: prev.tasks.filter(t => t.id !== id) }));
  };

  const updateTask = (id: string, text: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === id ? { ...t, text } : t)
    }));
  };

  const addHabit = (name: string) => {
    const newHabit: Habit = { id: crypto.randomUUID(), name, completedDates: [] };
    setState(prev => ({ ...prev, habits: [...prev.habits, newHabit] }));
  };

  const toggleHabit = (id: string, date: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => {
        if (h.id !== id) return h;
        const exists = h.completedDates.includes(date);
        return {
          ...h,
          completedDates: exists 
            ? h.completedDates.filter(d => d !== date) 
            : [...h.completedDates, date]
        };
      })
    }));
  };

  const deleteHabit = (id: string) => {
    setState(prev => ({ ...prev, habits: prev.habits.filter(h => h.id !== id) }));
  };

  const updateHabit = (id: string, name: string) => {
    setState(prev => ({
      ...prev,
      habits: prev.habits.map(h => h.id === id ? { ...h, name } : h)
    }));
  };

  const updateNotes = (notes: string) => {
    setState(prev => ({ ...prev, notes }));
  };

  const login = async (email: string, password: string, _remember: boolean) => {
    const passwordHash = await hashPassword(email, password);

    const users = getRegisteredUsers();
    let user = users.find(u => u.email === email && u.password === passwordHash);

    if (!user) {
      const cloudUser = await syncService.findUserLocallyOrCloud(email);
      if (cloudUser && cloudUser.password === passwordHash) {
        user = cloudUser;
        saveUserToDB(user);
      }
    }

    if (user) {
      const publicUser = { name: user.name, email: user.email };
      setState(prev => ({ ...prev, user: publicUser }));
      return { success: true, message: "Sucesso" };
    }
    return { success: false, message: "E-mail ou senha incorretos." };
  };

  const register = async (user: User) => {
    const users = getRegisteredUsers();
    const cloudUser = await syncService.findUserLocallyOrCloud(user.email);

    if (users.find(u => u.email === user.email) || cloudUser) {
      return { success: false, message: "Este e-mail já está cadastrado." };
    }

    const passwordHash = await hashPassword(user.email, user.password ?? '');
    const stored: User = { name: user.name, email: user.email, password: passwordHash };

    saveUserToDB(stored);
    await syncService.registerUserCloud(stored);

    return { success: true, message: "Cadastro realizado com sucesso! Faça login." };
  };

  const logout = () => {
    setState(prev => ({ ...prev, user: null }));
    localStorage.removeItem('yellow_focus_app_state');
  };

  return (
    <AppContext.Provider value={{ 
      state, addTask, toggleTask, deleteTask, updateTask, 
      addHabit, toggleHabit, deleteHabit, updateHabit, updateNotes,
      login, register, logout
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
