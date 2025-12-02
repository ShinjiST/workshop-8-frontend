import { Link, useNavigate } from "@tanstack/react-router";
// 👈 Хуки для Тарифу
import { useRates, useDeleteRate } from "../api"; 
import { useMemo, useState } from "react";
// 👈 Імпортуємо UniversalTable та Column
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
// import { StatusBadge } from "@/components/ui/StatusBadge"; // Не використовуємо
import { Trash2, Edit, Info, Calendar, Car, ParkingCircle } from "lucide-react";
import type { Rate } from "../types"; // Імпортуємо тип Rate

export const RatesPage = () => {
    const navigate = useNavigate();
    const { data: rates, isLoading } = useRates();
    const deleteMutation = useDeleteRate();

    // Стан пошуку та сортування
    const [query, setQuery] = useState("");
    // Сортування за замовчуванням: ID (r_id)
    const [sortBy, setSortBy] = useState<string | null>("r_id"); 
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // Опис колонок
    const columns: Array<Column<Rate>> = [
        { 
            header: "ID", 
            accessorKey: "r_id", 
            sortable: true, 
            render: (item) => <span className="text-gray-500">#{item.r_id}</span>,
            className: "text-gray-500"
        },
        { 
            header: "Тип авто", 
            accessorKey: "r_auto_type", 
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-gray-500" />
                    <span>{item.r_auto_type}</span>
                </div>
            )
        },
        { 
            header: "Тип паркомісця", 
            accessorKey: "r_parking_space_type", 
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <ParkingCircle className="w-4 h-4 text-indigo-500" />
                    <span>{item.r_parking_space_type}</span>
                </div>
            )
        },
        { 
            header: "Ціна за добу", 
            accessorKey: "r_price_per_day",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1 text-green-700 font-medium">
                    {/* 💡 ВИПРАВЛЕНО: Використовуємо символ гривні ₴ */}
                    <span>₴ {item.r_price_per_day}</span>
                </div>
            )
        },
        { 
            header: "Дата", 
            accessorKey: "r_date",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1 text-gray-600">
                    <Calendar className="w-4 h-4" />
                    <span>{item.r_date}</span>
                </div>
            )
        },
    ];

    // Логіка сортування і фільтрації
    const filteredData = useMemo(() => {
        if (!rates) return [];
        
        // 1. Фільтр: шукаємо по типу авто, типу паркомісця або ID
        const result = rates.filter(r => 
            (r.r_auto_type || "").toLowerCase().includes(query.toLowerCase()) ||
            (r.r_parking_space_type || "").toLowerCase().includes(query.toLowerCase()) ||
            String(r.r_id).includes(query)
        );

        // 2. Сортування (логіка сортування, як у прикладі ParkingSpaces)
        if (sortBy) {
            result.sort((a, b) => {
                const aValue = (a as any)[sortBy];
                const bValue = (b as any)[sortBy];
                
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
                }
                return sortDir === 'asc' 
                    ? String(aValue).localeCompare(String(bValue))
                    : String(bValue).localeCompare(String(aValue));
            });
        }
        return result;
    }, [rates, query, sortBy, sortDir]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    const handleDelete = (id: number) => {
        if (window.confirm(`Ви впевнені, що хочете видалити тариф #${id}? Це може вплинути на існуючі договори.`)) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    alert(`Тариф #${id} успішно видалений.`);
                },
                onError: (error: any) => {
                    alert(`Помилка видалення: ${error.message || 'Невідома помилка'}`);
                }
            });
        }
    };

    return (
        <div className="space-y-4">
            <UniversalTable
                columns={columns}
                data={filteredData}
                searchTerm={query}
                isLoading={isLoading}
                
                // Пошук
                sortBy={sortBy}
                onSearchChange={setQuery}
                
                // Дії
                onAddClick={() => navigate({ to: '/rates/create' as any })}
                
                // Сортування
                sortDir={sortDir}
                title="Тарифи"
                onSort={handleSort}

                // Кнопки дій
                renderActions={(item) => (
                    <div className="flex gap-2">
                        {/* Кнопка Деталі */}
                        <Link 
                            to="/rates/show/$r_id" 
                            params={{ r_id: String(item.r_id) }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
                            title="Деталі"
                        >
                            <Info className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Редагувати */}
                        <Link 
                            to="/rates/edit/$r_id" 
                            params={{ r_id: String(item.r_id) }}
                            className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
                            title="Редагувати"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Видалити */}
                        <button 
                            onClick={() => handleDelete(item.r_id)}
                            className="p-1.5 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
                            disabled={deleteMutation.isPending}
                            title="Видалити"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                )}
            />
        </div>
    );
};