import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAgreement } from "@/features/agreements/api";
import { Route } from "@/routes/agreements/show/$ag_id";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLeft, Edit, FileText, User, Car, MapPin, CreditCard, Calendar, Clock, Hash } from "lucide-react";

export const AgreementShowPage = () => {
  const { ag_id } = Route.useParams();
  const id = Number(ag_id);

  // Завантажуємо дані
  const { data: agreement, isLoading, isError, error } = useAgreement(id);

  const [showRelations, setShowRelations] = useState(true);

  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!agreement) return <div className="p-6">Договір не знайдено</div>;

  const { client, auto, parkingSpace, employee, rate } = agreement;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/agreements"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Договір №{agreement.ag_id}
            </h1>
            <p className="text-sm text-gray-500">
                від {new Date(agreement.ag_date).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <Link 
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
           params={{ ag_id: String(agreement.ag_id) }}
           to="/agreements/edit/$ag_id"
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
              <FileText className="w-4 h-4 text-blue-500" />
              Умови договору
            </h3>
            <StatusBadge status={agreement.a_status} />
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              
              {/* Загальна сума */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Загальна сума</span>
                 <p className="mt-1 text-2xl font-bold text-green-700">₴ {agreement.a_total}</p>
              </div>

              {/* Тривалість */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тривалість</span>
                 <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">{agreement.ag_duration_days} днів</p>
                 </div>
              </div>

              {/* Дата початку */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата початку</span>
                 <div className="flex items-center gap-2 mt-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">
                        {new Date(agreement.ag_date).toLocaleDateString()}
                    </p>
                 </div>
              </div>

              {/* Тариф */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тариф</span>
                 <div className="flex items-center gap-2 mt-1">
                    <CreditCard className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">
                        {rate ? `₴ ${rate.r_price_per_day} / день` : `ID: ${agreement.r_id}`}
                    </p>
                 </div>
              </div>

              {/* Системний ID (на всю ширину на мобільних, або в сітці) */}
              <div className="md:col-span-2 pt-4 border-t border-gray-50">
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                 <div className="flex items-center gap-2 mt-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="text-sm text-gray-500">{agreement.ag_id}</p>
                 </div>
              </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Пов'язані об'єкти) */}
        <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-500" />
              Суб'єкти договору
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
               
               {/* Клієнт */}
               <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Клієнт</span>
                  {client ? (
                      <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                              <User className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">{client.c_full_name}</p>
                              <p className="text-xs text-gray-500">{client.c_phone}</p>
                              <Link 
                                 className="text-xs text-blue-600 hover:underline block mt-1" 
                                 params={{ c_id: String(client.c_id) }}
                                 to="/clients/show/$c_id"
                              >
                                 Профіль клієнта →
                              </Link>
                          </div>
                      </div>
                  ) : <span className="text-sm text-gray-400">Не знайдено (ID: {agreement.c_id})</span>}
               </div>

               <div className="w-full h-px bg-gray-100"></div>

               {/* Авто */}
               <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Автомобіль</span>
                  {auto ? (
                      <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                              <Car className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">{auto.at_brand} {auto.at_model}</p>
                              <p className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded w-fit mt-1">{auto.at_license_plate}</p>
                              <Link 
                                 className="text-xs text-blue-600 hover:underline block mt-1" 
                                 params={{ at_id: String(auto.at_id) }}
                                 to="/autos/show/$at_id"
                              >
                                 Деталі авто →
                              </Link>
                          </div>
                      </div>
                  ) : <span className="text-sm text-gray-400">Не знайдено (ID: {agreement.at_id})</span>}
               </div>

               <div className="w-full h-px bg-gray-100"></div>

               {/* Паркомісце */}
               <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Паркомісце</span>
                  {parkingSpace ? (
                      <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-50 rounded-lg text-orange-600">
                              <MapPin className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">Місце №{parkingSpace.ps_number}</p>
                              <p className="text-xs text-gray-500">Рівень {parkingSpace.ps_level}</p>
                              <Link 
                                 className="text-xs text-blue-600 hover:underline block mt-1" 
                                 params={{ ps_id: String(parkingSpace.ps_id) }}
                                 to="/parkingspaces/show/$ps_id"
                              >
                                 Перейти до місця →
                              </Link>
                          </div>
                      </div>
                  ) : <span className="text-sm text-gray-400">Не знайдено (ID: {agreement.ps_id})</span>}
               </div>

               <div className="w-full h-px bg-gray-100"></div>

               {/* Співробітник */}
               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-1 block">Оформив</span>
                  {employee ? (
                      <Link 
                         className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2" 
                         params={{ e_id: String(employee.e_id) }}
                         to="/employees/show/$e_id"
                      >
                         <div className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                            {employee.e_full_name[0]}
                         </div>
                         {employee.e_full_name}
                      </Link>
                  ) : <span className="text-sm text-gray-400">ID: {agreement.e_id}</span>}
               </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};