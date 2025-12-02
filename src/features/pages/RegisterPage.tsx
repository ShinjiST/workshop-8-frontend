// src/features/pages/RegisterPage.tsx
import { Link } from '@tanstack/react-router';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRegister } from '@/features/auth/api';
import type { RegisterCredentials } from '@/features/auth/types';

// Схема валідації
const registerSchema = z.object({
  email: z.string().email("Некоректний email"),
  username: z.string().min(3, "Мінімум 3 символи"),
  name: z.string().min(2, "Введіть повне ім'я"),
  password: z.string().min(6, "Пароль має бути мінімум 6 символів"),
  passwordConfirm: z.string().min(1, "Підтвердіть пароль"),
}).refine((data) => data.password === data.passwordConfirm, {
  message: "Паролі не співпадають",
  path: ["passwordConfirm"],
});

export function RegisterPage() {
  const { mutate: registerUser, isPending } = useRegister();
  
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterCredentials>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = (data: RegisterCredentials) => {
    registerUser(data);
  };

  return (
    <div className="flex w-full h-full items-center justify-center bg-white overflow-hidden p-4">
      <div className="flex flex-col items-center">
        <form 
          className="w-full max-w-md p-6 bg-white rounded-3xl shadow-xl space-y-4" 
          onSubmit={handleSubmit(onSubmit)}
        >
          {/* Заголовок */}
          <h2 className="text-2xl mb-6 font-bold text-center text-gray-800">
            <span className="text-indigo-600">Park</span>
            <span className="text-blue-500">Go</span> Реєстрація
          </h2>
          
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">Email</label>
            <input 
              id="email"
              {...register('email')} 
              autoComplete="email"
              className="w-full border-gray-300 border p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-base" 
              placeholder="user@gmail.com" 
              type="email"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
          </div>

          <div className="flex space-x-4">
            {/* Username */}
            <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="username">Username (Логін)</label>
                <input 
                    id="username"
                    {...register('username')} 
                    autoComplete="username" 
                    className="w-full border-gray-300 border p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-base" 
                    placeholder="Edward" 
                />
                {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
            </div>

            {/* Name */}
            <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">Повне ім'я</label>
                <input 
                    id="name"
                    {...register('name')} 
                    autoComplete="off"
                    className="w-full border-gray-300 border p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-base" 
                    placeholder="Edward Cullen" 
                />
                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
          </div>

          {/* Паролі */}
          <div className="flex space-x-4">
            {/* Password */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">Пароль</label>
              <input 
                id="password"
                type="password" 
                {...register('password')} 
                autoComplete="new-password"
                className="w-full border-gray-300 border p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-base" 
                placeholder="********"
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Password Confirm */}
            <div className="w-1/2">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="passwordConfirm">Підтвердження</label>
              <input 
                id="passwordConfirm"
                type="password" 
                {...register('passwordConfirm')} 
                autoComplete="off" 
                className="w-full border-gray-300 border p-3 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 shadow-sm transition duration-150 ease-in-out text-base" 
                placeholder="********"
              />
              {errors.passwordConfirm && <p className="text-red-500 text-xs mt-1">{errors.passwordConfirm.message}</p>}
            </div>
          </div>
          
          <button 
            className="w-full bg-violet-600 text-white py-3 rounded-xl hover:bg-violet-700 disabled:opacity-50 shadow-lg font-semibold transition duration-200 flex items-center justify-center text-base mt-4" 
            disabled={isPending}
            type="submit"
          >
            {isPending ? (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" fill="currentColor"></path>
              </svg>
            ) : (
              'Створити акаунт'
            )}
          </button>
        </form>

        {/* Посилання на Вхід */}
        <Link 
          className="mt-4 text-sm font-medium text-gray-600 hover:text-indigo-600 transition duration-150" 
          to="/login"
        >
          Вже є акаунт? <span className="font-semibold underline">Увійти</span>
        </Link>
      </div>
    </div>
  );
}