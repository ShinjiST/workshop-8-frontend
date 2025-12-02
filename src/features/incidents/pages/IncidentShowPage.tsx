import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useIncident } from "@/features/incidents/api";
import { Route } from "@/routes/incidents/show/$inc_id";
import { ArrowLeft, Edit, AlertTriangle, FileText, User, MapPin } from "lucide-react";
// 👇 Імпортуємо наш компонент бейджа
import { StatusBadge } from "@/components/ui/StatusBadge";

export const IncidentShowPage = () => {
  // Отримуємо ID з URL
  const { inc_id } = Route.useParams();
  const id = Number(inc_id);

  // Завантажуємо дані
  const { data: incident, isLoading, isError, error } = useIncident(id);

  const [showRelations, setShowRelations] = useState(true);

  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!incident) return <div className="p-6">Інцидент не знайдено</div>;

  const employee = incident.employee;
  const parkingSpace = incident.parkingSpace;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/incidents"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Інцидент #{incident.inc_id}
            </h1>
            <p className="text-sm text-gray-500">
                {incident.inc_type} • {new Date(incident.inc_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <Link 
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
           params={{ inc_id: String(incident.inc_id) }}
           to="/incidents/edit/$inc_id"
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
              <AlertTriangle className="w-4 h-4 text-red-500" />
              Деталі інциденту
            </h3>
            {/* 👇 ЗАМІНЕНО: Використовуємо універсальний StatusBadge */}
            <StatusBadge status={incident.inc_status} />
          </div>
          
          <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                     <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тип</span>
                     <p className="mt-1 text-lg font-medium text-gray-900">{incident.inc_type}</p>
                  </div>
                  
                  <div>
                     <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата та час</span>
                     <p className="mt-1 text-lg font-medium text-gray-900">
                         {new Date(incident.inc_date).toLocaleString()}
                     </p>
                  </div>
              </div>

              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Опис</span>
                 <p className="mt-2 text-gray-700 bg-gray-50 p-4 rounded-lg border border-gray-100 leading-relaxed">
                     {incident.inc_description}
                 </p>
              </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Зв'язки: Співробітник + Місце) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-orange-500" />
              Пов'язані об'єкти
            </h3>
            <button 
               className="text-xs text-blue-600 hover:underline"
               onClick={() => { setShowRelations(!showRelations); }}
            >
               {showRelations ? "Згорнути" : "Розгорнути"}
            </button>
          </div>

          {showRelations && (
            <div className="p-6 space-y-6">
               
               {/* Співробітник */}
               <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Оформив співробітник</span>
                  {employee ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="p-2 bg-white rounded-full border border-gray-200 text-gray-500">
                              <User className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">{employee.e_full_name}</p>
                              <Link 
                                 className="text-xs text-blue-600 hover:underline" 
                                 params={{ e_id: String(employee.e_id) }}
                                 to="/employees/show/$e_id"
                              >
                                 Перейти до профілю
                              </Link>
                          </div>
                      </div>
                  ) : (
                      <p className="text-gray-500 italic text-sm">Не вказано (ID: {incident.e_id})</p>
                  )}
               </div>

               <div className="w-full h-px bg-gray-100"></div>

               {/* Паркомісце */}
               <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Місце події</span>
                  {parkingSpace ? (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                          <div className="p-2 bg-white rounded-full border border-gray-200 text-gray-500">
                              <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">
                                  Місце №{parkingSpace.ps_number}
                              </p>
                              <p className="text-xs text-gray-500">
                                  {parkingSpace.ps_auto_type} • Зона {parkingSpace.pz_id}
                              </p>
                              <Link 
                                 className="text-xs text-blue-600 hover:underline block mt-1" 
                                 params={{ ps_id: String(parkingSpace.ps_id) }}
                                 to="/parkingspaces/show/$ps_id"
                              >
                                 Перейти до місця
                              </Link>
                          </div>
                      </div>
                  ) : (
                      <p className="text-gray-500 italic text-sm">Не вказано (ID: {incident.ps_id})</p>
                  )}
               </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};