import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useRate } from "../api"; 
import { Route } from "@/routes/rates/show/$r_id";
import { 
    ArrowLeft, 
    Car, 
    Hash, 
    Edit, 
    DollarSign, 
    Calendar,
    FileText,
    ParkingCircle,
    User // Додали іконку користувача
} from "lucide-react"; 

export const RateShowPage = () => {
    const { r_id } = Route.useParams(); 
    const id = Number(r_id);
    const { data: rate, isLoading, isError, error } = useRate(id); 
    
    const [showAgreements, setShowAgreements] = useState(true);

    if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
    if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
    if (!rate) return <div className="p-6">Тариф не знайдено</div>;

    const agreementsCount = rate.agreements?.length ?? 0;

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            
            {/* --- ЗАГОЛОВОК --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
                        to="/rates"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Інформація про тариф: #{rate.r_id}
                        </h1>
                        <p className="text-sm text-gray-500">Дата: {new Date(rate.r_date).toLocaleDateString()}</p>
                    </div>
                </div>
                
                <Link 
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                    params={{ r_id: String(rate.r_id) }}
                    to="/rates/edit/$r_id"
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
                            <DollarSign className="w-4 h-4 text-blue-500" />
                            Основні параметри тарифу
                        </h3>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        {/* Ціна */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Ціна за добу</span>
                            <p className="mt-1 text-lg font-medium text-green-700">₴ {rate.r_price_per_day} UAH</p>
                        </div>
                        
                        {/* Дата */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата активації</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{new Date(rate.r_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Тип авто */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тип авто</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Car className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{rate.r_auto_type}</p>
                            </div>
                        </div>

                        {/* Тип паркомісця */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тип паркомісця</span>
                            <div className="flex items-center gap-2 mt-1">
                                <ParkingCircle className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{rate.r_parking_space_type}</p>
                            </div>
                        </div>

                        {/* ID */}
                        <div className="md:col-span-2 pt-4 border-t border-gray-100">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">#{rate.r_id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ПРАВИЙ БЛОК (Договори) */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Зв'язані договори ({agreementsCount})
                        </h3>
                        <button 
                            className="text-xs text-blue-600 hover:underline"
                            onClick={() => { setShowAgreements(!showAgreements); }}
                        >
                            {showAgreements ? "Згорнути" : "Розгорнути"}
                        </button>
                    </div>
                    
                    {showAgreements && (
                        <div className="max-h-[400px] overflow-y-auto">
                            {agreementsCount > 0 ? (
                                <ul className="divide-y divide-gray-100">
                                    {rate.agreements?.map((agreement) => (
                                        <li key={agreement.ag_id} className="p-4 hover:bg-gray-50 transition">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link 
                                                    className="font-medium text-blue-600 hover:underline text-sm" 
                                                    params={{ ag_id: String(agreement.ag_id) }}
                                                    to="/agreements/show/$ag_id"
                                                >
                                                    Договір #{agreement.ag_id}
                                                </Link>
                                                {/* Якщо є StatusBadge - використовуємо, інакше просто текст */}
                                                <span className={`px-2 py-0.5 rounded text-xs ${agreement.a_status === 'активний' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {agreement.a_status}
                                                </span>
                                            </div>
                                            
                                            <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                                                <User className="w-3 h-3" />
                                                <span>Клієнт ID: {agreement.c_id}</span>
                                            </div>
                                            
                                            <div className="flex justify-between items-center mt-2 text-xs">
                                                <span className="text-gray-400">{new Date(agreement.ag_date).toLocaleDateString()}</span>
                                                <span className="font-semibold text-green-700">₴ {agreement.a_total}</span>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <div className="p-6 text-center">
                                    <p className="text-gray-500 italic text-sm">Немає пов'язаних договорів</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};