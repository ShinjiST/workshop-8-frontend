import { Link } from "@tanstack/react-router"; 
import type { FunctionComponent } from "../common/types";

// Додаємо тип для пропсів SVG-іконок
interface IconProps extends React.SVGProps<SVGSVGElement> {
    className?: string;
}

// Компоненти чистих SVG-іконок (ВИПРАВЛЕНО: тепер приймають пропси)
const PinIcon = (props: IconProps) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ClockIcon = (props: IconProps) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const AuditIcon = (props: IconProps) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const CarIcon = (props: IconProps) => (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M8.25 4.5h7.5A2.25 2.25 0 0 1 18 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-7.5A2.25 2.25 0 0 1 6 17.25V6.75A2.25 2.25 0 0 1 8.25 4.5Z" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

// Компонент головної сторінки
export const Home = (): FunctionComponent => {
    // ВИПРАВЛЕНО: Видалено i18n, оскільки він не використовується.
 
    return (
        <div className="bg-gray-50 w-full min-h-screen flex flex-col items-center p-8 relative overflow-hidden">
            
            {/* 🎨 Декоративний елемент (градієнтна пляма) */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

            {/* 📰 КОНТЕНТ 1: ЗАГОЛОВОК ТА КНОПКИ */}
            <div className="relative z-10 text-center max-w-5xl pt-16 pb-12">
                <h1 className="text-6xl font-extrabold tracking-tight text-gray-900 sm:text-7xl">
                    <span className="text-indigo-600">Park</span><span className="text-blue-500">Go</span>
                </h1>
                
                {/* 🎯 ОНОВЛЕНИЙ ОСНОВНИЙ ОПИС ДЛЯ ПРАЦІВНИКІВ */}
                <p className="mt-4 text-xl font-semibold text-gray-700 max-w-2xl mx-auto">
                    Платформа для ефективного керування, моніторингу та контролю паркувальних зон в режимі реального часу. Ваш інструмент для максимізації ефективності.
                </p>

                <div className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4">
                    <Link
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-violet-600 hover:bg-violet-700 md:py-4 md:text-lg md:px-10 shadow-lg transition duration-200 transform hover:scale-105"
                        to="/workspace"
                    >
                        Перейти до Панелі Керування
                    </Link>
                    <Link
                        className="w-full sm:w-auto flex items-center justify-center px-8 py-3 border border-violet-600 text-base font-medium rounded-full text-violet-600 bg-white hover:bg-violet-50 md:py-4 md:text-lg md:px-10 transition duration-200 transform hover:shadow-md"
                        to="/login"
                    >
                        Вхід для персоналу
                    </Link>
                </div>
            </div>

            {/* --- БЛОК 2: ПЕРЕВАГИ (Зміна тексту) --- */}
            <div className="relative z-10 mt-12 w-full max-w-4xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-8">
                    Чому <span className="text-indigo-600">ParkGo</span> зручний для персоналу?
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                    
                    {/* Перевага 1: Моніторинг */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition duration-300">
                        {/* ВИПРАВЛЕНО: Передаємо className як пропс */}
                        <div className="text-indigo-500 mb-3"><ClockIcon className="w-6 h-6"/></div> 
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Моніторинг у реальному часі</h4>
                        <p className="text-gray-600">Миттєвий огляд зайнятості всіх паркувальних місць та зон без необхідності фізичного обходу.</p>
                    </div>

                    {/* Перевага 2: Контроль */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition duration-300">
                        {/* ВИПРАВЛЕНО: Передаємо className як пропс */}
                        <div className="text-indigo-500 mb-3"><PinIcon className="w-6 h-6"/></div> 
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Точна фіксація порушень</h4>
                        <p className="text-gray-600">Точні дані про перевищення часу паркування та порушення правил для швидкого реагування.</p>
                    </div>

                    {/* Перевага 3: Звітність */}
                    <div className="p-6 bg-white rounded-xl shadow-lg border border-gray-200 transform hover:scale-105 transition duration-300">
                        {/* 👇 ВИКОРИСТОВУЄМО AuditIcon ЗАМІСТЬ DollarIcon */}
                        <div className="text-indigo-500 mb-3"><AuditIcon className="w-6 h-6"/></div> 
                        <h4 className="text-xl font-semibold text-gray-900 mb-2">Прозорість операцій</h4>
                        <p className="text-gray-600">Доступ до історії транзакцій та звітів для фінансового контролю та аудиту.</p>
                    </div> 
                </div>
            </div>
            {/* --- КІНЕЦЬ БЛОКУ ПЕРЕВАГ --- */}
            
            {/* --- БЛОК 3: ЯК ЦЕ ПРАЦЮЄ (Зміна тексту) --- */}
            <div className="relative z-10 mt-20 w-full max-w-4xl">
                <h3 className="text-3xl font-bold text-gray-800 mb-12">
                    Робочий процес адміністратора
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-y-8 md:gap-x-8 items-center text-center">
                    
                    {/* Крок 1: Огляд */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {/* ВИПРАВЛЕНО: Передаємо className як пропс */}
                            <PinIcon className="w-8 h-8 text-white"/>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">1. Огляд зон</h4>
                        <p className="text-sm text-gray-600">
                            Миттєва оцінка поточної зайнятості
                        </p>
                    </div>
                    
                    {/* Стрілка 1 */}
                    <div className="md:col-span-1 hidden md:block">
                        <svg className="w-full h-8 text-gray-300" fill="none" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10H95M95 10L85 5M95 10L85 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                    </div>

                    {/* Крок 2: Фіксація */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-16 h-16 bg-violet-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {/* ВИПРАВЛЕНО: Передаємо className як пропс */}
                            <ClockIcon className="w-8 h-8 text-white"/>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">2. Виявлення порушень</h4>
                        <p className="text-sm text-gray-600">
                            Системна фіксація всіх несанкціонованих дій
                        </p>
                    </div>

                    {/* Стрілка 2 */}
                    <div className="md:col-span-1 hidden md:block">
                        <svg className="w-full h-8 text-gray-300" fill="none" viewBox="0 0 100 20" xmlns="http://www.w3.org/2000/svg">
                            <path d="M5 10H95M95 10L85 5M95 10L85 15" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"/>
                        </svg>
                    </div>

                    {/* Крок 3: Керування */}
                    <div className="md:col-span-1 flex flex-col items-center">
                        <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                            {/* ВИПРАВЛЕНО: Передаємо className як пропс */}
                            <CarIcon className="w-8 h-8 text-white"/>
                        </div>
                        <h4 className="text-xl font-bold text-gray-900 mb-1">3. Керування парковками</h4>
                        <p className="text-sm text-gray-600">
                            Оперативне закриття/відкриття зон та оновлення даних
                        </p>
                    </div>

                </div>
            </div>
            {/* --- КІНЕЦЬ БЛОКУ "ЯК ЦЕ ПРАЦЮЄ" --- */}

        </div>
    );
};