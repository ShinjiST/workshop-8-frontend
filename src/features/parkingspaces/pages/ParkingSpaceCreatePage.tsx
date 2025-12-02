// src/features/parkingspaces/pages/ParkingSpaceCreatePage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateParkingSpace } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

import { handleServerErrors } from "../../../components/utils/formErrors";
import { useParkingZones } from "../../parkingzones/api"; 
import type { ParkingSpaceFormValues } from "../schema";
import { parkingSpaceSchema } from "../schema";

// ==========================================
// ZUSTAND STORE
// ==========================================
interface ParkingSpaceFormState {
  lastFormData?: ParkingSpaceFormValues;
  setLastFormData: (data: ParkingSpaceFormValues) => void;
  clearFormData: () => void;
}

export const useParkingSpaceFormStore = create<ParkingSpaceFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'parking-space-create-storage' }
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const ParkingSpaceCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateParkingSpace();
  const { data: zones, isLoading: isZonesLoading } = useParkingZones();

  
  const { lastFormData, setLastFormData, clearFormData } = useParkingSpaceFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<ParkingSpaceFormValues>({
    resolver: zodResolver(parkingSpaceSchema) as any, 
    defaultValues: lastFormData || {
        ps_number: "",
        ps_level: undefined, 
        ps_status: "",
        ps_auto_type: "",
        pz_id: undefined
    } as any,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as ParkingSpaceFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);


  const onSubmit = (data: ParkingSpaceFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Паркувальне місце успішно створено!");
        clearFormData(); 
        navigate({ to: "/parkingspaces" });
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
        Створення нового паркомісця
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Рядок 1: Номер місця (на всю ширину) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Номер місця</label>
          <input
            type="text"
            {...register("ps_number")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ps_number ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Введіть номер (напр. A-101)"
          />
          {errors.ps_number && (
            <p className="text-red-600 text-xs mt-1">{errors.ps_number.message}</p>
          )}
        </div>

        {/* Рядок 2: Рівень та Статус (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Рівень */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Рівень</label>
              <input
                type="number"
                {...register("ps_level", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ps_level ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть рівень"
              />
              {errors.ps_level && (
                <p className="text-red-600 text-xs mt-1">{errors.ps_level.message}</p>
              )}
            </div>

            {/* Статус */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <select
                {...register("ps_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ps_status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Оберіть статус</option>
                <option value="вільне">Вільне</option>
                <option value="зайняте">Зайняте</option>
                <option value="зарезервоване">Зарезервоване</option>
              </select>
              {errors.ps_status && (
                <p className="text-red-600 text-xs mt-1">{errors.ps_status.message}</p>
              )}
            </div>
        </div>

        {/* Рядок 3: Тип авто та Зона (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Тип авто */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип авто</label>
              <select
                {...register("ps_auto_type")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ps_auto_type ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="">Оберіть тип авто</option>
                <option value="Легкове">Легкове</option>
                <option value="Вантажне">Вантажне</option>
                <option value="Електрокар">Електрокар</option>
              </select>
              {errors.ps_auto_type && (
                <p className="text-red-600 text-xs mt-1">{errors.ps_auto_type.message}</p>
              )}
            </div>

            {/* Паркінг-зона */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Паркінг-зона</label>
              <select
                {...register("pz_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.pz_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isZonesLoading}
              >
                <option value="">Оберіть зону</option>
                {isZonesLoading && <option disabled>Завантаження зон...</option>}
                {zones?.map((zone: any) => (
                  <option key={zone.pz_id} value={zone.pz_id}>
                    {zone.pz_name}
                  </option>
                ))}
              </select>
              {errors.pz_id && (
                <p className="text-red-600 text-xs mt-1">{errors.pz_id.message}</p>
              )}
            </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Створення..." : "Створити місце"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/parkingspaces">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};