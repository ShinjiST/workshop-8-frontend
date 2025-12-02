import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useAuto, useDeleteAuto } from "../api"; 
import { Route } from "@/routes/autos/show/$at_id";
import { 
    ArrowLeft, 
    Car, 
    Tag, 
    Palette, 
    Shield, 
    Hash, 
    Edit, 
    Trash2,
    FileText, // Іконка для договорів
    User,     // Іконка для клієнта
    Calendar  // Іконка для дати
} from "lucide-react"; 

export const AutoShowPage = () => {
    const { at_id } = Route.useParams(); 
    const id = Number(at_id);
    const { data: auto, isLoading, isError, error } = useAuto(id); 
    const deleteMutation = useDeleteAuto(); 
    
    const [showAgreements, setShowAgreements] = useState(true);

    if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
    if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
    if (!auto) return <div className="p-6">Автомобіль не знайдено</div>;

    const agreementsCount = auto.agreements?.length ?? 0;

    const handleDelete = () => {
        if (window.confirm(`Ви впевнені, що хочете видалити автомобіль ${auto.at_license_plate} (ID: ${auto.at_id})?`)) {
            deleteMutation.mutate(auto.at_id, {
                onSuccess: () => {
                    alert("Автомобіль успішно видалено!");
                    window.location.href = '/autos'; 
                },
                onError: (error_: any) => {
                    alert(`Помилка видалення: ${error_.message || 'Невідома помилка'}`);
                }
            });
        }
    };

    return (
        <div className="w-full max-w-7xl mx-auto space-y-6">
            
            {/* --- ЗАГОЛОВОК --- */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link
                        className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm"
                        to="/autos"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Інформація про авто: {auto.at_license_plate}
                        </h1>
                        <p className="text-sm text-gray-500">ID: #{auto.at_id}</p>
                    </div>
                </div>
                
                {/* Кнопки Дій */}
                <div className="flex gap-3">
                    <button
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition shadow-sm disabled:opacity-50"
                        disabled={deleteMutation.isPending}
                        onClick={handleDelete}
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>{deleteMutation.isPending ? "Видалення..." : "Видалити"}</span>
                    </button>

                    <Link 
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm"
                        params={{ at_id: String(auto.at_id) }}
                        to="/autos/edit/$at_id"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Редагувати</span>
                    </Link>
                </div>
            </div>

            {/* --- СІТКА --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* ЛІВИЙ БЛОК (Основні дані Авто) */}
                <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <Car className="w-4 h-4 text-blue-500" />
                            Основні дані
                        </h3>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        {/* Номерний знак */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Номерний знак</span>
                            <p className="mt-1 text-lg font-medium text-gray-900">{auto.at_license_plate}</p>
                        </div>
                        
                        {/* Бренд */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Бренд</span>
                            <p className="mt-1 text-lg font-medium text-gray-900">{auto.at_brand}</p>
                        </div>

                        {/* Модель */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Модель</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Tag className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{auto.at_model}</p>
                            </div>
                        </div>

                        {/* Колір */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Колір</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Palette className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{auto.at_color}</p>
                            </div>
                        </div>
                        
                        {/* Тип */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Тип ТЗ</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Shield className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{auto.at_type}</p>
                            </div>
                        </div>

                        {/* Системний ID */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">#{auto.at_id}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ПРАВИЙ БЛОК (Договори) */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Договори ({agreementsCount})
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
                                    {auto.agreements?.map((agreement) => (
                                        <li key={agreement.ag_id} className="p-4 hover:bg-gray-50 transition">
                                            <div className="flex justify-between items-start mb-1">
                                                <Link 
                                                    className="font-medium text-blue-600 hover:underline text-sm" 
                                                    params={{ ag_id: String(agreement.ag_id) }}
                                                    to="/agreements/show/$ag_id"
                                                >
                                                    Договір #{agreement.ag_id}
                                                </Link>
                                                <span className={`px-2 py-0.5 rounded text-xs ${agreement.a_status === 'активний' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                                    {agreement.a_status}
                                                </span>
                                            </div>
                                            
                                            {/* Клієнт у договорі */}
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                                                <User className="w-3 h-3 text-gray-400" />
                                                <span>
                                                    {agreement.client 
                                                        ? agreement.client.c_full_name 
                                                        : `Клієнт ID: ${agreement.c_id}`
                                                    }
                                                </span>
                                            </div>

                                            {/* Дата та сума */}
                                            <div className="flex justify-between items-center mt-2 text-xs">
                                                <div className="flex items-center gap-1 text-gray-400">
                                                    <Calendar className="w-3 h-3" />
                                                    <span>{new Date(agreement.ag_date).toLocaleDateString()}</span>
                                                </div>
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