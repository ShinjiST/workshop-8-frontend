import { Link, useNavigate } from "@tanstack/react-router";
import { useCheckouts, useDeleteCheckout } from "../api";
import { useMemo, useState } from "react";
import type { Column } from "@/components/shared/UniversalTable";
import { UniversalTable } from "@/components/shared/UniversalTable";
import { StatusBadge } from "@/components/ui/StatusBadge";
import { Trash2, Edit, Info, Clock } from "lucide-react";
import type { Checkout } from "../types";

export const CheckoutsPage = () => {
  const navigate = useNavigate();

  // 1. Hook для отримання даних
  const { data: checkouts, isLoading } = useCheckouts();
  const deleteMutation = useDeleteCheckout();

  // Стан пошуку та сортування
  const [query, setQuery] = useState("");
  const [sortBy, setSortBy] = useState<string | null>("ch_time"); // Сортуємо за часом виїзду
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc"); // Нові зверху

  // Опис колонок
  const columns: Array<Column<Checkout>> = [
    { 
      header: "ID Чека", 
      accessorKey: "ch_id", 
      sortable: true, 
      render: (item) => <span className="text-gray-400">#{item.ch_id}</span>,
      className: "w-16"
    },
    { 
      header: "Статус", 
      accessorKey: "ch_status", 
      sortable: true,
      render: (item) => <StatusBadge status={item.ch_status} />
    },
    { 
      header: "Час виїзду", 
      accessorKey: "ch_time", 
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-2">
           <Clock className="w-4 h-4 text-gray-400" />
           <span className="font-medium text-gray-700">
             {new Date(item.ch_time).toLocaleDateString()}
             <span className="text-gray-500 text-xs ml-1">
                {new Date(item.ch_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
             </span>
           </span>
        </div>
      )
    },
    { 
      header: "Сума", 
      accessorKey: "ch_amount", 
      sortable: true,
      render: (item) => <span className="font-bold text-green-700">₴ {item.ch_amount}</span>
    },
    { 
      header: "Договір", 
      accessorKey: "ag_id", 
      sortable: true,
      render: (item) => {
        const clientName = item.agreement?.client?.c_full_name;
        
        return item.agreement 
          ? <Link 
                className="text-blue-600 hover:underline" 
                params={{ ag_id: String(item.ag_id) }}
                to="/agreements/show/$ag_id"
            >
                №{item.ag_id} {clientName ? `(${clientName})` : ''} 
                {/* ^ ВИПРАВЛЕНО: Додана перевірка на clientName */}
            </Link>
          : <span className="text-gray-400">№{item.ag_id}</span>
      }
    },
    { 
        header: "Оформив", 
        accessorKey: "e_id", 
        render: (item) => (
            item.employee 
              ? <span className="text-sm text-gray-700">{item.employee.e_full_name}</span> 
              : <span className="text-gray-400">ID: {item.e_id}</span>
        )
      }
  ];

  // Логіка сортування і фільтрації
  const filteredData = useMemo(() => {
    if (!checkouts) return [];

    const lowerQuery = query.toLowerCase();

    // 1. Фільтр: Пошук по ID, статусу, імені співробітника або ID договору
    const result = checkouts.filter(item => 
      String(item.ch_id).includes(lowerQuery) ||
      String(item.ag_id).includes(lowerQuery) ||
      (item.ch_status || "").toLowerCase().includes(lowerQuery) ||
      (item.employee?.e_full_name || "").toLowerCase().includes(lowerQuery)
    );

    // 2. Сортування
    if (sortBy) {
      result.sort((a, b) => {
        const aValue = (a as any)[sortBy];
        const bValue = (b as any)[sortBy];
        
        // Спеціальна обробка для дат/часу
        if (sortBy === 'ch_time') {
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
  }, [checkouts, query, sortBy, sortDir]);

  const handleSort = (key: string) => {
     if (sortBy === key) {
        setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
     } else {
        setSortBy(key);
        setSortDir('asc');
     }
  };

  const handleDelete = (id: number) => {
    if (window.confirm(`Ви впевнені, що хочете видалити запис виїзду #${id}?`)) {
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
        onAddClick={() => navigate({ to: '/checkouts/create' })}
        
        // Сортування
        sortDir={sortDir}
        title="Журнал виїздів"
        onSort={handleSort}

        // Кнопки дій
        renderActions={(item) => (
          <div className="flex gap-2">
            <Link 
              to="/checkouts/show/$ch_id" 
              params={{ ch_id: String(item.ch_id) }}
              className="p-1.5 bg-blue-50 text-blue-600 rounded border border-blue-200 hover:bg-blue-100 transition"
              title="Деталі"
            >
              <Info className="w-4 h-4" />
            </Link>
            
            <Link 
              to="/checkouts/edit/$ch_id" 
              params={{ ch_id: String(item.ch_id) }}
              className="p-1.5 bg-orange-50 text-orange-600 rounded border border-orange-200 hover:bg-orange-100 transition"
              title="Редагувати"
            >
              <Edit className="w-4 h-4" />
            </Link>
            
            <button 
              onClick={() => handleDelete(item.ch_id)}
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