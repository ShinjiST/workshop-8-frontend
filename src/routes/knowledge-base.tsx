import { createFileRoute } from '@tanstack/react-router';
import { Book, FileText, Shield, Terminal, ArrowRight } from "lucide-react";

export const Route = createFileRoute('/knowledge-base')({
  component: KnowledgeBasePage,
});

const categories = [
  {
    title: "Початок роботи",
    icon: Book,
    description: "Інструкції для нових співробітників, налаштування облікового запису.",
    articles: ["Вхід в систему", "Огляд інтерфейсу", "Правила безпеки"]
  },
  {
    title: "Робота з Клієнтами",
    icon: FileText,
    description: "Оформлення договорів, прийом оплати, вирішення конфліктів.",
    articles: ["Створення договору", "Чек-аут клієнта", "Робота з боржниками"]
  },
  {
    title: "Технічна частина",
    icon: Terminal,
    description: "Робота з обладнанням, шлагбаумами та камерами.",
    articles: ["Перезавантаження системи", "Калібрування камер", "Дії при збої"]
  },
  {
    title: "Регламенти",
    icon: Shield,
    description: "Внутрішні правила компанії та посадові інструкції.",
    articles: ["Графік змін", "Штрафні санкції", "Кодекс етики"]
  }
];

function KnowledgeBasePage() {
  return (
    <div className="p-8 w-full min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900">База Знань та Допомога</h1>
          <p className="mt-2 text-gray-600">Офіційна документація та інструкції для персоналу ParkGo.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {categories.map((cat, index) => (
            <div key={index} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-indigo-50 rounded-lg">
                  <cat.icon className="w-8 h-8 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800">{cat.title}</h2>
                  <p className="text-sm text-gray-500">{cat.description}</p>
                </div>
              </div>
              
              <ul className="space-y-3">
                {cat.articles.map((article, index) => (
                  <li key={index}>
                    <button className="flex items-center text-gray-700 hover:text-indigo-600 transition group w-full text-left">
                      <span className="w-1.5 h-1.5 bg-gray-300 rounded-full mr-3 group-hover:bg-indigo-500 transition-colors"></span>
                      {article}
                    </button>
                  </li>
                ))}
              </ul>
              
              <button className="mt-6 flex items-center text-sm font-bold text-indigo-600 hover:text-indigo-800 transition">
                Переглянути розділ <ArrowRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}