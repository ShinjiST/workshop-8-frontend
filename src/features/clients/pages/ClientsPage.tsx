import { Link, useNavigate } from "@tanstack/react-router";
import { useClients, useDeleteClient } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
// import { StatusBadge } from "@/components/ui/StatusBadge"; 
import { Trash2, Edit, Info, Mail, Phone } from "lucide-react"; 
import type { Client } from "../types"; // Імпортуємо тип Client

export const ClientsPage = () => {
    const navigate = useNavigate();
    const { data: clients, isLoading } = useClients();
    const deleteMutation = useDeleteClient();

    // Стан пошуку та сортування
    const [query, setQuery] = useState("");
    const [sortBy, setSortBy] = useState<string | null>("c_id"); 
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // Опис колонок
    const columns: Array<Column<Client>> = [
        // 1. Повне ім'я
        { 
            header: "Повне ім'я", 
            accessorKey: "c_full_name", 
            sortable: true, 
            className: "font-bold text-gray-800" 
        },
        // 2. Email
        { 
            header: "Email", 
            accessorKey: "c_email", 
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="truncate max-w-[200px]">{item.c_email}</span>
                </div>
            )
        },
        // 3. Телефон (осн.)
        { 
            header: "Телефон (осн.)", 
            accessorKey: "c_phone_number",
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-green-500" />
                    {item.c_phone_number}
                </div>
            )
        },
        // 4. ID (Зміщено в кінець)
        { 
            header: "ID", 
            accessorKey: "c_id", 
            sortable: true, 
            render: (item) => (
                <div className="flex items-center gap-2">
                    {/* ❌ ВИДАЛЕНО: Іконка Hash, залишено лише текстовий символ # */}
                    <span className="text-gray-500 font-medium">#{item.c_id}</span>
                </div>
            ),
            className: "text-gray-500"
        },
    ];

    // Логіка сортування і фільтрації
    const filteredData = useMemo(() => {
        if (!clients) return [];
        
        // 1. Фільтр: шукаємо по імені, email, основному телефону або ID
        const result = clients.filter(c => 
            (c.c_full_name || "").toLowerCase().includes(query.toLowerCase()) ||
            (c.c_email || "").toLowerCase().includes(query.toLowerCase()) ||
            (c.c_phone_number || "").includes(query) ||
            String(c.c_id).includes(query)
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
    }, [clients, query, sortBy, sortDir]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Ви впевнені, що хочете видалити клієнта "${name}"?`)) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    alert(`Клієнт "${name}" успішно видалений.`);
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
                onAddClick={() => navigate({ to: '/clients/create' as any })}
                
                // Сортування
                sortDir={sortDir}
                title="Клієнти"
                onSort={handleSort}

                // Кнопки дій
                renderActions={(item) => (
                    <div className="flex gap-2">
                        {/* Кнопка Деталі */}
                        <Link 
                            to="/clients/show/$c_id" 
                            params={{ c_id: String(item.c_id) }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
                            title="Деталі"
                        >
                            <Info className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Редагувати */}
                        <Link 
                            to="/clients/edit/$c_id" 
                            params={{ c_id: String(item.c_id) }}
                            className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
                            title="Редагувати"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Видалити */}
                        <button 
                            onClick={() => handleDelete(item.c_id, item.c_full_name)}
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