import { Link, useNavigate } from "@tanstack/react-router";
import { useParkingSpaces, useDeleteParkingSpace } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Trash2, Edit, Info } from "lucide-react";

export const ParkingSpacesPage = () => {
  const navigate = useNavigate();
  const { data: spaces, isLoading } = useParkingSpaces();
  const deleteMutation = useDeleteParkingSpace();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("ps_number");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // Опис колонок
  // Ширина колонок тепер розраховується автоматично в UniversalTable
  const columns: Array<Column<any>> = [
    { 
      header: "Номер", 
      accessorKey: "ps_number", 
      sortable: true, 
      className: "font-bold text-gray-800" 
    },
    { 
      header: "Рівень", 
      accessorKey: "ps_level", 
      sortable: true,
    },
    { 
      header: "Статус", 
      accessorKey: "ps_status", 
      sortable: true,
      render: (item) => <StatusBadge status={item.ps_status} /> 
    },
    { 
      header: "Тип авто", 
      accessorKey: "ps_auto_type",
    },
    { 
      header: "Зона (ID)", 
      accessorKey: "pz_id", 
      render: (item) => <span className="text-gray-400">#{item.pz_id}</span> 
    }
  ];

  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!spaces) return [];
    
    // 1. Фільтр
    const result = spaces.filter(s => 
      (s.ps_number || "").toLowerCase().includes(query.toLowerCase()) ||
      (s.ps_status || "").toLowerCase().includes(query.toLowerCase()) ||
      (s.ps_auto_type || "").toLowerCase().includes(query.toLowerCase())
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
  }, [spaces, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей слот?")) {
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
        onAddClick={() => navigate({ to: '/parkingspaces/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Паркомісця"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
          <Link 
              to="/parkingspaces/show/$ps_id" 
              params={{ ps_id: String(item.ps_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Info"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/parkingspaces/edit/$ps_id" 
              params={{ ps_id: String(item.ps_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Edit"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.ps_id)}
              className="p-1.5 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
              disabled={deleteMutation.isPending}
              title="Delete"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      />
    </div>
  );
};