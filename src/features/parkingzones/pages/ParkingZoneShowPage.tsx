import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useParkingZone } from "@/features/parkingzones/api";
import type { ParkingSpace } from "@/features/parkingspaces/types";
import { Route } from "@/routes/parkingzones/show/$pz_id";
import { ArrowLeft, MapPin, Hash, Edit, Car, Layers } from "lucide-react"; 

// ==========================================
// UTILITY: Статусний бейдж (якщо немає StatusBadge компонента)
// ==========================================
const SpaceStatusBadge = ({ status }: { status?: string }) => {
    const statusLower = status?.toLowerCase();
    let style = "bg-gray-100 text-gray-600 border-gray-300";
    let dotStyle = "bg-gray-600";

    if (statusLower === "вільне") {
        style = "bg-green-100 text-green-700 border-green-300";
        dotStyle = "bg-green-700";
    } else if (statusLower === "зайняте") {
        style = "bg-red-100 text-red-700 border-red-300";
        dotStyle = "bg-red-700";
    } else if (statusLower === "зарезервоване") {
        style = "bg-yellow-100 text-yellow-700 border-yellow-300";
        dotStyle = "bg-yellow-700";
    }

    return (
        <span
            className={`inline-flex items-center px-4 py-1 rounded-full border text-sm font-medium shadow-sm w-[130px] justify-center ${style}`}
        >
            <span className={`inline-block w-3 h-3 rounded-full mr-2 ${dotStyle}`}></span>
            {status}
        </span>
    );
};


// ==========================================
// COMPONENT
// ==========================================
export const ParkingZoneShowPage = () => {
  const { pz_id } = Route.useParams();
  const id = Number(pz_id);
  const { data: zone, isLoading, isError, error } = useParkingZone(id);
  
  const [showSpaces, setShowSpaces] = useState(true); 

  // --- Стан завантаження та помилки ---
  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!zone) return <div className="p-6">Зона не знайдена</div>;

  const totalSpaces = zone.parkingSpaces?.length ?? 0;
  const sortedSpaces = [...(zone.parkingSpaces || [])].sort((a, b) =>
    a.ps_number.localeCompare(b.ps_number, "uk", { numeric: true })
  );

  return (
    // 👇 Змінив клас: прибрав зовнішній p-6, який створював зайвий відступ
    // Тепер він відповідає стилю ParkingSpaceShowPage
    <div className="w-full max-w-7xl mx-auto space-y-6"> 
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/parkingzones"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Інформація про паркінг-зону: {zone.pz_name}
            </h1>
            <p className="text-sm text-gray-500">ID: #{zone.pz_id}</p>
          </div>
        </div>
        
        {/* Кнопка Редагувати */}
        <Link 
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
            params={{ pz_id: String(zone.pz_id) }}
            to="/parkingzones/edit/$pz_id"
        >
            <Edit className="w-4 h-4" />
            <span>Редагувати</span>
        </Link>
      </div>

      {/* --- СІТКА --- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        
        {/* ЛІВИЙ БЛОК (Основні дані зони) */}
        <div className="lg:col-span-1 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" />
              Основні дані зони
            </h3>
          </div>
          
          <div className="p-6 space-y-5">
              <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Назва зони</span>
                  <p className="mt-1 text-lg font-medium text-gray-900">{zone.pz_name}</p>
              </div>
              
              <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Місткість</span>
                  <div className="flex items-center gap-2 mt-1">
                      <Car className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">{zone.pz_capacity} місць</p>
                  </div>
              </div>

              <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Фактична кількість місць</span>
                  <div className="flex items-center gap-2 mt-1">
                      <Layers className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">{totalSpaces}</p>
                  </div>
              </div>

              <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                  <div className="flex items-center gap-2 mt-1">
                      <Hash className="w-4 h-4 text-gray-400" />
                      <p className="text-lg font-medium text-gray-900">{zone.pz_id}</p>
                  </div>
              </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Список паркомісць) - використовуємо більшу частину сітки */}
        <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-500" />
              Список паркомісць ({totalSpaces})
            </h3>
            <button 
                className="text-xs text-blue-600 hover:underline"
                onClick={() => { setShowSpaces(!showSpaces); }}
            >
                {showSpaces ? "Згорнути" : "Розгорнути"}
            </button>
          </div>

          {/* Таблиця */}
          {showSpaces && (
            <div 
                // Прибрав p-6 звідси, залишивши його лише для вмісту
                className={`transition-all duration-500 ease-in-out ${
                    showSpaces ? "opacity-100 max-h-[800px]" : "opacity-0 max-h-0 overflow-hidden"
                }`}
            >
              {sortedSpaces.length > 0 ? (
                <div className="overflow-x-auto mt-4 p-6 pt-0">
                  <table className="min-w-full bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-5 py-3 text-left text-gray-700 font-semibold">Номер</th>
                        <th className="px-5 py-3 text-left text-gray-700 font-semibold">Поверх</th>
                        <th className="px-5 py-3 text-left text-gray-700 font-semibold">Тип авто</th>
                        <th className="px-5 py-3 text-left text-gray-700 font-semibold">Статус</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sortedSpaces.map((space: ParkingSpace) => (
                        <tr
                          key={space.ps_id}
                          className="border-b hover:bg-gray-500/5 transition"
                        >
                          <td className="px-5 py-3 text-sm font-medium">
                            <Link 
                                className="text-blue-600 hover:text-blue-800 transition"
                                params={{ ps_id: String(space.ps_id) }}
                                to="/parkingspaces/show/$ps_id"
                            >
                                {space.ps_number}
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-sm">{space.ps_level}</td>
                          <td className="px-5 py-3 text-sm">{space.ps_auto_type}</td>
                          <td className="px-5 py-3 text-left">
                            <SpaceStatusBadge status={space.ps_status} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 mt-4 p-6">Немає паркомісць у цій зоні.</p>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};