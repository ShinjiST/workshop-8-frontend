// src/features/shifts/pages/ShiftsPage.tsx

import { Link, useNavigate } from "@tanstack/react-router";
import { useShifts, useDeleteShift } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Trash2, Edit, Info } from "lucide-react";

export const ShiftsPage = () => {
  const navigate = useNavigate();

  const { data: shifts, isLoading } = useShifts();
  const deleteMutation = useDeleteShift();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("sh_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Опис колонок
  const columns: Array<Column<any>> = [
    { 
      header: "Назва зміни", 
      accessorKey: "sh_name", 
      sortable: true, 
      className: "font-bold text-gray-800" 
    },
    { 
      header: "Початок", 
      accessorKey: "sh_start_time", 
      sortable: true,
    },
    { 
      header: "Кінець", 
      accessorKey: "sh_end_time", 
      sortable: true,
    },
    { 
      header: "Статус", 
      accessorKey: "sh_status", 
      sortable: true,
      render: (item) => {
        // Словник перекладу статусів
        const statusLabels: Record<string, string> = {
          active: "активна",
          inactive: "неактивна",
          archived: "архівна"
        };
        
        // Беремо українську назву або залишаємо оригінал, якщо перекладу немає
        const label = statusLabels[item.sh_status] || item.sh_status;
        
        return <StatusBadge status={label} />;
      }
    },
    { 
      header: "ID", 
      accessorKey: "sh_id", 
      render: (item) => <span className="text-gray-400">#{item.sh_id}</span> 
    }
  ];

  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!shifts) return [];

    // 1. Фільтр
    const result = shifts.filter(s => 
      (s.sh_name || "").toLowerCase().includes(query.toLowerCase()) ||
      (s.sh_status || "").toLowerCase().includes(query.toLowerCase()) ||
      (s.sh_start_time || "").includes(query) // Можна шукати по часу (напр. "08")
    );

    // 2. Сортування
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
  }, [shifts, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю зміну?")) {
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
        onAddClick={() => navigate({ to: '/shifts/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Робочі зміни"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
            <Link 
              to="/shifts/show/$sh_id" 
              params={{ sh_id: String(item.sh_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Інфо"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/shifts/edit/$sh_id" 
              params={{ sh_id: String(item.sh_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.sh_id)}
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