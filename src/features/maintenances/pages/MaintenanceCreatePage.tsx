import { useEffect } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateMaintenance } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { MaintenanceFormValues } from "../schema";
import { maintenanceSchema } from "../schema";
import { useEmployees } from "../../employees/api";
import { useParkingSpaces } from "../../parkingspaces/api";

// ==========================================
// ZUSTAND STORE
// ==========================================
interface MaintenanceFormState {
  lastFormData?: MaintenanceFormValues;
  setLastFormData: (data: MaintenanceFormValues) => void;
  clearFormData: () => void;
}

export const useMaintenanceFormStore = create<MaintenanceFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'maintenance-create-storage' } // Зберігаємо в LocalStorage
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const MaintenanceCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateMaintenance();

  // Завантажуємо довідники для випадаючих списків
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  const { data: parkingSpaces, isLoading: isSpacesLoading } = useParkingSpaces();

  
  // Zustand store
  const { lastFormData, setLastFormData, clearFormData } = useMaintenanceFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema) as any,
    defaultValues: lastFormData || {
      m_date: "",
      m_description: "",
      m_cost: 0,
      ps_id: undefined,
      e_id: undefined,
    } as any,
  });

  // Слідкуємо за змінами і пишемо в стор
  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as MaintenanceFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);


  const onSubmit = (data: MaintenanceFormValues) => {
    clearErrors();
    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Запис про техобслуговування успішно створено!");
        clearFormData();
        navigate({ to: "/maintenances" });
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
        Реєстрація технічного обслуговування
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Дата проведення */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Дата проведення</label>
          <input
            type="date"
            {...register("m_date")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.m_date ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.m_date && (
            <p className="text-red-600 text-xs mt-1">{errors.m_date.message}</p>
          )}
        </div>

        {/* Опис робіт */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Опис робіт</label>
          <textarea
            {...register("m_description")}
            placeholder="Опишіть, що було зроблено..."
            rows={4}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.m_description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.m_description && (
            <p className="text-red-600 text-xs mt-1">{errors.m_description.message}</p>
          )}
        </div>

        {/* Вартість */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Вартість (грн)</label>
          <input
            step="0.01"
            type="number"
            {...register("m_cost", { valueAsNumber: true })}
            placeholder="0.00"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.m_cost ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.m_cost && (
            <p className="text-red-600 text-xs mt-1">{errors.m_cost.message}</p>
          )}
        </div>

        {/* Два селекти в ряд */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Паркомісце */}
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

            {/* Співробітник */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Відповідальний</label>
              <select
                {...register("e_id", { valueAsNumber: true })}
                disabled={isEmployeesLoading}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
                  errors.e_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Оберіть співробітника</option>
                {isEmployeesLoading && <option disabled>Завантаження...</option>}
                
                {employees?.map((emp: any) => (
                  <option key={emp.e_id} value={emp.e_id}>
                    {emp.e_full_name}
                  </option>
                ))}
              </select>
              {errors.e_id && (
                <p className="text-red-600 text-xs mt-1">{errors.e_id.message}</p>
              )}
            </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Збереження..." : "Зареєструвати"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/maintenances">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};