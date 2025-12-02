import { useParams, useNavigate } from "@tanstack/react-router";
import { useIncident, useUpdateIncident } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { handleServerErrors } from "../../../components/utils/formErrors";
import { useEmployees } from "../../employees/api";
import { useParkingSpaces } from "../../parkingspaces/api";
import type { IncidentFormValues } from "../schema";
import { incidentSchema } from "../schema";

export const IncidentEditPage = () => {
  const { inc_id } = useParams({ from: "/incidents/edit/$inc_id" });
  const navigate = useNavigate();
  const incidentId = Number(inc_id);

  const { data: incident, isLoading, isError } = useIncident(incidentId);
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();
  const { data: parkingSpaces, isLoading: isSpacesLoading } = useParkingSpaces();

  const updateMutation = useUpdateIncident();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<IncidentFormValues>({
    resolver: zodResolver(incidentSchema) as any,
  });

  // Заповнення форми при завантаженні даних
  useEffect(() => {
    if (incident) {
      // Для відображення в input type="datetime-local" потрібен формат "YYYY-MM-DDTHH:mm"
      // Тому ми беремо ISO рядок і обрізаємо секунди та літеру Z (перші 16 символів)
      const formattedDate = incident.inc_date 
        ? new Date(incident.inc_date).toISOString().slice(0, 16) 
        : "";

      reset({
        inc_date: formattedDate,
        inc_type: incident.inc_type,
        inc_description: incident.inc_description,
        inc_status: incident.inc_status,
        e_id: incident.e_id,
        ps_id: incident.ps_id,
      });
    }
  }, [incident, reset]);

  const onSubmit = (data: IncidentFormValues) => {
    clearErrors();

    // 👇 ВИПРАВЛЕНО: Аналогічно до CreatePage.
    // Перетворюємо значення з input (локальний час) у повний ISO рядок для бекенду.
    const formattedData = {
        ...data,
        inc_date: new Date(data.inc_date).toISOString() // "2025-11-30T17:28:00.000Z"
    };

    updateMutation.mutate(
      { id: incidentId, data: formattedData },
      {
        onSuccess: () => {
          alert("Інцидент оновлено успішно!");
          navigate({ to: "/incidents" });
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
  if (isError || !incident) return <div className="h-full flex items-center justify-center text-red-500">Помилка: запис не знайдено.</div>;

  return (
    <div className="w-full flex flex-col items-center p-6 pt-1">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування інциденту (ID: {incident.inc_id})
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

        {/* Рядок 2: Тип та Статус (2 колонки) */}
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
                <option value="В роботі">В роботі</option> 
                <option value="Вирішено">Вирішено</option>
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
            rows={3}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
              errors.inc_description ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.inc_description && (
            <p className="text-red-600 text-xs mt-1">{errors.inc_description.message}</p>
          )}
        </div>

        {/* Рядок 4: Паркомісце та Співробітник (2 колонки) */}
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/incidents" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};