import { useParams, useNavigate } from "@tanstack/react-router";
import { useMaintenance, useUpdateMaintenance } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
import { useEmployees } from "../../employees/api";
import { useParkingSpaces } from "../../parkingspaces/api";
// 👇 ІМПОРТУЄМО СХЕМУ ДЛЯ MAINTENANCE
import type { MaintenanceFormValues } from "../schema";
import { maintenanceSchema } from "../schema";

// ==========================================
// COMPONENT
// ==========================================
export const MaintenanceEditPage = () => {
  const { m_id } = useParams({ from: "/maintenances/edit/$m_id" });
  const navigate = useNavigate();
  const maintenanceId = Number(m_id);

  // 2. ДАНІ
  const { data: maintenance, isLoading, isError } = useMaintenance(maintenanceId);
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  const { data: parkingSpaces, isLoading: isSpacesLoading } = useParkingSpaces();

  const updateMutation = useUpdateMaintenance();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<MaintenanceFormValues>({
    resolver: zodResolver(maintenanceSchema) as any,
  });

  // 3. ЗАПОВНЕННЯ ПОЛІВ
  useEffect(() => {
    if (maintenance) {
      // Форматуємо дату для input type="date" (YYYY-MM-DD)
      const formattedDate = maintenance.m_date 
        ? new Date(maintenance.m_date).toISOString().split('T')[0] 
        : "";

      reset({
        m_date: formattedDate,
        m_description: maintenance.m_description,
        m_cost: maintenance.m_cost || 0, // Якщо null, ставимо 0
        ps_id: maintenance.ps_id,
        e_id: maintenance.e_id,
      });
    }
  }, [maintenance, reset]);


  const onSubmit = (data: MaintenanceFormValues) => {
    clearErrors();
    
    updateMutation.mutate(
      {
        id: maintenanceId,
        data: data,
      },
      {
        onSuccess: () => {
          alert("Запис про техобслуговування оновлено успішно!");
          navigate({ to: "/maintenances" });
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
  if (isError || !maintenance) return <div className="h-full flex items-center justify-center text-red-500">Помилка: запис не знайдено.</div>;

  return (
     <div className="w-full flex flex-col items-center p-6 pt-1">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування запису (ID: {maintenance.m_id})
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
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
              errors.m_cost ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.m_cost && (
            <p className="text-red-600 text-xs mt-1">{errors.m_cost.message}</p>
          )}
        </div>

        {/* Співробітник та Паркомісце (в один рядок на великих екранах) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Паркомісце */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Паркомісце</label>
              <select
                {...register("ps_id", { valueAsNumber: true })}
                disabled={isSpacesLoading}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
                  errors.ps_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Оберіть місце</option>
                {isSpacesLoading && <option disabled>Завантаження...</option>}
                
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
              <label className="block text-gray-700 font-medium mb-1 text-sm">Співробітник</label>
              <select
                {...register("e_id", { valueAsNumber: true })}
                disabled={isEmployeesLoading}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/maintenances" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};