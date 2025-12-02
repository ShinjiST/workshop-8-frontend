import { Link, useNavigate } from "@tanstack/react-router";
// 👈 Хуки для Авто
import { useAutos, useDeleteAuto } from "../api"; 
import { useMemo, useState } from "react";
// 👈 Імпортуємо UniversalTable та Column
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
// import { StatusBadge } from "@/components/ui/StatusBadge"; // Не використовуємо
import { Trash2, Edit, Info, Car } from "lucide-react";
import type { Auto } from "../types"; // Імпортуємо тип Auto

export const AutosPage = () => {
    const navigate = useNavigate();
    const { data: autos, isLoading } = useAutos();
    const deleteMutation = useDeleteAuto();

    // Стан пошуку та сортування
    const [query, setQuery] = useState("");
    // Сортування за замовчуванням: Номерний знак (для зручності)
    const [sortBy, setSortBy] = useState<string | null>("at_id");
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // Опис колонок
    const columns: Array<Column<Auto>> = [
        { 
            header: "Номерний знак", 
            accessorKey: "at_license_plate", 
            sortable: true, 
            className: "font-bold text-gray-800" 
        },
        { 
            header: "Бренд", 
            accessorKey: "at_brand", 
            sortable: true,
        },
        { 
            header: "Модель", 
            accessorKey: "at_model",
            render: (item) => <span className="text-gray-600">{item.at_model}</span>
        },
        { 
            header: "Колір", 
            accessorKey: "at_color", 
        },
        { 
            header: "Тип ТЗ", 
            accessorKey: "at_type",
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Car className="w-4 h-4 text-blue-400" />
                    <span>{item.at_type}</span>
                </div>
            )
        },
        { 
            header: "ID", 
            accessorKey: "at_id", 
            sortable: true,
            render: (item) => <span className="text-gray-400">#{item.at_id}</span> 
        }
    ];

    // Логіка сортування і фільтрації
    const filteredData = useMemo(() => {
        if (!autos) return [];
        
        // 1. Фільтр: Номер, Бренд, Модель, Колір
        const result = autos.filter(a => 
            (a.at_license_plate || "").toLowerCase().includes(query.toLowerCase()) ||
            (a.at_brand || "").toLowerCase().includes(query.toLowerCase()) ||
            (a.at_model || "").toLowerCase().includes(query.toLowerCase()) ||
            (a.at_color || "").toLowerCase().includes(query.toLowerCase())
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
    }, [autos, query, sortBy, sortDir]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    const handleDelete = (id: number, licensePlate: string) => {
        if (window.confirm(`Ви впевнені, що хочете видалити автомобіль "${licensePlate}"?`)) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    alert(`Автомобіль "${licensePlate}" успішно видалений.`);
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
                onAddClick={() => navigate({ to: '/autos/create' as any })} // 👈 Додаємо as any
                
                // Сортування
                sortDir={sortDir}
                title="Автомобілі"
                onSort={handleSort}

                // Кнопки дій
                renderActions={(item) => (
                    <div className="flex gap-2">
                        {/* Кнопка Деталі */}
                        <Link 
                            to="/autos/show/$at_id" 
                            params={{ at_id: String(item.at_id) }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
                            title="Деталі"
                        >
                            <Info className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Редагувати */}
                        <Link 
                            to="/autos/edit/$at_id" 
                            params={{ at_id: String(item.at_id) }}
                            className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
                            title="Редагувати"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Видалити */}
                        <button 
                            onClick={() => handleDelete(item.at_id, item.at_license_plate)}
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