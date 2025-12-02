// src/features/shifts/pages/ShiftShowPage.tsx

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useShift } from "@/features/shifts/api";
import { Route } from "@/routes/shifts/show/$sh_id";
// Якщо у тебе є універсальний StatusBadge, використовуй його,
// або заміни на звичайний <span ...>
import { StatusBadge } from "@/components/ui/StatusBadge"; 
import { ArrowLeft, Clock, Briefcase, Hash, Edit } from "lucide-react";

export const ShiftShowPage = () => {
  // Отримуємо ID з роута
  const { sh_id } = Route.useParams();
  
  const id = Number(sh_id);
  
  // Завантажуємо дані
  const { data: shift, isLoading, isError, error } = useShift(id);
  
  // Стейт для правого блоку (якщо захочеш щось приховувати, наприклад розклад)
  const [showSchedule, setShowSchedule] = useState(true);

  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!shift) return <div className="p-6">Зміну не знайдено</div>;

  // 👇 ФУНКЦІЯ ПЕРЕКЛАДУ СТАТУСІВ
  const getStatusLabel = (status: string) => {
    const statusLabels: Record<string, string> = {
      active: "активна",
      inactive: "неактивна",
      archived: "архівна"
    };
    return statusLabels[status] || status;
  };

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/shifts"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Зміна: {shift.sh_name}
            </h1>
            <p className="text-sm text-gray-500">ID: #{shift.sh_id}</p>
          </div>
        </div>
        
        <Link 
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
           params={{ sh_id: String(shift.sh_id) }}
           to="/shifts/edit/$sh_id"
        >
           <Edit className="w-4 h-4" />
           <span>Редагувати</span>
        </Link>
      </div>

      {/* --- СІТКА --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ЛІВИЙ БЛОК (Основні дані) */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-blue-500" />
              Основні дані
            </h3>
            {/* 👇 Передаємо ПЕРЕКЛАДЕНИЙ статус у бейдж */}
            <StatusBadge status={getStatusLabel(shift.sh_status)} />
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Назва зміни</span>
                <p className="mt-1 text-lg font-medium text-gray-900">{shift.sh_name}</p>
             </div>
             
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</span>
                {/* 👇 Тут теж виводимо перекладений текст */}
                <p className="mt-1 text-lg font-medium text-gray-900">{getStatusLabel(shift.sh_status)}</p>
             </div>

             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                <div className="flex items-center gap-2 mt-1">
                   <Hash className="w-4 h-4 text-gray-400" />
                   <p className="text-lg font-medium text-gray-900">{shift.sh_id}</p>
                </div>
             </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Часовий розклад) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-500" />
              Часові рамки
            </h3>
            <button 
               className="text-xs text-blue-600 hover:underline"
               onClick={() => { setShowSchedule(!showSchedule); }}
            >
               {showSchedule ? "Згорнути" : "Розгорнути"}
            </button>
          </div>

          {showSchedule && (
            <div className="p-6 space-y-6">
               
               {/* Початок */}
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-green-50 rounded-lg text-green-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Початок роботи</span>
                    <p className="text-xl font-bold text-gray-900">{shift.sh_start_time}</p>
                  </div>
               </div>

               <div className="w-full h-px bg-gray-100"></div>

               {/* Кінець */}
               <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg text-red-600">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Кінець роботи</span>
                    <p className="text-xl font-bold text-gray-900">{shift.sh_end_time}</p>
                  </div>
               </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};