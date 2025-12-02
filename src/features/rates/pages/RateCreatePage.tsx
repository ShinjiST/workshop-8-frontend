import { useEffect, useState } from "react"; // 👈 ПОВЕРНУТО useState
import { Link, useNavigate } from "@tanstack/react-router";
// 👈 Хук для Тарифу
import { useCreateRate } from "../api"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'; 

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
// 👈 Схема та типи Тарифу
import type { RateFormValues } from "../schema";
import { rateSchema } from "../schema"; 

// ==========================================
// ZUSTAND STORE (для чернетки форми Тарифу)
// ==========================================
interface RateFormState {
  lastFormData?: RateFormValues;
  setLastFormData: (data: RateFormValues) => void;
  clearFormData: () => void;
}

export const useRateFormStore = create<RateFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'rate-create-storage' } // Унікальне ім'я для LocalStorage
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const RateCreatePage = () => {
  const navigate = useNavigate(); 
  const createMutation = useCreateRate(); 

  // 👈 ПОВЕРНУТО: mounted стан
  const [mounted, setMounted] = useState(false); 

  const { lastFormData, setLastFormData, clearFormData } = useRateFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch, 
  } = useForm<RateFormValues>({
    resolver: zodResolver(rateSchema) as any, 
    defaultValues: lastFormData || { 
        r_auto_type: undefined,
        r_parking_space_type: undefined,
        r_price_per_day: undefined, 
        r_date: "",
    } as any,
  });

  // МАГІЯ ТУТ: Слідкуємо за формою і зберігаємо в Zustand при кожній зміні
  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as RateFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  // 👈 ПОВЕРНУТО: useEffect для mounted
  useEffect(() => {
    setMounted(true);
  }, []);


  const onSubmit = (data: RateFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Тариф успішно створено!");
        clearFormData(); 
        navigate({ to: "/rates" as any }); // 👈 Перенаправлення на список Тарифів
      },
      onError: (error) => {
        const generalError = handleServerErrors(error, setError);
        if (generalError) {
          alert(generalError);
        }
      },
    });
  };

  return (
    // 💡 ПОВЕРНУТО СТИЛІ ЕТАЛОНУ (ParkingZone): h-full, justify-center, max-w-md
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Створення нового тарифу
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        // 💡 ПОВЕРНУТО ШИРИНУ: max-w-md
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
      >
        
        {/* Рядок 1: Тип авто та Тип паркомісця (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Тип авто */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип авто</label>
              <select
                {...register("r_auto_type")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.r_auto_type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Оберіть тип авто</option>
                <option value="Легкове">Легкове</option>
                <option value="Вантажне">Вантажне</option>
                <option value="Електрокар">Електрокар</option>
                <option value="Мотоцикл">Мотоцикл</option>
              </select>
              {errors.r_auto_type && (
                <p className="text-red-600 text-xs mt-1">{errors.r_auto_type.message}</p>
              )}
            </div>

            {/* Тип паркомісця */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип паркомісця</label>
              <select
                {...register("r_parking_space_type")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.r_parking_space_type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Оберіть тип</option>
                <option value="Звичайне">Звичайне</option>
                <option value="Преміум">Преміум</option>
                <option value="Критий">Критий</option>
                <option value="Відкритий">Відкритий</option>
              </select>
              {errors.r_parking_space_type && (
                <p className="text-red-600 text-xs mt-1">{errors.r_parking_space_type.message}</p>
              )}
            </div>
        </div>
        
        {/* Рядок 2: Ціна та Дата (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Ціна за добу */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Ціна за добу (₴)</label>
              <input
                type="number"
                {...register("r_price_per_day", { valueAsNumber: true })} 
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.r_price_per_day ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть ціну, напр. 150.00"
                step="0.01"
              />
              {errors.r_price_per_day && (
                <p className="text-red-600 text-xs mt-1">{errors.r_price_per_day.message}</p>
              )}
            </div>

            {/* Дата (Створення/Активності) */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Дата активації/створення</label>
              <input
                type="date"
                {...register("r_date")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.r_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.r_date && (
                <p className="text-red-600 text-xs mt-1">{errors.r_date.message}</p>
              )}
            </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Створення..." : "Створити тариф"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/rates">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};