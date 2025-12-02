// src/features/incidents/pages/IncidentCreatePage.tsx

import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateIncident } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { IncidentFormValues } from "../schema";
import { incidentSchema } from "../schema";
import { useEmployees } from "../../employees/api";
import { useParkingSpaces } from "../../parkingspaces/api";

// ==========================================
// ZUSTAND STORE
// ==========================================
interface IncidentFormState {
  lastFormData?: IncidentFormValues;
  setLastFormData: (data: IncidentFormValues) => void;
  clearFormData: () => void;
}

export const useIncidentFormStore = create<IncidentFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'incident-create-storage' }
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const IncidentCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateIncident();
  
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  const { data: parkingSpaces, isLoading: isSpacesLoading } = useParkingSpaces();

   
  const { lastFormData, setLastFormData, clearFormData } = useIncidentFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema) as any,
    defaultValues: lastFormData || {
      inc_date: "",
      inc_type: "",
      inc_description: "",
      inc_status: "",
      e_id: undefined,
      ps_id: undefined,
    } as any,
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as IncidentFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

 const onSubmit = (data: IncidentFormValues) => {
    clearErrors();

    // 👇 ТЕПЕР ПРАВИЛЬНО:
    // Ми НЕ обрізаємо час через split.
    // Ми просто перетворюємо вибрану дату+час у формат, який розуміє база даних (ISO).
    const formattedData = {
        ...data,
        inc_date: new Date(data.inc_date).toISOString() // Буде: "2025-11-30T17:28:00.000Z"
    };

    createMutation.mutate(formattedData as any, {
      onSuccess: () => {
        alert("Інцидент успішно зареєстровано!");
        clearFormData();
        navigate({ to: "/incidents" });
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
   <div className="w-full flex flex-col items-center p-6 pt-1">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Реєстрація нового інциденту
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Рядок 1: Дата та час */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Дата та час</label>
          <input
            type="datetime-local"
            {...register("inc_date")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.inc_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.inc_date && (
            <p className="text-red-600 text-xs mt-1">{errors.inc_date.message}</p>
          )}
        </div>

        {/* Рядок 2: Тип та Статус */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип інциденту</label>
              <input
                type="text"
                {...register("inc_type")}
                placeholder="Напр. ДТП, Крадіжка"
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.inc_type ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.inc_type && (
                <p className="text-red-600 text-xs mt-1">{errors.inc_type.message}</p>
              )}
            </div>

           <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <select
                {...register("inc_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.inc_status ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Оберіть статус</option>
                <option value="Новий">Новий</option>
                {/* 👇 ВИПРАВЛЕНО: Було "В процесі", стало "В роботі" (як на беку) */}
                <option value="В роботі">В роботі</option> 
                <option value="Вирішено">Вирішено</option>
                {/* 👇 ВИПРАВЛЕНО: Було "Скасовано", стало "Закрито" (як на беку) */}
                <option value="Закрито">Закрито</option>
              </select>
              {errors.inc_status && (
                <p className="text-red-600 text-xs mt-1">{errors.inc_status.message}</p>
              )}
            </div>
        </div>

        {/* Рядок 3: Опис */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Опис</label>
          <textarea
            {...register("inc_description")}
            placeholder="Детальний опис ситуації..."
            rows={4}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.inc_description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.inc_description && (
            <p className="text-red-600 text-xs mt-1">{errors.inc_description.message}</p>
          )}
        </div>

        {/* Рядок 4: Паркомісце та Співробітник */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Паркомісце</label>
              <select
                {...register("ps_id", { valueAsNumber: true })}
                disabled={isSpacesLoading}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.ps_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Оберіть місце</option>
                {isSpacesLoading && <option disabled>Завантаження місць...</option>}
                
                {parkingSpaces?.map((space: any) => (
                  <option key={space.ps_id} value={space.ps_id}>
                    Місце {space.ps_number} (Зона {space.pz_id})
                  </option>
                ))}
              </select>
              {errors.ps_id && (
                <p className="text-red-600 text-xs mt-1">{errors.ps_id.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Співробітник</label>
              <select
                {...register("e_id", { valueAsNumber: true })}
                disabled={isEmployeesLoading}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.e_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Оберіть співробітника</option>
                {isEmployeesLoading && <option disabled>Завантаження співробітників...</option>}
                
                {employees?.map((employee: any) => (
                  <option key={employee.e_id} value={employee.e_id}>
                    {employee.e_full_name}
                  </option>
                ))}
              </select>
              {errors.e_id && (
                <p className="text-red-600 text-xs mt-1">{errors.e_id.message}</p>
              )}
            </div>
        </div>

        <button
          className="bg-red-600 text-white px-4 py-3 rounded-xl hover:bg-red-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Збереження..." : "Зареєструвати інцидент"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/incidents">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};