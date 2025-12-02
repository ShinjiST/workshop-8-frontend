// src/features/workschedules/pages/WorkScheduleCreatePage.tsx

import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateWorkSchedule } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

// Утиліта помилок
import { handleServerErrors } from "../../../components/utils/formErrors";

// Імпортуємо схему
import type { WorkScheduleFormValues } from "../schema";
import { workScheduleSchema } from "../schema";

// Імпортуємо хуки для отримання списків (Зміни та Працівники)
import { useShifts } from "../../shifts/api";
import { useEmployees } from "../../employees/api"; 

// ==========================================
// ZUSTAND STORE (Збереження чернетки)
// ==========================================
interface WorkScheduleFormState {
  lastFormData?: WorkScheduleFormValues;
  setLastFormData: (data: WorkScheduleFormValues) => void;
  clearFormData: () => void;
}

export const useWorkScheduleFormStore = create<WorkScheduleFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'work-schedule-create-storage' } // Унікальне ім'я для LocalStorage
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const WorkScheduleCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateWorkSchedule();
  
  // Завантажуємо списки для селектів
  const { data: shifts, isLoading: isShiftsLoading } = useShifts();
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

  const [mounted, setMounted] = useState(false);
  
  // Дістаємо функції стору
  const { lastFormData, setLastFormData, clearFormData } = useWorkScheduleFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<WorkScheduleFormValues>({
    // 👇 FIX: Додаємо 'as any', щоб TypeScript не сварився на складні типи preprocess
    resolver: zodResolver(workScheduleSchema) as any, 
    defaultValues: lastFormData || {
      ws_date: "",
      sh_id: undefined,
      e_id: undefined,
    } as any,
  });

  // Слідкуємо за формою і зберігаємо в Zustand
  useEffect(() => {
    const subscription = watch((value) => {
      // Приводимо до типу, бо watch повертає Partial
      setLastFormData(value as WorkScheduleFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: WorkScheduleFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Графік успішно створено!");
        clearFormData();
        navigate({ to: "/workschedules" });
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
        Створення нового запису в графіку
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Дата */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Дата зміни</label>
          <input
            type="date"
            {...register("ws_date")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.ws_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.ws_date && (
            <p className="text-red-600 text-xs mt-1">{errors.ws_date.message}</p>
          )}
        </div>

        {/* Вибір Зміни */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Зміна</label>
          <select
            {...register("sh_id", { valueAsNumber: true })}
            disabled={isShiftsLoading}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.sh_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Оберіть зміну</option>
            {isShiftsLoading && <option disabled>Завантаження змін...</option>}
            
            {shifts?.map((shift: any) => (
              <option key={shift.sh_id} value={shift.sh_id}>
                {shift.sh_name} ({shift.sh_start_time} - {shift.sh_end_time})
              </option>
            ))}
          </select>
          {errors.sh_id && (
            <p className="text-red-600 text-xs mt-1">{errors.sh_id.message}</p>
          )}
        </div>

        {/* Вибір Працівника */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Працівник</label>
          <select
            {...register("e_id", { valueAsNumber: true })}
            disabled={isEmployeesLoading}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.e_id ? 'border-red-500' : 'border-gray-300'
            }`}
          >
            <option value="">Оберіть працівника</option>
            {isEmployeesLoading && <option disabled>Завантаження працівників...</option>}
            
            {employees?.map((employee: any) => (
              <option key={employee.e_id} value={employee.e_id}>
                {employee.e_full_name} ({employee.e_position})
              </option>
            ))}
          </select>
          {errors.e_id && (
            <p className="text-red-600 text-xs mt-1">{errors.e_id.message}</p>
          )}
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Створення..." : "Додати в графік"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/workschedules">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};