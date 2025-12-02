import { Link, useNavigate } from "@tanstack/react-router";
import { useParkingZones, useDeleteParkingZone } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { Trash2, Edit, Info } from "lucide-react";

export const ParkingZonesPage = () => {
  const navigate = useNavigate();
  const { data: zones, isLoading } = useParkingZones();
  const deleteMutation = useDeleteParkingZone();

  // --- Стан пошуку та сортування ---
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("pz_name");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  // --- Опис колонок ---
  const columns: Array<Column<any>> = [
    { 
      header: "Назва", 
      accessorKey: "pz_name", 
      sortable: true, 
      className: "font-bold text-gray-800" 
    },
    { 
      header: "ID", 
      accessorKey: "pz_id", 
      render: (item) => <span className="text-gray-400">#{item.pz_id}</span> 
    },
    { 
      header: "Місткість", 
      accessorKey: "pz_capacity", 
      sortable: true,
      // 👇 ВИПРАВЛЕННЯ: Прибрано 'text-center'. Тепер буде зліва за замовчуванням.
      className: "whitespace-nowrap", 
      render: (item) => (
        <span className="font-medium text-gray-700">
          {item.pz_capacity}
        </span>
      )
    }
  ];

  // --- Логіка сортування і фільтрації ---
  const filteredData = useMemo(() => {
    if (!zones) return [];
    
    // 1. Фільтр
    const result = zones.filter(z => 
      (z.pz_name || "").toLowerCase().includes(query.toLowerCase())
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
  }, [zones, query, sortBy, sortDir]);

  // Обробники
  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цю зону? Це може вплинути на паркомісця в ній.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="space-y-4">
      <UniversalTable
        columns={columns}
        data={filteredData}
        isLoading={isLoading}
        searchTerm={query}
        
        sortBy={sortBy}
        sortDir={sortDir}
        
        title="Паркінг Зони"
        
        renderActions={(item) => (
          // Кнопки дій
          <div className="flex gap-2">
            <Link 
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition" 
              params={{ pz_id: String(item.pz_id) }}
              title="Info"
              to="/parkingzones/show/$pz_id"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition" 
              params={{ pz_id: String(item.pz_id) }}
              title="Edit"
              to="/parkingzones/edit/$pz_id"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              className="p-1.5 bg-red-50 text-red-600 rounded border border-red-200 hover:bg-red-100 transition disabled:opacity-50"
              disabled={deleteMutation.isPending}
              title="Delete"
              onClick={() => { handleDelete(item.pz_id); }}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        )}
        onAddClick={() => navigate({ to: '/parkingzones/create' })}
        onSearchChange={setQuery}

        onSort={handleSort}
      />
    </div>
  );
};