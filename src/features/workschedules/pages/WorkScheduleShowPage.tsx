// src/features/workschedules/pages/WorkScheduleShowPage.tsx

import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useWorkSchedule } from "@/features/workschedules/api";
import { Route } from "@/routes/workschedules/show/$ws_id";
import { ArrowLeft, Calendar, User, Clock, Hash, Edit, Briefcase } from "lucide-react";

export const WorkScheduleShowPage = () => {
  // 1. Отримуємо ID
  const { ws_id } = Route.useParams();
  const id = Number(ws_id);

  // 2. Завантажуємо дані
  const { data: schedule, isLoading, isError, error } = useWorkSchedule(id);

  // Стейт для згортання правого блоку
  const [showShift, setShowShift] = useState(true);

  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!schedule) return <div className="p-6">Запис не знайдено</div>;

  // Пов'язані сутності
  const shift = schedule.shift;
  const employee = schedule.employee;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/workschedules"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Графік на {schedule.ws_date}
            </h1>
            <p className="text-sm text-gray-500">ID: #{schedule.ws_id}</p>
          </div>
        </div>
        
        <Link 
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
           params={{ ws_id: String(schedule.ws_id) }}
           to="/workschedules/edit/$ws_id"
        >
           <Edit className="w-4 h-4" />
           <span>Редагувати</span>
        </Link>
      </div>

      {/* --- СІТКА --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ЛІВИЙ БЛОК (Основні дані + Працівник) */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-blue-500" />
              Деталі запису
            </h3>
            {/* Можна додати бейдж дати, якщо хочеться */}
            <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-medium border border-blue-100">
               {schedule.ws_date}
            </span>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
             
             {/* Дата */}
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата виходу</span>
                <p className="mt-1 text-lg font-medium text-gray-900">{schedule.ws_date}</p>
             </div>
             
             {/* Працівник */}
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Працівник</span>
                <div className="flex items-center gap-2 mt-1">
                   <User className="w-5 h-5 text-gray-500" />
                   <div>
                       <p className="text-lg font-medium text-gray-900">
                         {employee ? employee.e_full_name : `ID: ${schedule.e_id}`}
                       </p>
                       {employee && (
                         <p className="text-xs text-gray-500">{employee.e_position}</p>
                       )}
                   </div>
                </div>
             </div>

             {/* Системний ID */}
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                <div className="flex items-center gap-2 mt-1">
                   <Hash className="w-4 h-4 text-gray-400" />
                   <p className="text-lg font-medium text-gray-900">{schedule.ws_id}</p>
                </div>
             </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Інформація про зміну) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Briefcase className="w-4 h-4 text-orange-500" />
              Інформація про зміну
            </h3>
            <button 
               className="text-xs text-blue-600 hover:underline"
               onClick={() => { setShowShift(!showShift); }}
            >
               {showShift ? "Згорнути" : "Розгорнути"}
            </button>
          </div>

          {showShift && (
            <div className="p-6">
              {shift ? (
                <div className="space-y-4">
                   
                   <div>
                      <span className="text-xs font-semibold text-gray-400 uppercase">Назва зміни</span>
                      <p className="text-base font-medium text-gray-900">{shift.sh_name}</p>
                   </div>

                   <div className="flex items-center gap-4">
                       <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase">Початок</span>
                          <div className="flex items-center gap-1 mt-1 text-green-700 bg-green-50 px-2 py-1 rounded">
                             <Clock className="w-3 h-3" />
                             <span className="font-medium text-sm">{shift.sh_start_time}</span>
                          </div>
                       </div>
                       <div>
                          <span className="text-xs font-semibold text-gray-400 uppercase">Кінець</span>
                          <div className="flex items-center gap-1 mt-1 text-red-700 bg-red-50 px-2 py-1 rounded">
                             <Clock className="w-3 h-3" />
                             <span className="font-medium text-sm">{shift.sh_end_time}</span>
                          </div>
                       </div>
                   </div>

                   <div className="pt-4 border-t border-gray-100">
                     <Link 
                        className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
                        params={{ sh_id: String(shift.sh_id) }}
                        to="/shifts/show/$sh_id"
                     >
                        Перейти до зміни →
                     </Link>
                   </div>

                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">Інформація про зміну відсутня</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};