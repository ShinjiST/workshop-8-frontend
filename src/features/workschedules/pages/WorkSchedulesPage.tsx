// src/features/workschedules/pages/WorkSchedulesPage.tsx

import { Link, useNavigate } from "@tanstack/react-router";
import { useWorkSchedules, useDeleteWorkSchedule } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { Trash2, Edit, Info, User, Clock } from "lucide-react";

export const WorkSchedulesPage = () => {
  const navigate = useNavigate();

  const { data: schedules, isLoading } = useWorkSchedules();
  const deleteMutation = useDeleteWorkSchedule();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("ws_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc"); // Сортуємо за датою (спочатку нові)

  // Опис колонок
  const columns: Array<Column<any>> = [
    { 
      header: "Дата", 
      accessorKey: "ws_date", 
      sortable: true, 
      className: "font-bold text-gray-800" 
    },
    { 
      header: "Працівник", 
      accessorKey: "e_id", // Сортування по ID (для простоти), відображення - Ім'я
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium flex items-center gap-1">
             <User className="w-3 h-3 text-gray-400" />
             {item.employee?.e_full_name || `ID: ${item.e_id}`}
          </span>
          <span className="text-xs text-gray-500">{item.employee?.e_position}</span>
        </div>
      )
    },
    { 
      header: "Зміна", 
      accessorKey: "sh_id",
      render: (item) => (
        <div className="flex flex-col">
          <span className="font-medium">{item.shift?.sh_name || `Shift ID: ${item.sh_id}`}</span>
          {item.shift && (
            <span className="text-xs text-gray-500 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {item.shift.sh_start_time} - {item.shift.sh_end_time}
            </span>
          )}
        </div>
      )
    },
    { 
      header: "ID", 
      accessorKey: "ws_id", 
      render: (item) => <span className="text-gray-400">#{item.ws_id}</span> 
    }
  ];

  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!schedules) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Фільтр
    const result = schedules.filter(s => {
      const dateMatch = (s.ws_date || "").includes(query);
      // Безпечний доступ до вкладених об'єктів (?.)
      const employeeMatch = (s.employee?.e_full_name || "").toLowerCase().includes(lowerQuery);
      const shiftMatch = (s.shift?.sh_name || "").toLowerCase().includes(lowerQuery);
      
      return dateMatch || employeeMatch || shiftMatch;
    });

    // 2. Сортування
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        // Сортування дат (рядків) або чисел
        if (sortBy === 'ws_date') {
             return sortDir === 'asc' 
                ? aValue.localeCompare(bValue) 
                : bValue.localeCompare(aValue);
        }

        if (typeof aValue === 'number' && typeof bValue === 'number') {
           return sortDir === 'asc' ? aValue - bValue : bValue - aValue;
        }
        
        return sortDir === 'asc' 
          ? String(aValue).localeCompare(String(bValue))
          : String(bValue).localeCompare(String(aValue));
      });
    }

    return result;
  }, [schedules, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей запис із графіка?")) {
      deleteMutation.mutate(id);
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
        onAddClick={() => navigate({ to: '/workschedules/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Графік роботи"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
            <Link 
              to="/workschedules/show/$ws_id" 
              params={{ ws_id: String(item.ws_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Інфо"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/workschedules/edit/$ws_id" 
              params={{ ws_id: String(item.ws_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.ws_id)}
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