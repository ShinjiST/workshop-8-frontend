import { Link } from "@tanstack/react-router";
import { 
  Users, MapPin, Briefcase, ShieldCheck, FileText,
  Activity, HelpCircle, Book 
} from "lucide-react"; 

// Типи для карток
type EntityLink = {
  label: string;
  path: string;
  tableName: string;
  description: string;
};

type WorkspaceModule = {
  title: string;
  icon: React.ElementType;
  colorClass: string;
  iconColor: string;
  items: Array<EntityLink>;
};

export const WorkspacePage = () => {
  
  // Конфігурація модулів
  const modules: Array<WorkspaceModule> = [
    {
      title: "Клієнти та Транспорт",
      icon: Users,
      colorClass: "border-blue-200 bg-blue-50 hover:border-blue-400",
      iconColor: "text-blue-600",
      items: [
        { label: "Клієнти", path: "/clients", tableName: "Client", description: "База клієнтів: контакти, ПІБ." },
        { label: "Автомобілі", path: "/autos", tableName: "Auto", description: "Транспорт: держ. номери, марки, кольори." },
      ]
    },
    {
      title: "Інфраструктура Паркінгу",
      icon: MapPin,
      colorClass: "border-emerald-200 bg-emerald-50 hover:border-emerald-400",
      iconColor: "text-emerald-600",
      items: [
        { label: "Паркувальні Зони", path: "/parkingzones", tableName: "Parking_Zone", description: "Сектори паркінгу та їх місткість." },
        { label: "Паркомісця", path: "/parkingspaces", tableName: "Parking_Space", description: "Статуси місць, рівні та типи авто." },
      ]
    },
    {
      title: "Персонал та Зміни",
      icon: Briefcase,
      colorClass: "border-violet-200 bg-violet-50 hover:border-violet-400",
      iconColor: "text-violet-600",
      items: [
        { label: "Співробітники", path: "/employees", tableName: "Employee", description: "Штат, зарплати, посади." },
        { label: "Зміни (Shifts)", path: "/shifts", tableName: "Shift", description: "Часові проміжки роботи паркінгу." },
        { label: "Графік роботи", path: "/workschedules", tableName: "Work-Schedule", description: "Розподіл працівників по змінах." },
      ]
    },
    {
      title: "Фінанси та Угоди",
      icon: FileText,
      colorClass: "border-amber-200 bg-amber-50 hover:border-amber-400",
      iconColor: "text-amber-600",
      items: [
        { label: "Договори (Agreements)", path: "/agreements", tableName: "Agreement", description: "Оренда місць, терміни, суми." },
        { label: "Тарифи", path: "/rates", tableName: "Rate", description: "Ціни залежно від типу авто/місця." },
        { label: "Чек-аут (Checkout)", path: "/checkouts", tableName: "Checkout", description: "Фіксація виїзду та фінальних оплат." },
      ]
    },
    {
      title: "Безпека та Сервіс",
      icon: ShieldCheck,
      colorClass: "border-rose-200 bg-rose-50 hover:border-rose-400",
      iconColor: "text-rose-600",
      items: [
        { label: "Інциденти", path: "/incidents", tableName: "Incident", description: "ДТП, порушення правил, скарги." },
        { label: "Обслуговування", path: "/maintenances", tableName: "Maintenance", description: "Ремонтні роботи та витрати." },
      ]
    },
  ];

  return (
    <div className="p-8 w-full min-h-screen bg-gray-50 flex flex-col">
      
      {/* Основний контент */}
      <div className="flex-grow">
        {/* Заголовок сторінки */}
        <div className="mb-10">
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
            Робоча Область <span className="text-indigo-600">ParkGo</span>
          </h1>
          <p className="mt-2 text-lg text-gray-600">
            Центр керування базою даних. Оберіть таблицю для адміністрування.
          </p>
        </div>

        {/* 🛠️ ЗМІНА ТУТ: Використовуємо Flexbox замість Grid для центрування 
            justify-center - центрує блоки в ряду
            gap-8 - відступи
        */}
        <div className="flex flex-wrap justify-center gap-8">
          {modules.map((module, index) => (
            <div 
              key={index} 
              // 📐 Розрахунок ширини блоків:
              // w-full -> мобільні (1 колонка)
              // lg:w-[calc(50%-1rem)] -> планшети (2 колонки)
              // xl:w-[calc(33.33%-1.34rem)] -> десктоп (3 колонки)
              className={`w-full lg:w-[calc(50%-1rem)] xl:w-[calc(33.33%-1.34rem)] rounded-xl border-2 p-6 transition-all duration-300 ${module.colorClass} shadow-sm hover:shadow-md`}
            >
              {/* Заголовок групи */}
              <div className="flex items-center gap-3 mb-6 border-b border-gray-200/50 pb-4">
                <module.icon className={`w-8 h-8 ${module.iconColor}`} />
                <h2 className="text-xl font-bold text-gray-800">{module.title}</h2>
              </div>

              {/* Список посилань */}
              <div className="space-y-4">
                {module.items.map((item, index) => (
                  <Link 
                    key={index}
                    className="group block bg-white p-4 rounded-xl border border-gray-200 hover:border-indigo-400 hover:ring-2 hover:ring-indigo-100 transition-all cursor-pointer"
                    to={item.path}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-bold text-gray-900 group-hover:text-indigo-700 transition-colors">
                        {item.label}
                      </span>
                      <span className="text-xs font-mono bg-gray-100 text-gray-500 px-2 py-1 rounded">
                        {item.tableName}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 group-hover:text-gray-700">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Футер */}
      <footer className="mt-20 border-t border-gray-200 pt-8 pb-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-gray-500">
          
          <div className="flex items-center gap-2">
            <span className="font-semibold text-gray-700">© 2025 ParkGo System</span>
            <span className="text-gray-300">|</span>
            <span>v2.4.0 (Stable)</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full">
              <Activity className="w-3 h-3" />
              <span className="text-xs font-medium">Система активна</span>
            </div>
            
            <div className="flex items-center gap-4">
               {/* Посилання на Базу Знань (замість Статус БД) */}
               <Link 
                 className="hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer" 
                 to="/knowledge-base"
               >
                  <Book className="w-4 h-4" />
                  <span>База знань</span>
               </Link>

               {/* Посилання на Допомога (FAQ) */}
               <Link 
                 className="hover:text-indigo-600 transition flex items-center gap-1 cursor-pointer" 
                 to="/faq"
               >
                  <HelpCircle className="w-4 h-4" />
                  <span>Допомога</span>
               </Link>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};