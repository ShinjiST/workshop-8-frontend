import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useParkingSpace } from "@/features/parkingspaces/api";
import { Route } from "@/routes/parkingspaces/show/$ps_id";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLeft, Car, MapPin, Layers, Hash, Edit } from "lucide-react";

export const ParkingSpaceShowPage = () => {
  const { ps_id } = Route.useParams();
  const id = Number(ps_id);
  const { data: space, isLoading, isError, error } = useParkingSpace(id);
  
  const [showZone, setShowZone] = useState(true);

  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!space) return <div className="p-6">Паркомісце не знайдено</div>;

  const zone = space.parkingZone;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/parkingspaces"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Інформація про паркомісце №{space.ps_number}
            </h1>
            <p className="text-sm text-gray-500">ID: #{space.ps_id}</p>
          </div>
        </div>
        
        <Link 
             className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
             params={{ ps_id: String(space.ps_id) }}
             to="/parkingspaces/edit/$ps_id"
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
              <Car className="w-4 h-4 text-blue-500" />
              Основні дані
            </h3>
            <StatusBadge status={space.ps_status} />
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Номер місця</span>
                <p className="mt-1 text-lg font-medium text-gray-900">{space.ps_number}</p>
             </div>
             
             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тип авто</span>
                <p className="mt-1 text-lg font-medium text-gray-900">{space.ps_auto_type}</p>
             </div>

             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Поверх</span>
                <div className="flex items-center gap-2 mt-1">
                   <Layers className="w-4 h-4 text-gray-400" />
                   <p className="text-lg font-medium text-gray-900">{space.ps_level}</p>
                </div>
             </div>

             <div>
                <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                <div className="flex items-center gap-2 mt-1">
                   <Hash className="w-4 h-4 text-gray-400" />
                   <p className="text-lg font-medium text-gray-900">{space.ps_id}</p>
                </div>
             </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Зона) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-500" />
              Інформація про зону
            </h3>
            <button 
               className="text-xs text-blue-600 hover:underline"
               onClick={() => { setShowZone(!showZone); }}
            >
               {showZone ? "Згорнути" : "Розгорнути"}
            </button>
          </div>

          {showZone && (
            <div className="p-6">
              {zone ? (
                <div className="space-y-4">
                  {/* --- ДОДАЛИ ID ЗОНИ ТУТ --- */}
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">ID Зони</span>
                    <p className="text-base font-medium text-gray-900">#{zone.pz_id}</p>
                  </div>

                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Назва зони</span>
                    <p className="text-base font-medium text-gray-900">{zone.pz_name}</p>
                  </div>
                  
                  <div>
                    <span className="text-xs font-semibold text-gray-400 uppercase">Місткість</span>
                    <p className="text-base font-medium text-gray-900">{zone.pz_capacity} місць</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                   <Link
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1 transition"
                      params={{ pz_id: String(zone.pz_id) }}
                      to="/parkingzones/show/$pz_id"
                    >
                      Перейти до налаштувань зони →
                    </Link>
                  </div>
                </div>
              ) : (
                <p className="text-gray-500 italic text-sm">Зона не прив'язана</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};