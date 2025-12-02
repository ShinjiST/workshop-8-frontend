import { useState } from "react"; 
import { Link } from "@tanstack/react-router";
import { useClient, useDeleteClient } from "../api"; 
import { Route } from "@/routes/clients/show/$c_id"; 
import { 
    ArrowLeft, 
    User, 
    Hash, 
    Mail, 
    Phone, 
    Edit, 
    Trash2,
    FileText, // Іконка для договорів
    Car,      // Іконка для авто в списку договорів
    Calendar  // Іконка для дати
} from "lucide-react"; 

export const ClientShowPage = () => {
    const { c_id } = Route.useParams();
    const id = Number(c_id);
    const { data: client, isLoading, isError, error } = useClient(id);
    const deleteMutation = useDeleteClient(); 
    
    const [showAgreements, setShowAgreements] = useState(true); 

    if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
    if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
    if (!client) return <div className="p-6">Клієнта не знайдено</div>;

    const agreementsCount = client.agreements?.length ?? 0;

    const handleDelete = () => {
        if (window.confirm(`Ви впевнені, що хочете видалити клієнта ${client.c_full_name} (ID: ${client.c_id})?`)) {
            deleteMutation.mutate(client.c_id, {
                onSuccess: () => {
                    alert("Клієнта успішно видалено!");
                    window.location.href = '/clients'; 
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
                        to="/clients"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Інформація про клієнта: {client.c_full_name}
                        </h1>
                        <p className="text-sm text-gray-500">ID: #{client.c_id}</p>
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
                        params={{ c_id: String(client.c_id) }}
                        to="/clients/edit/$c_id"
                    >
                        <Edit className="w-4 h-4" />
                        <span>Редагувати</span>
                    </Link>
                </div>
            </div>

            {/* --- СІТКА --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* ЛІВИЙ БЛОК (Контактні дані) */}
                <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Контактні дані
                        </h3>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12">
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Повне ім'я</span>
                            <p className="mt-1 text-lg font-medium text-gray-900">{client.c_full_name}</p>
                        </div>
                        
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Системний ID</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Hash className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{client.c_id}</p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">E-mail</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Mail className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-blue-600 truncate">{client.c_email}</p>
                            </div>
                        </div>

                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Основний телефон</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{client.c_phone_number}</p>
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Додатковий телефон</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Phone className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{client.c_backup_phone_number}</p>
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
                                    {client.agreements?.map((agreement) => (
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
                                            
                                            {/* Автомобіль у договорі */}
                                            <div className="flex items-center gap-2 text-xs text-gray-600 mt-2">
                                                <Car className="w-3 h-3 text-gray-400" />
                                                <span>
                                                    {agreement.auto 
                                                        ? `${agreement.auto.at_brand} ${agreement.auto.at_model} (${agreement.auto.at_license_plate})` 
                                                        : `Авто ID: ${agreement.at_id}`
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
                                    <p className="text-gray-500 italic text-sm">Немає активних договорів</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};