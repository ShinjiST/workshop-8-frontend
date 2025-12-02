// src/features/employees/pages/EmployeeShowPage.tsx
import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { useEmployee, useDeleteEmployee } from "../api";
import { useShifts } from "../../shifts/api"; 

import { Route } from "@/routes/employees/show/$e_id"; 
import { 
    ArrowLeft, 
    User, 
    Mail, 
    Phone, 
    Edit, 
    Trash2,
    Calendar, 
    Briefcase, 
    Activity, 
    FileText, 
    Clock, 
    // 👇 Нові іконки для нових блоків
    LogOut,        // Checkout
    AlertOctagon,  // Incident
    Wrench,        // Maintenance
    Files          // Agreement
} from "lucide-react"; 

export const EmployeeShowPage = () => {
    const { e_id } = Route.useParams(); 
    const id = Number(e_id);
    
    const { data: employee, isLoading, isError, error } = useEmployee(id); 
    const { data: allShifts } = useShifts();

    const deleteMutation = useDeleteEmployee(); 
    
    const [showRelations, setShowRelations] = useState(true);

    if (isLoading) return <div className="flex items-center justify-center h-full text-gray-400">Завантаження...</div>;
    if (isError) return <div className="p-6 text-red-600">Помилка: {error?.message}</div>;
    if (!employee) return <div className="p-6">Співробітника не знайдено</div>;

    // Розраховуємо кількість зв'язків
    const relationsCount = 
        (employee.agreements?.length ?? 0) + 
        (employee.checkouts?.length ?? 0) + 
        (employee.incidents?.length ?? 0) + 
        (employee.maintenances?.length ?? 0) + 
        (employee.workSchedules?.length ?? 0);

    const handleDelete = () => {
        if (window.confirm(`Ви впевнені, що хочете видалити співробітника ${employee.e_full_name} (ID: ${employee.e_id})?`)) {
            deleteMutation.mutate(employee.e_id, {
                onSuccess: () => {
                    alert("Співробітника успішно видалено!");
                    window.location.href = '/employees'; 
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
                    <Link className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 transition shadow-sm" to="/employees">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">
                            Інформація про співробітника: {employee.e_full_name}
                        </h1>
                        <p className="text-sm text-gray-500">ID: #{employee.e_id}</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-600 text-sm font-medium rounded-lg hover:bg-red-200 transition shadow-sm disabled:opacity-50" disabled={deleteMutation.isPending} onClick={handleDelete}>
                        <Trash2 className="w-4 h-4" />
                        <span>{deleteMutation.isPending ? "Видалення..." : "Видалити"}</span>
                    </button>

                    <Link className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition shadow-sm" params={{ e_id: String(employee.e_id) }} to="/employees/edit/$e_id">
                        <Edit className="w-4 h-4" />
                        <span>Редагувати</span>
                    </Link>
                </div>
            </div>

            {/* --- СІТКА --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                
                {/* ЛІВИЙ БЛОК (Основні та контактні дані) */}
                <div className="lg:col-span-2 bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden">
                    {/* ... (Цей блок залишається без змін, як у попередньому коді) ... */}
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <User className="w-4 h-4 text-blue-500" />
                            Основні та контактні дані
                        </h3>
                    </div>
                    
                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-y-6 gap-x-12">
                        {/* Рядок 1: ПІБ та Посада */}
                        <div className="md:col-span-2">
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Повне ім'я</span>
                            <p className="mt-1 text-lg font-medium text-gray-900">{employee.e_full_name}</p>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Посада</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Briefcase className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{employee.e_position}</p>
                            </div>
                        </div>
                        
                        {/* Рядок 2: Зарплата та Статус */}
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Зарплата</span>
                            <div className="flex items-center gap-2 mt-1">
                                <p className="text-lg font-medium text-gray-900">₴ {employee.e_salary} UAH</p> 
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Статус</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Activity className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{employee.e_status}</p>
                            </div>
                        </div>
                        <div>
                            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Дата найму</span>
                            <div className="flex items-center gap-2 mt-1">
                                <Calendar className="w-4 h-4 text-gray-400" />
                                <p className="text-lg font-medium text-gray-900">{new Date(employee.e_hire_date).toLocaleDateString()}</p>
                            </div>
                        </div>

                        {/* Рядок 3: Контакти */}
                        <div className="md:col-span-3 pt-4 border-t border-gray-100">
                            <h4 className="text-base font-semibold text-gray-700 mb-3">Контакти</h4>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4">
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Email</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Mail className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-medium text-blue-600 truncate">{employee.e_email}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Основний телефон</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-900">{employee.e_phone_number}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Додатковий телефон</span>
                                    <div className="flex items-center gap-2 mt-1">
                                        <Phone className="w-4 h-4 text-gray-400" />
                                        <p className="text-sm font-medium text-gray-900">{employee.e_backup_phone_number}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ПРАВИЙ БЛОК (Всі Зв'язки) */}
                <div className="bg-white shadow-sm rounded-xl border border-gray-200 overflow-hidden h-fit">
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                        <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                            <FileText className="w-4 h-4 text-orange-500" />
                            Активність ({relationsCount})
                        </h3>
                        <button className="text-xs text-blue-600 hover:underline" onClick={() => { setShowRelations(!showRelations); }}>
                            {showRelations ? "Згорнути" : "Розгорнути"}
                        </button>
                    </div>
                    
                    {showRelations && (
                        <div className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
                            
                            {/* 1. ГРАФІК РОБОТИ */}
                            {employee.workSchedules && employee.workSchedules.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1 border-b pb-1">
                                        <Clock className="w-3 h-3" /> Графік роботи
                                    </h4>
                                    <div className="space-y-2">
                                        {employee.workSchedules.map((schedule: any) => {
                                            const shiftDetails = schedule.shift || allShifts?.find((s: any) => s.sh_id === schedule.sh_id);
                                            return (
                                                <Link key={schedule.ws_id} className="block p-2 bg-gray-50 rounded border border-gray-100 hover:border-blue-300 transition text-sm" params={{ ws_id: String(schedule.ws_id) }} to="/workschedules/show/$ws_id">
                                                    <div className="flex justify-between">
                                                        <span className="font-semibold text-gray-700">{schedule.ws_date}</span>
                                                        <span className="text-xs text-gray-500">
                                                            {shiftDetails ? `${shiftDetails.sh_name} (${shiftDetails.sh_start_time}-${shiftDetails.sh_end_time})` : '...'}
                                                        </span>
                                                    </div>
                                                </Link>
                                            );
                                        })}
                                    </div>
                                </div>
                            )}

                            {/* 2. ОФОРМЛЕНІ ДОГОВОРИ */}
                            {employee.agreements && employee.agreements.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1 border-b pb-1">
                                        <Files className="w-3 h-3" /> Оформлені договори
                                    </h4>
                                    <div className="space-y-2">
                                        {employee.agreements.map((agreement: any) => (
                                            <Link key={agreement.ag_id} className="block p-2 bg-blue-50 rounded border border-blue-100 hover:border-blue-300 transition text-sm" params={{ ag_id: String(agreement.ag_id) }} to="/agreements/show/$ag_id">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-blue-700">№{agreement.ag_id}</span>
                                                    <span className="text-xs text-blue-500">{new Date(agreement.ag_date).toLocaleDateString()}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 3. ЧЕК-АУТИ (ВИЇЗДИ) */}
                            {employee.checkouts && employee.checkouts.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1 border-b pb-1">
                                        <LogOut className="w-3 h-3" /> Оформлені виїзди
                                    </h4>
                                    <div className="space-y-2">
                                        {employee.checkouts.map((checkout: any) => (
                                            <Link key={checkout.ch_id} className="block p-2 bg-green-50 rounded border border-green-100 hover:border-green-300 transition text-sm" params={{ ch_id: String(checkout.ch_id) }} to="/checkouts/show/$ch_id">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-green-700">№{checkout.ch_id}</span>
                                                    <span className="text-xs text-green-600">₴ {checkout.ch_amount}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 4. ІНЦИДЕНТИ */}
                            {employee.incidents && employee.incidents.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1 border-b pb-1">
                                        <AlertOctagon className="w-3 h-3" /> Зафіксовані інциденти
                                    </h4>
                                    <div className="space-y-2">
                                        {employee.incidents.map((incident: any) => (
                                            <Link key={incident.inc_id} className="block p-2 bg-red-50 rounded border border-red-100 hover:border-red-300 transition text-sm" params={{ inc_id: String(incident.inc_id) }} to="/incidents/show/$inc_id">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-red-700">{incident.inc_type}</span>
                                                    <span className="text-xs text-red-500">{new Date(incident.inc_date).toLocaleDateString()}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* 5. ОБСЛУГОВУВАННЯ */}
                            {employee.maintenances && employee.maintenances.length > 0 && (
                                <div>
                                    <h4 className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-1 border-b pb-1">
                                        <Wrench className="w-3 h-3" /> Проведене обслуговування
                                    </h4>
                                    <div className="space-y-2">
                                        {employee.maintenances.map((m: any) => (
                                            <Link key={m.m_id} className="block p-2 bg-orange-50 rounded border border-orange-100 hover:border-orange-300 transition text-sm" params={{ m_id: String(m.m_id) }} to="/maintenances/show/$m_id">
                                                <div className="flex justify-between">
                                                    <span className="font-semibold text-orange-700">№{m.m_id}</span>
                                                    <span className="text-xs text-orange-600">₴ {m.m_cost}</span>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* ЯКЩО НІЧОГО НЕМАЄ */}
                            {relationsCount === 0 && (
                                <p className="text-gray-400 text-sm text-center py-4">Активності не знайдено</p>
                            )}

                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};