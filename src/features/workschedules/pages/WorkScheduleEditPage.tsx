// src/features/workschedules/pages/WorkScheduleEditPage.tsx

import { useParams, useNavigate } from "@tanstack/react-router";
import { useWorkSchedule, useUpdateWorkSchedule } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
// Імпортуємо хуки для списків
import { useShifts } from "../../shifts/api";
import { useEmployees } from "../../employees/api";

// 👇 ІМПОРТУЄМО СХЕМУ
import type { WorkScheduleFormValues } from "../schema";
import { workScheduleSchema } from "../schema";

// ==========================================
// COMPONENT
// ==========================================
export const WorkScheduleEditPage = () => {
  // Отримуємо ID з URL
  const { ws_id } = useParams({ from: "/workschedules/edit/$ws_id" });
  
  const navigate = useNavigate();
  
  const scheduleId = Number(ws_id);

  // 2. ДАНІ
  // Отримуємо поточний запис
  const { data: schedule, isLoading, isError } = useWorkSchedule(scheduleId);
  
  // Отримуємо списки для селектів
  const { data: shifts, isLoading: isShiftsLoading } = useShifts();
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

  const updateMutation = useUpdateWorkSchedule();
  
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<WorkScheduleFormValues>({
    // 👇 FIX: Добавляем 'as any', чтобы убрать ошибку типов из-за preprocess
    resolver: zodResolver(workScheduleSchema) as any,
  });

  // 3. ЗАПОВНЕННЯ ПОЛІВ
  useEffect(() => {
    if (schedule) {
      reset({
        ws_date: schedule.ws_date,
        sh_id: schedule.sh_id,
        e_id: schedule.e_id,
      });
    }
  }, [schedule, reset]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: WorkScheduleFormValues) => {
    clearErrors();

    updateMutation.mutate(
      {
        id: scheduleId,
        data: data,
      },
      {
        onSuccess: () => {
          alert("Запис у графіку оновлено успішно!");
          navigate({ to: "/workschedules" });
        },
        onError: (error) => {
          const generalError = handleServerErrors(error, setError);
          if (generalError) {
            alert(generalError);
          }
        },
      }
    );
  };

  if (isLoading) return <div className="h-full flex items-center justify-center text-gray-500">Завантаження...</div>;
  if (isError || !schedule) return <div className="h-full flex items-center justify-center text-red-500">Помилка: запис не знайдено.</div>;

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування запису (ID: {schedule.ws_id})
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Дата */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Дата</label>
          <input
            type="date"
            {...register("ws_date")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
              errors.ws_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.ws_date && (
            <p className="text-red-600 text-xs mt-1">{errors.ws_date.message}</p>
          )}
        </div>

        {/* Зміна */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Зміна</label>
          <select
            {...register("sh_id", { valueAsNumber: true })}
            disabled={isShiftsLoading}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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

        {/* Працівник */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Працівник</label>
          <select
            {...register("e_id", { valueAsNumber: true })}
            disabled={isEmployeesLoading}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/workschedules" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};