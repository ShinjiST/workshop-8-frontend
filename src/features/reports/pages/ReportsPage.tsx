import { 
  TrendingUp, Users, DollarSign, 
  Car, AlertTriangle, Calendar 
} from "lucide-react";

// --- MOCK DATA (Імітація даних, які прийдуть з бекенду) ---

// KPI Картки (SQL: COUNT(*) з Agreement, SUM(ch_amount) з Checkout)
const kpiStats = [
  { title: "Загальна виручка (Місяць)", value: "452,500 ₴", trend: "+12.5%", icon: DollarSign, color: "text-green-600", bg: "bg-green-100" },
  { title: "Активні паркування", value: "124", trend: "-5%", icon: Car, color: "text-blue-600", bg: "bg-blue-100" },
  { title: "Завантаженість паркінгу", value: "85%", trend: "+2%", icon: TrendingUp, color: "text-violet-600", bg: "bg-violet-100" },
  { title: "Активні інциденти", value: "3", trend: "0%", icon: AlertTriangle, color: "text-red-600", bg: "bg-red-100" },
];

// Таблиця 1: Ефективність Зон (SQL: JOIN Parking_Space -> Agreement -> Rate)
const zonePerformance = [
  { id: 1, name: "Сектор A (VIP)", capacity: 50, occupied: 45, revenue: "120,000 ₴", status: "High" },
  { id: 2, name: "Сектор B (Загальний)", capacity: 150, occupied: 110, revenue: "180,000 ₴", status: "Medium" },
  { id: 3, name: "Сектор C (Критий)", capacity: 80, occupied: 78, revenue: "152,500 ₴", status: "Critical" },
];

// Таблиця 2: Топ Співробітників (SQL: COUNT(Checkout) per Employee)
const topEmployees = [
  { id: 1, name: "Олександр Петренко", position: "Касир", checkouts: 342, totalSales: "85,400 ₴" },
  { id: 2, name: "Марія Іваненко", position: "Адміністратор", checkouts: 215, totalSales: "62,100 ₴" },
  { id: 3, name: "Іван Сидоренко", position: "Охоронець", checkouts: 12, totalSales: "0 ₴" }, // Охоронець може не робити чекаути
];

// --- COMPONENTS ---

export const ReportsPage = () => {
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      
      {/* Заголовок */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Аналітика та Звіти</h1>
          <p className="text-gray-500 mt-1">Огляд ключових показників ефективності (KPI) за поточний місяць.</p>
        </div>
        <button className="flex items-center gap-2 bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition">
          <Calendar className="w-4 h-4" />
          <span>Цей місяць</span>
        </button>
      </div>

      {/* 1. БЛОК KPI КАРТОК */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpiStats.map((stat, index) => (
          <div key={index} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <span className={`text-xs font-medium ${stat.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'} flex items-center mt-2`}>
                {stat.trend} <span className="text-gray-400 ml-1">від минулого міс.</span>
              </span>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* 2. ТАБЛИЦЯ: ЕФЕКТИВНІСТЬ ЗОН */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Ефективність Паркувальних Зон</h3>
            <span className="text-indigo-600 text-sm font-medium cursor-pointer hover:underline">Детальніше</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-600">
              <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
                <tr>
                  <th className="p-4">Назва Зони</th>
                  <th className="p-4">Заповненість</th>
                  <th className="p-4">Виручка</th>
                  <th className="p-4">Статус</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {zonePerformance.map((zone) => {
                  const percentage = Math.round((zone.occupied / zone.capacity) * 100);
                  return (
                    <tr key={zone.id} className="hover:bg-gray-50 transition">
                      <td className="p-4 font-medium text-gray-900">{zone.name}</td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-24 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${percentage > 90 ? 'bg-red-500' : 'bg-green-500'}`} 
                              style={{ width: `${percentage}%` }}
                            ></div>
                          </div>
                          <span className="text-xs">{percentage}%</span>
                        </div>
                        <span className="text-xs text-gray-400">{zone.occupied}/{zone.capacity} місць</span>
                      </td>
                      <td className="p-4 font-bold text-gray-800">{zone.revenue}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium 
                          ${zone.status === 'Critical' ? 'bg-red-100 text-red-700' : 
                            zone.status === 'High' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {zone.status === 'Critical' ? 'Переповнено' : 'Норма'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 3. ТАБЛИЦЯ: ТОП СПІВРОБІТНИКІВ */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Топ Співробітників (KPI)</h3>
            <Users className="w-5 h-5 text-gray-400" />
          </div>
          <table className="w-full text-left text-sm text-gray-600">
            <thead className="bg-gray-50 text-gray-900 font-semibold border-b">
              <tr>
                <th className="p-4">Співробітник</th>
                <th className="p-4">Посада</th>
                <th className="p-4 text-center">Оформлень</th>
                <th className="p-4 text-right">Сума продажів</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {topEmployees.map((emp) => (
                <tr key={emp.id} className="hover:bg-gray-50 transition">
                  <td className="p-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-xs">
                      {emp.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="font-medium text-gray-900">{emp.name}</span>
                  </td>
                  <td className="p-4 text-gray-500">{emp.position}</td>
                  <td className="p-4 text-center font-bold text-indigo-600">{emp.checkouts}</td>
                  <td className="p-4 text-right font-medium text-gray-900">{emp.totalSales}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
};