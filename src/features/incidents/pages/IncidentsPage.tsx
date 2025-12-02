import { Link, useNavigate } from "@tanstack/react-router";
import { useIncidents, useDeleteIncident } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
// 👇 Імпортуємо наш оновлений бейдж
import { StatusBadge } from "@/components/ui/StatusBadge"; 
import { Trash2, Edit, Info } from "lucide-react";

export const IncidentsPage = () => {
  const navigate = useNavigate();

  const { data: incidents, isLoading } = useIncidents();
  const deleteMutation = useDeleteIncident();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("inc_date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc"); // Нові зверху

  // Опис колонок
  const columns: Array<Column<any>> = [
    { 
      header: "Дата", 
      accessorKey: "inc_date", 
      sortable: true,
      render: (item) => (
        <span className="font-medium text-gray-900">
           {new Date(item.inc_date).toLocaleDateString()} <span className="text-gray-400 text-xs">{new Date(item.inc_date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
        </span>
      )
    },
    { 
      header: "Тип", 
      accessorKey: "inc_type", 
      sortable: true,
      className: "font-bold text-gray-700"
    },
    { 
      header: "Статус", 
      accessorKey: "inc_status", 
      sortable: true,
      // 👇 Використовуємо компонент StatusBadge замість ручної верстки
      render: (item) => <StatusBadge status={item.inc_status} />
    },
    { 
      header: "Опис", 
      accessorKey: "inc_description", 
      render: (item) => (
        <span className="text-gray-500 text-sm truncate max-w-[200px] block" title={item.inc_description}>
           {item.inc_description}
        </span>
      )
    },
    { 
      header: "ID", 
      accessorKey: "inc_id", 
      render: (item) => <span className="text-gray-400">#{item.inc_id}</span> 
    }
  ];

  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!incidents) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Фільтр
    const result = incidents.filter(inc => 
      (inc.inc_type || "").toLowerCase().includes(lowerQuery) ||
      (inc.inc_status || "").toLowerCase().includes(lowerQuery) ||
      (inc.inc_description || "").toLowerCase().includes(lowerQuery)
    );

    // 2. Сортування
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        // Спеціальна обробка для дат
        if (sortBy === 'inc_date') {
             return sortDir === 'asc' 
                ? new Date(aValue).getTime() - new Date(bValue).getTime()
                : new Date(bValue).getTime() - new Date(aValue).getTime();
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
  }, [incidents, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей інцидент?")) {
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
        onAddClick={() => navigate({ to: '/incidents/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Інциденти"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
            <Link 
              to="/incidents/show/$inc_id" 
              params={{ inc_id: String(item.inc_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Інфо"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/incidents/edit/$inc_id" 
              params={{ inc_id: String(item.inc_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.inc_id)}
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