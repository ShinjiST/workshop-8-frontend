//она не нужна в дальше и тут она не используется 
import { Link } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useParkingSpace } from '../api';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Info, ArrowLeft } from 'lucide-react'; // Імпорт іконок

export const ParkingSpaceInfoPage = () => {
  const parts = typeof window !== 'undefined' ? window.location.pathname.split('/').filter(Boolean) : [];
  const last = parts[parts.length - 1];

  const isGenericInfo = last === 'info';
  const idCandidate = Number(last);
  const id = !isGenericInfo && Number.isFinite(idCandidate) && !Number.isNaN(idCandidate) ? idCandidate : undefined;
  
  const { data: space, isLoading, isError } = useParkingSpace(id ?? -1);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { 
    const t = setTimeout(() => { setMounted(true); }, 10); 
    return () => { clearTimeout(t); }; 
  }, []);

  // --- 1. ЗАГАЛЬНА ІНФО СТОРІНКА ---
  if (isGenericInfo) {
    return (
      <div className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-10 max-w-lg text-center flex flex-col items-center">
            
            {/* ІКОНКА ЗАМІСТЬ СМАЙЛИКА */}
            <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-6">
               <Info className="w-8 h-8" />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Інформаційна панель
            </h2>
            <p className="text-gray-500 mb-8 leading-relaxed">
              Виберіть конкретне паркомісце зі списку, щоб побачити детальну інформацію та статус, або скористайтеся меню навігації.
            </p>
            
            <Link
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition font-medium shadow-sm hover:shadow-md"
              to="/parkingspaces"
            >
              <ArrowLeft className="w-4 h-4" />
              Перейти до списку
            </Link>
        </div>
      </div>
    );
  }

  // --- 2. ЗАВАНТАЖЕННЯ / ПОМИЛКА ---
  if (isLoading) return <div className="h-full flex items-center justify-center text-gray-400">Завантаження даних...</div>;
  
  if (isError || !space) return (
      <div className="h-full flex flex-col items-center justify-center p-6">
        <div className="text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
               <Info className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Місце не знайдено</h3>
            <p className="text-gray-500 mb-6">Можливо, воно було видалене або посилання невірне.</p>
            <Link className="text-blue-600 font-medium hover:underline" to="/parkingspaces">
               Повернутися назад
            </Link>
        </div>
      </div>
  );

  // --- 3. КАРТКА ІНФОРМАЦІЇ ---
 return (
  <div
        // МЫ ЗАМЕНИЛИ "bg-gray-50 min-h-screen" НА "h-full w-full flex flex-col items-center justify-center"
        className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
          mounted ? 'opacity-100' : 'opacity-0'
        }`}
      >
      <div className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md">
        
        {/* Заголовок картки */}
        <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              Місце №{space.ps_number}
            </h2>
            <span className="text-xs font-mono text-gray-500 bg-gray-100 px-2 py-1 rounded-md border border-gray-200">
                ID: {space.ps_id}
            </span>
        </div>

        {/* Список даних */}
        <div className="space-y-4">
           <div className="flex justify-between items-center py-2 border-b border-gray-50">
             <span className="text-gray-500 font-medium text-sm">Рівень</span>
             <span className="text-gray-900 font-bold">{space.ps_level}</span>
           </div>

           <div className="flex justify-between items-center py-2 border-b border-gray-50">
             <span className="text-gray-500 font-medium text-sm">Статус</span>
             <StatusBadge status={space.ps_status} />
           </div>

           <div className="flex justify-between items-center py-2 border-b border-gray-50">
             <span className="text-gray-500 font-medium text-sm">Тип авто</span>
             <span className="text-gray-900 font-medium">{space.ps_auto_type}</span>
           </div>

           <div className="flex justify-between items-center py-2 border-b border-gray-50">
             <span className="text-gray-500 font-medium text-sm">Зона</span>
             {space.parkingZone ? (
                 <span className="text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded text-sm">
                    {space.parkingZone.pz_name}
                 </span>
             ) : (
                 <span className="text-gray-400 italic text-sm">Не вказана</span>
             )}
           </div>
        </div>

        {/* Кнопка назад */}
        <div className="mt-8 pt-2">
            <Link
              className="w-full flex items-center justify-center gap-2 text-gray-500 hover:text-gray-800 transition text-sm font-medium py-2 hover:bg-gray-50 rounded-lg"
              to="/parkingspaces"
            >
              <ArrowLeft className="w-4 h-4" />
              Назад до списку
            </Link>
        </div>
      </div>
    </div>
  );
};