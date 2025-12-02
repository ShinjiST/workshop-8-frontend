import type React from "react";
import { Outlet } from "@tanstack/react-router";
import Sidebar from "./Sidebar";
import { useUIStore } from "@/store/uiStore";
// 👇 ЗМІНА 1: Прибрали Search та Bell з імпортів
import { Menu } from "lucide-react"; 

export const RootLayout: React.FC = () => {
  const { toggleSidebar } = useUIStore();

  return (
    <div className="h-screen flex overflow-hidden bg-[#f3f4f6]">
      
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0">
        
        {/* --- ВЕРХНЯ ШАПКА (NAVBAR) --- */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10 flex-shrink-0">
          
          {/* Ліва частина: Бургер + Заголовок */}
          <div className="flex items-center gap-4">
            <button 
              className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
              onClick={toggleSidebar}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-semibold text-gray-700 hidden sm:block">
              Панель керування
            </h2>
          </div>

          {/* 👇 ЗМІНА 2: Ми видалили весь блок "Права частина: Пошук + Сповіщення" */}
          {/* Якщо захочеш повернути, просто встав код назад сюди */}
          
        </header>

        {/* --- КОНТЕНТ СТОРІНОК --- */}
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
};

export default RootLayout;