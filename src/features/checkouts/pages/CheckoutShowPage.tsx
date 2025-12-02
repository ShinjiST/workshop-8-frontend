import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useCheckout } from "@/features/checkouts/api";
import { Route } from "@/routes/checkouts/show/$ch_id";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { ArrowLeft, Edit, LogOut, FileText, User, Clock, Hash, Banknote } from "lucide-react";

export const CheckoutShowPage = () => {
  const { ch_id } = Route.useParams();
  const id = Number(ch_id);

  // Завантажуємо дані
  const { data: checkout, isLoading, isError, error } = useCheckout(id);

  const [showRelations, setShowRelations] = useState(true);

  if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
  if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
  if (!checkout) return <div className="p-6">Запис виїзду не знайдено</div>;

  const { agreement, employee } = checkout;

  return (
    <div className="w-full max-w-7xl mx-auto space-y-6">
      
      {/* --- ЗАГОЛОВОК --- */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
            to="/checkouts"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              Виїзд (Чек) №{checkout.ch_id}
            </h1>
            <p className="text-sm text-gray-500">
                від {new Date(checkout.ch_time).toLocaleDateString()}
            </p>
          </div>
        </div>
        
        <Link 
           className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" 
           params={{ ch_id: String(checkout.ch_id) }}
           to="/checkouts/edit/$ch_id"
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
              <LogOut className="w-4 h-4 text-blue-500" />
              Деталі транзакції
            </h3>
            <StatusBadge status={checkout.ch_status} />
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
              
              {/* Сума */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Сплачена сума</span>
                 <div className="flex items-center gap-2 mt-1">
                    <Banknote className="w-5 h-5 text-green-600" />
                    <p className="text-2xl font-bold text-green-700">
                        ₴ {checkout.ch_amount}
                    </p>
                 </div>
              </div>

              {/* Час виїзду */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Час виїзду</span>
                 <div className="flex items-center gap-2 mt-1">
                    <Clock className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">
                        {new Date(checkout.ch_time).toLocaleString([], { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })}
                    </p>
                 </div>
              </div>

              {/* ID Договору (якщо немає details, показуємо тут) */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Договору</span>
                 <p className="mt-1 text-lg font-medium text-gray-900">
                    #{checkout.ag_id}
                 </p>
              </div>

              {/* Системний ID */}
              <div>
                 <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">ID Чека</span>
                 <div className="flex items-center gap-2 mt-1">
                    <Hash className="w-4 h-4 text-gray-400" />
                    <p className="text-lg font-medium text-gray-900">{checkout.ch_id}</p>
                 </div>
              </div>
          </div>
        </div>

        {/* ПРАВИЙ БЛОК (Зв'язки) */}
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
               
               {/* Договір */}
               <div>
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-2 block">Закритий договір</span>
                  {agreement ? (
                      <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
                          <div className="p-2 bg-white rounded-full text-blue-600">
                              <FileText className="w-4 h-4" />
                          </div>
                          <div>
                              <p className="text-sm font-bold text-gray-900">Договір №{agreement.ag_id}</p>
                              <p className="text-xs text-gray-500">
                                Сума: {agreement.a_total} грн
                              </p>
                              <Link 
                                 className="text-xs text-blue-700 hover:underline block mt-1 font-medium" 
                                 params={{ ag_id: String(agreement.ag_id) }}
                                 to="/agreements/show/$ag_id"
                              >
                                 Переглянути договір →
                              </Link>
                          </div>
                      </div>
                  ) : <span className="text-sm text-gray-400">Інформація недоступна (ID: {checkout.ag_id})</span>}
               </div>

               <div className="w-full h-px bg-gray-100"></div>

               {/* Співробітник */}
               <div className="bg-gray-50 p-3 rounded-lg border border-gray-100">
                  <span className="text-xs font-semibold text-gray-400 uppercase mb-1 block">Оформив співробітник</span>
                  {employee ? (
                      <Link 
                         className="text-sm font-medium text-gray-700 hover:text-blue-600 flex items-center gap-2" 
                         params={{ e_id: String(employee.e_id) }}
                         to="/employees/show/$e_id"
                      >
                         <div className="w-6 h-6 rounded-full bg-white border border-gray-200 flex items-center justify-center text-xs text-gray-500">
                            <User className="w-3 h-3" />
                         </div>
                         {employee.e_full_name}
                      </Link>
                  ) : <span className="text-sm text-gray-400">ID: {checkout.e_id}</span>}
               </div>

            </div>
          )}
        </div>

      </div>
    </div>
  );
};