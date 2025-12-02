import { createFileRoute } from '@tanstack/react-router';
import { HelpCircle, ChevronDown, MessageCircle } from "lucide-react";
import { useState } from 'react';

export const Route = createFileRoute('/faq')({
  component: FAQPage,
});

// 👇 Оновлений список питань (без шлагбаума)
const faqData = [
  {
    question: "Як створити новий договір для клієнта?",
    answer: "Перейдіть до розділу 'Операції' -> 'Договори'. Натисніть кнопку 'Створити', оберіть клієнта, авто та вільне паркомісце. Система автоматично розрахує вартість."
  },
  {
    question: "Як змінити тарифний план?",
    answer: "Тарифи можуть змінювати лише користувачі з рівнем доступу 'Administrator'. Перейдіть у 'Парковка' -> 'Тарифи' та створіть новий запис. Старі тарифи залишаються в історії."
  },
  {
    question: "Як зафіксувати інцидент (ДТП на парковці)?",
    answer: "Негайно перейдіть у 'Операції' -> 'Інциденти'. Створіть новий запис та додайте детальний опис ситуації. Сповістіть охорону."
  },
  {
    question: "Де подивитися мій графік змін?",
    answer: "Ваш розклад доступний у розділі 'Графік' -> 'Розклад'. Там відображаються ваші зміни на поточний місяць."
  }
];

function FAQItem({ item }: { item: { question: string, answer: string } }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-200 rounded-xl overflow-hidden bg-white transition-all duration-300 hover:shadow-md">
      <button 
        className="w-full flex justify-between items-center p-5 text-left bg-white hover:bg-gray-50 transition-colors"
        onClick={() => { setIsOpen(!isOpen); }}
      >
        <span className="font-semibold text-gray-800 text-lg">{item.question}</span>
        <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {/* Анімація розкриття */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="p-5 pt-0 text-gray-600 bg-gray-50/50 border-t border-gray-100">
          {item.answer}
        </div>
      </div>
    </div>
  );
}

function FAQPage() {
  return (
    <div className="p-8 w-full min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-full mb-4">
            <HelpCircle className="w-8 h-8 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900">Часті запитання (FAQ)</h1>
          <p className="mt-4 text-lg text-gray-600">
            Знайдіть відповіді на найпопулярніші питання щодо роботи з системою ParkGo.
          </p>
        </div>

        <div className="space-y-4">
          {faqData.map((item, index) => (
            <FAQItem key={index} item={item} />
          ))}
        </div>

        <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <MessageCircle className="w-8 h-8 text-blue-600" />
            <div>
              <h3 className="text-lg font-bold text-blue-900">Не знайшли відповіді?</h3>
              <p className="text-blue-700">Зв'яжіться з технічною підтримкою.</p>
            </div>
          </div>
          <button className="px-6 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition">
            Написати в підтримку
          </button>
        </div>
      </div>
    </div>
  );
}