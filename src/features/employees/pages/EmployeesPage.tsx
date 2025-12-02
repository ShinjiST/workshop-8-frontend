import { Link, useNavigate } from "@tanstack/react-router";
// 👈 Хуки для Співробітників
import { useEmployees, useDeleteEmployee } from "../api"; 
import { useMemo, useState } from "react";
// 👈 Імпортуємо UniversalTable та Column
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
// import { StatusBadge } from "@/components/ui/StatusBadge"; // Не використовуємо
import { Trash2, Edit, Info, Mail, Briefcase, Activity } from "lucide-react";
import type { Employee } from "../types"; // Імпортуємо тип Employee

export const EmployeesPage = () => {
    const navigate = useNavigate();
    const { data: employees, isLoading } = useEmployees();
    const deleteMutation = useDeleteEmployee();

    // Стан пошуку та сортування
    const [query, setQuery] = useState("");
    // 💡 Сортування за замовчуванням: ID (e_id) - ЗАЛИШАЄМО, щоб був зрозумілий порядок за замовчуванням
    const [sortBy, setSortBy] = useState<string | null>("e_id"); 
    const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

    // Опис колонок
    const columns: Array<Column<Employee>> = [
        // 1. ПОВНЕ ІМ'Я
        { 
            header: "Повне ім'я", 
            accessorKey: "e_full_name", 
            sortable: true, 
            className: "font-bold text-gray-800" 
        },
        // 2. ПОСАДА
        { 
            header: "Посада", 
            accessorKey: "e_position", 
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Briefcase className="w-4 h-4 text-orange-500" />
                    <span>{item.e_position}</span>
                </div>
            )
        },
        // 3. EMAIL
        { 
            header: "Email", 
            accessorKey: "e_email", 
            render: (item) => (
                <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-blue-500" />
                    <span className="truncate max-w-[150px]">{item.e_email}</span>
                </div>
            )
        },
        // 4. ЗАРПЛАТА
        { 
            header: "Зарплата", 
            accessorKey: "e_salary",
            sortable: true,
            render: (item) => (
                <div className="flex items-center gap-1 text-green-700 font-medium">
                    <span>₴ {item.e_salary}</span> 
                </div>
            )
        },
        // 5. СТАТУС
        { 
            header: "Статус", 
            accessorKey: "e_status",
            render: (item) => (
                <div className="flex items-center gap-1">
                    <Activity className="w-4 h-4 text-gray-400" />
                    {item.e_status}
                </div>
            )
        },
        // 6. ID (зміщено в кінець)
        { 
            header: "ID", 
            accessorKey: "e_id", 
            sortable: true, 
            render: (item) => <span className="text-gray-500">#{item.e_id}</span>,
            className: "text-gray-500"
        },
    ];

    // Логіка сортування і фільтрації
    const filteredData = useMemo(() => {
        if (!employees) return [];
        
        // 1. Фільтр: шукаємо по імені, email, посаді, телефону або ID
        const result = employees.filter(e => 
            (e.e_full_name || "").toLowerCase().includes(query.toLowerCase()) ||
            (e.e_email || "").toLowerCase().includes(query.toLowerCase()) ||
            (e.e_position || "").toLowerCase().includes(query.toLowerCase()) ||
            (e.e_phone_number || "").includes(query) ||
            String(e.e_id).includes(query)
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
    }, [employees, query, sortBy, sortDir]);

    const handleSort = (key: string) => {
        if (sortBy === key) {
            setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(key);
            setSortDir('asc');
        }
    };

    const handleDelete = (id: number, name: string) => {
        if (window.confirm(`Ви впевнені, що хочете видалити співробітника "${name}"?`)) {
            deleteMutation.mutate(id, {
                onSuccess: () => {
                    alert(`Співробітник "${name}" успішно видалений.`);
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
                onAddClick={() => navigate({ to: '/employees/create' as any })}
                
                // Сортування
                sortDir={sortDir}
                title="Працівники"
                onSort={handleSort}

                // Кнопки дій
                renderActions={(item) => (
                    <div className="flex gap-2">
                        {/* Кнопка Деталі */}
                        <Link 
                            to="/employees/show/$e_id" 
                            params={{ e_id: String(item.e_id) }}
                            className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
                            title="Деталі"
                        >
                            <Info className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Редагувати */}
                        <Link 
                            to="/employees/edit/$e_id" 
                            params={{ e_id: String(item.e_id) }}
                            className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
                            title="Редагувати"
                        >
                            <Edit className="w-4 h-4" />
                        </Link>
                        
                        {/* Кнопка Видалити */}
                        <button 
                            onClick={() => handleDelete(item.e_id, item.e_full_name)}
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