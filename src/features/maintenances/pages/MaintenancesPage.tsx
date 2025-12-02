import { Link, useNavigate } from "@tanstack/react-router";
import { useMaintenances, useDeleteMaintenance } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { Trash2, Edit, Info } from "lucide-react";

export const MaintenancesPage = () => {
  const navigate = useNavigate();

  // 1. Hook для отримання даних
  const { data: maintenances, isLoading } = useMaintenances();
  const deleteMutation = useDeleteMaintenance();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("m_date"); // Сортуємо за датою за замовчуванням
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc"); // Нові зверху

  // Опис колонок
  const columns: Array<Column<any>> = [
    { 
      header: "Дата", 
      accessorKey: "m_date", 
      sortable: true,
      className: "font-medium text-gray-900",
      render: (item) => new Date(item.m_date).toLocaleDateString()
    },
    { 
      header: "ID", 
      accessorKey: "m_id", 
      sortable: true, 
      className: "text-gray-400 w-16" 
    },
    { 
      header: "Опис робіт", 
      accessorKey: "m_description", 
      render: (item) => (
        <span className="text-gray-600 truncate max-w-[250px] block" title={item.m_description}>
            {item.m_description}
        </span>
      )
    },
    { 
      header: "Вартість", 
      accessorKey: "m_cost", 
      sortable: true,
      render: (item) => {
        const cost = Number(item.m_cost);
        if (!cost || cost === 0) {
            return <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-1 rounded-full">Безкоштовно</span>
        }
        return <span className="font-medium text-gray-700">{cost.toFixed(2)} грн</span>
      }
    },
    { 
      header: "Місце", 
      accessorKey: "ps_id", 
      // Якщо є об'єкт parkingSpace, показуємо номер, інакше ID
      render: (item) => item.parkingSpace 
        ? <span className="font-medium text-blue-600">№{item.parkingSpace.ps_number}</span> 
        : <span className="text-gray-400">ID: {item.ps_id}</span>
    },
    { 
        header: "Співробітник", 
        accessorKey: "e_id", 
        // Якщо є об'єкт employee, показуємо ім'я
        render: (item) => item.employee 
          ? <span className="text-sm text-gray-700">{item.employee.e_full_name}</span> 
          : <span className="text-gray-400">ID: {item.e_id}</span>
      }
  ];

  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!maintenances) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Фільтр
    const result = maintenances.filter(m => 
      (m.m_description || "").toLowerCase().includes(lowerQuery) ||
      (m.employee?.e_full_name || "").toLowerCase().includes(lowerQuery) || // Пошук по співробітнику
      (m.parkingSpace?.ps_number || "").toLowerCase().includes(lowerQuery)  // Пошук по номеру місця
    );

    // 2. Сортування
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        // Спеціальна обробка для дат
        if (sortBy === 'm_date') {
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
  }, [maintenances, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Ви впевнені, що хочете видалити цей запис про техобслуговування?")) {
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
        onAddClick={() => navigate({ to: '/maintenances/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Технічне обслуговування"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
            <Link 
              to="/maintenances/show/$m_id" 
              params={{ m_id: String(item.m_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Деталі"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/maintenances/edit/$m_id" 
              params={{ m_id: String(item.m_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.m_id)}
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