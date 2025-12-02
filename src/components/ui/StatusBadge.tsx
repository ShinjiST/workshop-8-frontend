import type React from 'react';

interface StatusBadgeProps {
  status: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status }) => {
  const s = (status || "").toLowerCase();

  // Дефолтный (Серый)
  let colorClass = "bg-gray-100 text-gray-600 border-gray-200";
  let dotColor = "bg-gray-500";

  // 🟢 ЗЕЛЕНЫЙ: 
  // - Парковка: "вільне"
  // - Співробітники: "active", "активна"
  // - Інциденти: "вирішено"
  // - Угоди: "активний"
  // - Виїзд: "вчасно"
  if (['вільне', 'active', 'активна', 'вирішено', 'активний', 'вчасно'].includes(s)) {
    colorClass = "bg-green-100 text-green-700 border-green-200";
    dotColor = "bg-green-600";
  } 
  
  // 🔴 КРАСНЫЙ: 
  // - Парковка: "зайняте"
  // - Співробітники: "inactive", "неактивна"
  // - Інциденти: "закрито", "скасовано"
  // - Виїзд: "пізно"
  else if (['зайняте', 'inactive', 'неактивна', 'закрито', 'скасовано', 'пізно'].includes(s)) {
    colorClass = "bg-red-100 text-red-700 border-red-200";
    dotColor = "bg-red-600";
  } 
  
  // 🟡 ЖЕЛТЫЙ / ПОМАРАНЧЕВИЙ: 
  // - Парковка: "зарезервоване"
  // - Інциденти: "в роботі", "в процесі"
  // - Виїзд: "раніше"
  else if (['зарезервоване', 'в роботі', 'в процесі', 'раніше'].includes(s)) {
    colorClass = "bg-yellow-100 text-yellow-700 border-yellow-200";
    dotColor = "bg-yellow-600";
  }

  // 🔵 СИНИЙ:
  // - Інциденти: "новий"
  else if (['новий'].includes(s)) {
    colorClass = "bg-blue-100 text-blue-700 border-blue-200";
    dotColor = "bg-blue-600";
  }
  
  // ⚫ СЕРЫЙ (Явно): "archived", "архівна", "завершений"
  else if (['archived', 'архівна', 'завершений'].includes(s)) {
     colorClass = "bg-gray-100 text-gray-600 border-gray-200";
     dotColor = "bg-gray-500";
  }

  return (
    <span 
      className={`
        inline-flex items-center justify-center border rounded-full font-medium transition-colors
        px-[0.6em] py-[0.15em] text-[0.85em] 
        ${colorClass}
      `}
    >
      {/* Точка теж масштабується (w-[0.4em]) */}
      <span className={`rounded-full mr-[0.4em] w-[0.4em] h-[0.4em] ${dotColor}`}></span>
      {status}
    </span>
  );
};