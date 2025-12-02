// src/features/autos/pages/AutoCreatePage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateAuto } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { AutoFormValues } from "../schema";
import { autoSchema } from "../schema";

// ==========================================
// ZUSTAND STORE
// ==========================================
interface AutoFormState {
  lastFormData?: AutoFormValues;
  setLastFormData: (data: AutoFormValues) => void;
  clearFormData: () => void;
}

export const useAutoFormStore = create<AutoFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'auto-create-storage' }
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const AutoCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateAuto();

  
  const { lastFormData, setLastFormData, clearFormData } = useAutoFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<AutoFormValues>({
    resolver: zodResolver(autoSchema) as any,
    defaultValues: lastFormData || {
      at_license_plate: "",
      at_brand: "",
      at_model: "",
      at_color: "",
      at_type: undefined,
    } as any,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as AutoFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);


  const onSubmit = (data: AutoFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Автомобіль успішно зареєстровано!");
        clearFormData();
        navigate({ to: "/autos" as any });
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
    <div className="h-full w-full flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Реєстрація нового автомобіля
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Рядок 1: Номерний знак (на всю ширину) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Номерний знак</label>
          <input
            type="text"
            {...register("at_license_plate")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.at_license_plate ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Напр., AA0000AA"
          />
          {errors.at_license_plate && (
            <p className="text-red-600 text-xs mt-1">{errors.at_license_plate.message}</p>
          )}
        </div>

        {/* Рядок 2: Бренд та Модель (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Бренд */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Бренд</label>
              <input
                type="text"
                {...register("at_brand")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.at_brand ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., Toyota"
              />
              {errors.at_brand && (
                <p className="text-red-600 text-xs mt-1">{errors.at_brand.message}</p>
              )}
            </div>

            {/* Модель */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Модель</label>
              <input
                type="text"
                {...register("at_model")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.at_model ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., Camry"
              />
              {errors.at_model && (
                <p className="text-red-600 text-xs mt-1">{errors.at_model.message}</p>
              )}
            </div>
        </div>

        {/* Рядок 3: Колір та Тип (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Колір */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Колір</label>
              <input
                type="text"
                {...register("at_color")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.at_color ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., Чорний"
              />
              {errors.at_color && (
                <p className="text-red-600 text-xs mt-1">{errors.at_color.message}</p>
              )}
            </div>

            {/* Тип авто */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип транспортного засобу</label>
              <select
                {...register("at_type")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.at_type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Оберіть тип</option>
                <option value="Легкове">Легкове</option>
                <option value="Вантажне">Вантажне</option>
                <option value="Електрокар">Електрокар</option>
                <option value="Мотоцикл">Мотоцикл</option>
              </select>
              {errors.at_type && (
                <p className="text-red-600 text-xs mt-1">{errors.at_type.message}</p>
              )}
            </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Реєстрація..." : "Зареєструвати авто"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/autos">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};