import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateShift } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

// Припускаємо, що цей утиліт у вас є (як у прикладі з парковкою)
import { handleServerErrors } from "../../../components/utils/formErrors";
import type { ShiftFormValues } from "../schema";
import { shiftSchema } from "../schema";

// ==========================================
// ZUSTAND STORE (Збереження чернетки форми)
// ==========================================
interface ShiftFormState {
  lastFormData?: ShiftFormValues;
  setLastFormData: (data: ShiftFormValues) => void;
  clearFormData: () => void;
}

export const useShiftFormStore = create<ShiftFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'shift-create-storage' } // 👈 Унікальне ім'я для LocalStorage
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const ShiftCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateShift();
  
  const [mounted, setMounted] = useState(false);
  
  // 👇 Дістаємо функції стору
  const { lastFormData, setLastFormData, clearFormData } = useShiftFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch, // 👈 Потрібно для слідкування за змінами
  } = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
    defaultValues: lastFormData || {
      sh_name: "",
      sh_start_time: "",
      sh_end_time: "",
      sh_status: ""
    },
  });

  // 👇 Слідкуємо за формою і зберігаємо в Zustand при кожній зміні
  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as ShiftFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: ShiftFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Зміну успішно створено!");
        // 👇 Очищаємо чернетку
        clearFormData();
        navigate({ to: "/shifts" });
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
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Створення нової робочої зміни
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Назва зміни */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Назва зміни</label>
          <input
            type="text"
            {...register("sh_name")}
            placeholder="Напр. Ранкова, Нічна, Зміна А"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.sh_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sh_name && (
            <p className="text-red-600 text-xs mt-1">{errors.sh_name.message}</p>
          )}
        </div>

        {/* Час початку */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Час початку</label>
          <input
            type="time" // 👈 HTML5 Time Input ідеально підходить для рядків "HH:mm"
            {...register("sh_start_time")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.sh_start_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sh_start_time && (
            <p className="text-red-600 text-xs mt-1">{errors.sh_start_time.message}</p>
          )}
        </div>

        {/* Час закінчення */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Час закінчення</label>
          <input
            type="time"
            {...register("sh_end_time")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.sh_end_time ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.sh_end_time && (
            <p className="text-red-600 text-xs mt-1">{errors.sh_end_time.message}</p>
          )}
        </div>

        {/* Статус */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
          <select
            {...register("sh_status")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.sh_status ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Оберіть статус</option>
            <option value="active">Активна</option>
            <option value="inactive">Неактивна</option>
            <option value="archived">Архівна</option>
          </select>
          {errors.sh_status && (
            <p className="text-red-600 text-xs mt-1">{errors.sh_status.message}</p>
          )}
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Створення..." : "Створити зміну"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/shifts">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};