// src/components/shared/UniversalTable.tsx
import type { ReactNode} from 'react';
import { useState, useRef, useEffect } from 'react';
import { Search, SlidersHorizontal, Plus, Download, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  render?: (item: T) => ReactNode;
  className?: string; // Можна передати свій клас, але ширина тепер рахується автоматично
  sortable?: boolean;
}

interface UniversalTableProps<T> {
  title: string;
  data: Array<T>;
  columns: Array<Column<T>>;
  isLoading?: boolean;
  
  searchTerm?: string;
  onSearchChange?: (value: string) => void;
  onAddClick?: () => void;
  renderActions?: (item: T) => ReactNode;

  sortBy?: string | null;
  sortDir?: "asc" | "desc";
  onSort?: (key: string) => void;
}

export function UniversalTable<T extends { id?: string | number; [key: string]: any }>({
  title,
  data,
  columns,
  isLoading,
  searchTerm,
  onSearchChange,
  onAddClick,
  renderActions,
  sortBy,
  sortDir,
  onSort
}: UniversalTableProps<T>) {

  // --- СТАНИ ---
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsRef = useRef<HTMLDivElement>(null);
  const [hiddenColumns, setHiddenColumns] = useState<Array<string>>([]);
  const [textSize, setTextSize] = useState<'small' | 'normal' | 'large'>('normal');

  // 👇 ФІКС 1: Скидання на 1 сторінку при пошуку
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (settingsRef.current && !settingsRef.current.contains(event.target as Node)) {
        setIsSettingsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => { document.removeEventListener("mousedown", handleClickOutside); };
  }, []);

  // --- ЛОГІКА ДАНИХ ---
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, totalItems);
  const currentData = data.slice(startIndex, endIndex);

  const visibleColumns = columns.filter(col => !hiddenColumns.includes(col.header));

  // 👇 ФІКС 2 (АВТОМАТИЧНА ШИРИНА):
  // 1. Якщо є колонка "Дії" (renderActions), резервуємо їй 10%.
  // 2. Решту ширини (90% або 100%) ділимо ПОРІВНУ на кількість видимих колонок даних.
  const actionColumnWidth = renderActions ? 10 : 0;
  const availableWidth = 100 - actionColumnWidth;
  const columnWidthPercentage = visibleColumns.length > 0 ? availableWidth / visibleColumns.length : 0;

  // --- CSV ЕКСПОРТ ---
  const handleExportCSV = () => {
    if (!data || data.length === 0) { alert("Немає даних для експорту"); return; }
    
    const headers = columns.map(c => c.header).join(";");
    
    const rows = data.map(item => {
      return columns.map(col => {
        const value = col.accessorKey ? item[col.accessorKey] : "";
        return `"${String(value ?? "").replace(/"/g, '""')}"`;
      }).join(";");
    }).join("\n");

    const csvContent = "\uFEFF" + headers + "\n" + rows;
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `${title}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // --- ДОПОМІЖНІ ФУНКЦІЇ ---
  const toggleColumn = (header: string) => {
    setHiddenColumns(previous => 
      previous.includes(header) 
        ? previous.filter(h => h !== header) 
        : [...previous, header]
    );
  };

  const getTextClass = () => {
    switch (textSize) {
      case 'small': return 'text-xs py-2';
      case 'large': return 'text-base py-4';
      default: return 'text-sm py-3';
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">{title}</h1>

      {/* ПАНЕЛЬ ІНСТРУМЕНТІВ */}
      <div className="bg-white p-2 rounded-xl border border-gray-200 shadow-sm flex flex-col sm:flex-row gap-2 items-center relative z-20">
        
        {/* Пошук */}
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input 
            className="w-full pl-10 pr-4 py-2 border-none rounded-lg text-sm focus:outline-none focus:ring-0 text-gray-700 bg-transparent"
            placeholder="Введіть запит для пошуку..." 
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
        </div>

        {/* Кнопки */}
        <div ref={settingsRef} className="flex items-center gap-2 pr-2 relative">
          
          {/* Кнопка налаштувань */}
          <button 
            className={`p-2 rounded-lg border transition ${isSettingsOpen ? 'bg-gray-100 border-gray-300' : 'text-gray-500 hover:bg-gray-100 border-gray-200'}`}
            onClick={() => { setIsSettingsOpen(!isSettingsOpen); }}
          >
              <SlidersHorizontal className="w-4 h-4" />
          </button>

          {/* POPOVER НАЛАШТУВАНЬ */}
          {isSettingsOpen && (
            <div className="absolute top-12 right-0 w-64 bg-white border border-gray-200 rounded-xl shadow-xl p-4 z-50">
              <div className="mb-4">
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Розмір тексту</h3>
                <div className="flex border border-gray-200 rounded-lg overflow-hidden">
                  {(['small', 'normal', 'large'] as const).map((size) => (
                    <button
                      key={size}
                      className={`flex-1 py-1 text-xs font-medium transition ${
                        textSize === size ? 'bg-blue-50 text-blue-600' : 'bg-white text-gray-600 hover:bg-gray-50'
                      } ${size !== 'large' ? 'border-r border-gray-200' : ''}`}
                      onClick={() => { setTextSize(size); }}
                    >
                      {size === 'small' ? 'Small' : size === 'normal' ? 'Normal' : 'Large'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-bold text-gray-500 uppercase mb-2">Відображати стовпці</h3>
                <div className="space-y-1 max-h-48 overflow-y-auto">
                  {columns.map((col) => (
                    <button
                      key={col.header}
                      className="flex items-center justify-between w-full px-2 py-1.5 text-sm text-gray-700 hover:bg-gray-50 rounded-md transition"
                      onClick={() => { toggleColumn(col.header); }}
                    >
                      <span>{col.header}</span>
                      <div className={`w-9 h-5 rounded-full relative transition ${!hiddenColumns.includes(col.header) ? 'bg-blue-600' : 'bg-gray-300'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full shadow-sm transition-all ${!hiddenColumns.includes(col.header) ? 'left-5' : 'left-1'}`}></div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Кнопка CSV */}
          <button 
             className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
             onClick={handleExportCSV}
          >
             <Download className="w-4 h-4" />
             <span className="hidden sm:inline">CSV</span>
          </button>

          {/* Кнопка Додати */}
          {onAddClick && (
            <button 
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition shadow-sm" 
              onClick={onAddClick}
            >
              <Plus className="w-4 h-4" /> 
              <span>Додати</span>
            </button>
          )}
        </div>
      </div>

      {/* ТАБЛИЦЯ */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden flex flex-col z-0 relative">
        <div className="overflow-x-auto">
          {/* 👇 table-fixed потрібен, щоб проценти працювали коректно */}
          <table className="w-full text-left table-fixed">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200 font-medium uppercase text-xs">
              <tr>
                {visibleColumns.map((col, index) => (
                  <th 
                    className={`px-4 py-3 ${col.className || ''} ${col.sortable ? 'cursor-pointer hover:bg-gray-100' : ''}`}
                    onClick={() => col.sortable && col.accessorKey && onSort?.(col.accessorKey as string)}
                    key={index} 
                    // 👇 АВТОМАТИЧНА ШИРИНА ТУТ
                    style={{ width: `${columnWidthPercentage}%` }}
                  >
                    <div className={`flex items-center gap-1 ${col.className?.includes('text-center') ? 'justify-center' : ''}`}>
                      {col.header}
                      {sortBy === col.accessorKey && (
                        <span>{sortDir === 'asc' ? '▲' : '▼'}</span>
                      )}
                    </div>
                  </th>
                ))}
                {renderActions && (
                    <th 
                        // 👇 ФІКСОВАНІ 10% ДЛЯ ДІЙ
                        className="px-4 py-3 text-center whitespace-nowrap"
                        style={{ width: `${actionColumnWidth}%` }}
                    >
                        Дії
                    </th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                 <tr><td className="p-8 text-center text-gray-500" colSpan={visibleColumns.length + (renderActions ? 1 : 0)}>Завантаження...</td></tr>
              ) : currentData.length === 0 ? (
                 <tr><td className="p-8 text-center text-gray-500" colSpan={visibleColumns.length + (renderActions ? 1 : 0)}>Даних не знайдено</td></tr>
              ) : (
                currentData.map((item, rowIndex) => (
                  <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                    {visibleColumns.map((col, colIndex) => (
                      <td key={colIndex} className={`px-4 text-gray-700 truncate ${getTextClass()} ${col.className || ''}`}>
                        {col.render ? col.render(item) : (item as any)[col.accessorKey!]}
                      </td>
                    ))}
                    {renderActions && (
                      <td className={`px-4 text-center whitespace-nowrap ${getTextClass()}`}>
                         <div className="flex justify-center gap-2">
                            {renderActions(item)}
                         </div>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* ФУТЕР */}
        {!isLoading && data.length > 0 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-200 bg-white gap-4 text-sm text-gray-600">
              
             {/* ЛІВА ЧАСТИНА: Вибір рядків */}
             <div className="flex items-center gap-2">
               <span>Рядків на стор:</span>
               <select 
                 className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none focus:border-blue-500" 
                 value={rowsPerPage}
                 onChange={(e) => {
                   setRowsPerPage(Number(e.target.value));
                   setCurrentPage(1);
                 }}
               >
                 <option value={5}>5</option>
                 <option value={10}>10</option>
                 <option value={20}>20</option>
                 <option value={50}>50</option>
               </select>
             </div>

             {/* ПРАВА ЧАСТИНА: Текст і Стрілки (огорнули в div) */}
             <div className="flex items-center gap-4">
                 <div>
                   {startIndex + 1}-{endIndex} із {totalItems}
                 </div>

                 <div className="flex gap-1">
                    <button 
                      className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                      disabled={currentPage === 1}
                      onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); }}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button 
                       className="p-1 border rounded hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent"
                       disabled={currentPage === totalPages}
                       onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); }}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                 </div>
             </div>

          </div>
        )}
      </div>
    </div>
  );
}