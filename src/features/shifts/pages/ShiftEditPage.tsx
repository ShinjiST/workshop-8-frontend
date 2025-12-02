// src/features/shifts/pages/ShiftEditPage.tsx

import { useParams, useNavigate } from "@tanstack/react-router";
import { useShift, useUpdateShift } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
// 👇 ІМПОРТУЄМО СХЕМУ ДЛЯ ЗМІНИ
import type { ShiftFormValues } from "../schema";
import { shiftSchema } from "../schema";

// ==========================================
// COMPONENT
// ==========================================
export const ShiftEditPage = () => {
  // Отримуємо ID з роута
  const { sh_id } = useParams({ from: "/shifts/edit/$sh_id" });
  
  const navigate = useNavigate();
  
  const shiftId = Number(sh_id);

  // 2. ДАНІ
  const { data: shift, isLoading, isError } = useShift(shiftId);
  const updateMutation = useUpdateShift();
  
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<ShiftFormValues>({
    resolver: zodResolver(shiftSchema),
  });

  // 3. ЗАПОВНЕННЯ ПОЛІВ
  useEffect(() => {
    if (shift) {
      reset({
        sh_name: shift.sh_name,
        sh_start_time: shift.sh_start_time,
        sh_end_time: shift.sh_end_time,
        sh_status: shift.sh_status,
      });
    }
  }, [shift, reset]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: ShiftFormValues) => {
    clearErrors();

    updateMutation.mutate(
      {
        id: shiftId,
        data: data,
      },
      {
        onSuccess: () => {
          alert("Дані зміни оновлено успішно!");
          navigate({ to: "/shifts" });
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
  if (isError || !shift) return <div className="h-full flex items-center justify-center text-red-500">Помилка: зміну не знайдено.</div>;

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування зміни: {shift.sh_name}
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
            placeholder="Напр. Ранкова, Нічна"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
            type="time"
            {...register("sh_start_time")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/shifts" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};