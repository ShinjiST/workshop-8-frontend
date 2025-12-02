import { Link, useNavigate } from "@tanstack/react-router";
import { useAgreements, useDeleteAgreement } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Trash2, Edit, Info, User, Car } from "lucide-react";

export const AgreementsPage = () => {
  const navigate = useNavigate();

  // 1. Hook для отримання даних
  const { data: agreements, isLoading } = useAgreements();
  const deleteMutation = useDeleteAgreement();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("ag_date"); // Сортуємо за датою за замовчуванням
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc"); // Нові зверху

  // Опис колонок
  // Опис колонок
  const columns: Array<Column<any>> = [
    { 
      header: "ID", 
      accessorKey: "ag_id", 
      sortable: true, 
      className: "text-gray-400 w-16" 
    },
    { 
      header: "Статус", 
      accessorKey: "a_status", 
      sortable: true, 
      render: (item) => <StatusBadge status={item.a_status} />
    },
    { 
      header: "Клієнт", 
      accessorKey: "c_id", 
      render: (item) => (
        <div className="flex items-center gap-2 overflow-hidden">
           {/* 👇 1. FIX: flex-shrink-0 не дає іконці зникнути */}
           <User className="w-4 h-4 text-gray-400 flex-shrink-0" />
           
           {/* truncate обріже текст трикрапкою, якщо він все одно не влазить */}
           <span className="font-medium text-gray-700 truncate">
             {item.client ? item.client.c_full_name : `ID: ${item.c_id}`}
           </span>
        </div>
      )
    },
    { 
      header: "Авто", 
      accessorKey: "at_id", 
      render: (item) => (
        <div className="flex items-center gap-2 overflow-hidden">
           {/* 👇 2. FIX: Тут теж додаємо flex-shrink-0 */}
           <Car className="w-4 h-4 text-gray-400 flex-shrink-0" />
           
           <span className="text-gray-600 truncate">
             {item.auto ? `${item.auto.at_brand} (${item.auto.at_license_plate})` : `ID: ${item.at_id}`}
           </span>
        </div>
      )
    },
    { 
      header: "Дата початку", 
      accessorKey: "ag_date", 
      sortable: true, 
      render: (item) => <span className="whitespace-nowrap">{new Date(item.ag_date).toLocaleDateString()}</span>
    },
    { 
      header: "Сума", 
      accessorKey: "a_total", 
      sortable: true, 
      render: (item) => <span className="font-bold text-green-700 whitespace-nowrap">₴ {item.a_total}</span>
    },
  ];
  
  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!agreements) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Фільтр
    const result = agreements.filter(item => 
      String(item.ag_id).includes(lowerQuery) ||
      (item.a_status || "").toLowerCase().includes(lowerQuery) ||
      (item.client?.c_full_name || "").toLowerCase().includes(lowerQuery) || // Пошук по клієнту
      (item.auto?.at_license_plate || "").toLowerCase().includes(lowerQuery) // Пошук по номеру авто
    );

    // 2. Сортування
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        // Спеціальна обробка для дат
        if (sortBy === 'ag_date') {
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
  }, [agreements, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Ви впевнені, що хочете видалити договір #${id}?`)) {
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
        onAddClick={() => navigate({ to: '/agreements/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Договори"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
            <Link 
              to="/agreements/show/$ag_id" 
              params={{ ag_id: String(item.ag_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Деталі"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/agreements/edit/$ag_id" 
              params={{ ag_id: String(item.ag_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.ag_id)}
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