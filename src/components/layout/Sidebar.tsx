import type React from "react";
import { useState, useRef } from "react";
import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import { useAuthStore } from "@/store/authStore";
import { useUIStore } from "@/store/uiStore";
import { 
  Home, LayoutDashboard, ChevronDown, FileText, 
  LogOut, AlertOctagon, Wrench, Grid, Map as MapIcon, Tag, 
  Users, CarFront, IdCard, Clock, CalendarDays,
  BookText, HelpCircle, UserCircle, LogOut as LogOutIcon 
} from "lucide-react";

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuthStore();
  const { isSidebarCollapsed, sidebarWidth, setSidebarWidth } = useUIStore();

  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  
  // Ref для сайдбара — убирает тормоза при изменении ширины
  const sidebarRef = useRef<HTMLElement>(null);

  const handleLogout = () => {
    logout();
    navigate({ to: '/login' as any });
  };

  const toggleGroup = (label: string) => {
    if (isSidebarCollapsed) return;
    setOpenGroup(previous => (previous === label ? null : label));
  };

  // --- ЛОГИКА РЕСАЙЗЕРА (БЫСТРАЯ) ---
  const startResizing = (mouseDownEvent: React.MouseEvent) => {
    mouseDownEvent.preventDefault();
    setIsResizing(true);
    
    const startX = mouseDownEvent.clientX;
    const startWidth = sidebarRef.current ? sidebarRef.current.getBoundingClientRect().width : sidebarWidth;

    const doDrag = (mouseMoveEvent: MouseEvent) => {
      if (sidebarRef.current) {
        let newWidth = startWidth + (mouseMoveEvent.clientX - startX);
        if (newWidth < 240) newWidth = 240;
        if (newWidth > 400) newWidth = 400;
        
        sidebarRef.current.style.width = `${newWidth}px`;
      }
    };

    const stopDrag = () => {
      setIsResizing(false);
      if (sidebarRef.current) {
         const finalWidth = parseInt(sidebarRef.current.style.width);
         if (!isNaN(finalWidth)) {
            setSidebarWidth(finalWidth);
         }
      }
      document.documentElement.removeEventListener('mousemove', doDrag, false);
      document.documentElement.removeEventListener('mouseup', stopDrag, false);
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    document.documentElement.addEventListener('mousemove', doDrag, false);
    document.documentElement.addEventListener('mouseup', stopDrag, false);
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };

  const NavItem = ({ to, label, icon: Icon }: { to: string, label: string, icon: any }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        title={isSidebarCollapsed ? label : ""}
        to={to}
        className={`flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 group relative overflow-hidden whitespace-nowrap flex-shrink-0
          ${isActive 
            ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50' 
            : 'text-gray-400 hover:bg-[#1e1e2d] hover:text-white transition-colors duration-200'
          }`}
      >
        <Icon className={`w-5 h-5 flex-shrink-0 min-w-[20px] ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-blue-400 transition-colors'}`} />
        <span className={`text-sm font-medium transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 translate-x-[-10px]' : 'opacity-100 w-auto translate-x-0'}`}>
          {label}
        </span>
      </Link>
    );
  };

  // --- ИСПРАВЛЕННАЯ ГРУППА (MAX-HEIGHT) ---
  const NavGroup = ({ label, children }: { label: string, children: React.ReactNode }) => {
    const isOpen = openGroup === label;
    
    if (isSidebarCollapsed) return null;

    return (
      <div className="mb-1"> 
        <button
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg hover:bg-[#1e1e2d] hover:text-white transition-colors duration-200 group whitespace-nowrap ${isOpen ? 'text-white' : 'text-gray-400'}`}
          onClick={() => { toggleGroup(label); }}
        >
          <div className="flex items-center gap-3">
             <span className="text-[11px] font-bold uppercase tracking-wider group-hover:text-blue-400 transition-colors">{label}</span>
          </div>
          <ChevronDown 
            className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-in-out ${isOpen ? '-rotate-180' : 'rotate-0'}`} 
          />
        </button>
        
        {/* Здесь используем max-height. 
           1000px — это условное значение "больше чем контент".
           Это самый надежный способ анимации в CSS.
        */}
        <div 
          style={{
            maxHeight: isOpen ? "1000px" : "0px", // Анимируем до "большого значения"
            opacity: isOpen ? 1 : 0,
            overflow: "hidden",
            transition: "all 0.4s ease-in-out" // Плавность 0.4 секунды
          }}
        >
          <div className="mt-1 ml-2 pl-2 border-l border-gray-700/50 space-y-1 pb-2 pt-1">
            {children}
          </div>
        </div>
      </div>
    );
  };

  return (
    <aside 
      ref={sidebarRef}
      style={{ width: isSidebarCollapsed ? '80px' : `${sidebarWidth}px` }} 
      className={`bg-[#111827] text-gray-300 flex flex-col h-screen border-r border-gray-800 flex-shrink-0 relative overflow-hidden
        ${isResizing ? 'transition-none select-none' : 'transition-[width] duration-300 ease-in-out'}`}
    >
      <div className="h-16 flex items-center px-6 border-b border-gray-800 overflow-hidden whitespace-nowrap flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="bg-blue-600 w-8 h-8 rounded-md flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-900/20">
             <span className="font-bold text-white text-lg">P</span>
          </div>
          <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'opacity-0 w-0 translate-x-[-20px]' : 'opacity-100 w-auto translate-x-0'}`}>
            <h1 className="text-xl font-bold text-white tracking-tight">
              Park<span className="text-blue-500">Go</span>
            </h1>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 custom-scrollbar overflow-x-hidden" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        <style>{`.custom-scrollbar::-webkit-scrollbar { display: none; }`}</style>
        
        <NavItem icon={Home} label="Головна" to="/" />
        
        {isAuthenticated && (
          <div className="animate-in fade-in duration-500">
            <NavItem icon={LayoutDashboard} label="Робоча область" to="/workspace" />

            <NavGroup label="Операції">
              <NavItem icon={FileText} label="Договори" to="/agreements" />
              <NavItem icon={LogOut} label="Виїзд / Чеки" to="/checkouts" />
              <NavItem icon={AlertOctagon} label="Інциденти" to="/incidents" />
              <NavItem icon={Wrench} label="Обслуговування" to="/maintenances" />
            </NavGroup>

            <NavGroup label="Парковка">
              <NavItem icon={Grid} label="Паркомісця" to="/parkingspaces" />
              <NavItem icon={MapIcon} label="Зони" to="/parkingzones" />
              <NavItem icon={Tag} label="Тарифи" to="/rates" />
            </NavGroup>

            <NavGroup label="База Даних">
               <NavItem icon={Users} label="Клієнти" to="/clients" />
               <NavItem icon={CarFront} label="Автомобілі" to="/autos" />
               <NavItem icon={IdCard} label="Працівники" to="/employees" />
            </NavGroup>

            <NavGroup label="Графік">
               <NavItem icon={Clock} label="Шаблони змін" to="/shifts" />
               <NavItem icon={CalendarDays} label="Розклад" to="/workschedules" />
            </NavGroup>

            <NavGroup label="Інструкції">
               <NavItem icon={BookText} label="База знань" to="/knowledge-base" />
               <NavItem icon={HelpCircle} label="FAQ" to="/faq" />
            </NavGroup>
          </div>
        )}
      </nav>

      <div className="p-4 border-t border-gray-800 overflow-hidden flex-shrink-0">
        {isAuthenticated ? (
           <div 
             className={`flex items-center bg-[#1a2234] rounded-xl border border-gray-700/30 transition-all duration-300 ease-in-out overflow-hidden
             ${isSidebarCollapsed ? 'justify-center p-2 gap-0' : 'p-2.5 gap-3'}
             `}
           >
             <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center text-gray-400 flex-shrink-0">
                <UserCircle className="w-5 h-5" />
             </div>
             
             <div 
               className={`flex-1 min-w-0 flex flex-col justify-center transition-all duration-300 ease-in-out
               ${isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}
               `}
             >
               <div className="text-sm font-bold text-white truncate leading-tight">
                 {user?.name || "Користувач"}
               </div>
               <div className="text-[10px] text-gray-500 truncate uppercase tracking-wider leading-tight">
                 {user?.role}
               </div>
             </div>
             
             <button className={`text-gray-500 hover:text-red-400 transition-all duration-300 flex-shrink-0 ${isSidebarCollapsed ? 'w-0 opacity-0 overflow-hidden' : 'w-auto opacity-100'}`} onClick={handleLogout}>
                <LogOutIcon className="w-5 h-5" />
             </button>
           </div>
        ) : (
          <Link className="flex items-center justify-center gap-2 w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium transition-colors" to="/login">
              {isSidebarCollapsed ? <LogOutIcon className="w-5 h-5 rotate-180" /> : "Увійти"}
          </Link>
        )}
      </div>

      {!isSidebarCollapsed && (
        <div 
          className="absolute right-0 top-0 bottom-0 w-2 -mr-1 cursor-col-resize hover:bg-blue-500/50 transition-colors z-50"
          onMouseDown={startResizing}
        />
      )}
    </aside>
  );
};

export default Sidebar;