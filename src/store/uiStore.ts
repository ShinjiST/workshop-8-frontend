import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  isSidebarCollapsed: boolean;
  sidebarWidth: number;
  toggleSidebar: () => void;
  setSidebarWidth: (width: number) => void;
}

export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      isSidebarCollapsed: false,
      sidebarWidth: 288, // Початкова ширина (w-72 = 288px)
      
      toggleSidebar: () => { set((state) => ({ 
        isSidebarCollapsed: !state.isSidebarCollapsed 
      })); },
      
      setSidebarWidth: (width) => { set({ sidebarWidth: width }); },
    }),
    {
      name: 'ui-storage', // Зберігаємо налаштування, щоб після F5 меню не стрибало
    }
  )
);