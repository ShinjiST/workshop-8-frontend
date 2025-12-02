// src/features/pages/LoginPage.tsx
import { Link } from '@tanstack/react-router'; 
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useLogin } from '@/features/auth/api';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export function LoginPage() {
  const { mutate: login, isPending, error } = useLogin();
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(loginSchema),
  });

  return (
    // Фінальний контейнер: h-full для центрування, bg-white для злиття з основним фоном
    <div className="flex w-full h-full items-center justify-center bg-white overflow-hidden p-6">
      <div className="flex flex-col items-center">
        <form 
          onSubmit={handleSubmit((data: any) => login(data))} 
          // Зменшено shadow-2xl до shadow-xl та прибрано border
          className="w-full max-w-md p-10 bg-white rounded-3xl shadow-xl"
        >
          {/* Заголовок */}
          <h2 className="text-3xl mb-10 font-bold text-center text-gray-800">
            <span className="text-indigo-600">Park</span>
            <span className="text-blue-500">Go</span> Вхід
          </h2>
          
          {error && (
            <div className="mb-4 flex items-center p-3 text-red-700 bg-red-100 rounded-lg border border-red-200">
              <svg className="w-5 h-5 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path clipRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" fillRule="evenodd"></path></svg>
              <span className="text-sm font-medium">Помилка входу. Перевір дані.</span>
            </div>
          )}

          <div className="mb-5">
            <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input 
              id="email"
              {...register('email')} 
              className="w-full border-gray-300 border p-4 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-lg" 
              placeholder="введіть email"
              type="email"
            />
          </div>

          <div className="mb-6">
            <label className="block text-base font-medium text-gray-700 mb-1" htmlFor="password">Пароль</label>
            <input 
              id="password"
              type="password" 
              {...register('password')} 
              className="w-full border-gray-300 border p-4 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-lg" 
              placeholder="********"
            />
          </div>

          <button 
            className="w-full bg-violet-600 text-white py-4 rounded-xl hover:bg-violet-700 disabled:opacity-50 shadow-lg font-semibold transition duration-200 flex items-center justify-center text-lg" 
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
              </svg>
            ) : (
              'Увійти'
            )}
          </button>
        </form>
        
        {/* Посилання на Реєстрацію */}
        <Link 
          className="mt-6 text-base font-medium text-gray-600 hover:text-indigo-600 transition duration-150" 
          to="/register"
        >
          Немає акаунту? <span className="font-semibold underline">Зареєструватися</span>
        </Link>
      </div>
    </div>
  );
}