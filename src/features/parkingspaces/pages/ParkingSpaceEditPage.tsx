// src/features/parkingspaces/pages/ParkingSpaceEditPage.tsx

import { useParams, useNavigate } from "@tanstack/react-router";
import { useParkingSpace, useUpdateParkingSpace } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"; 

import { handleServerErrors } from "../../../components/utils/formErrors";
import { useParkingZones } from "../../parkingzones/api"; 
import type { ParkingSpaceFormValues } from "../schema";
import { parkingSpaceSchema } from "../schema";

// ==========================================
// COMPONENT
// ==========================================
export const ParkingSpaceEditPage = () => {
  const { ps_id } = useParams({ from: "/parkingspaces/edit/$ps_id" });
  const navigate = useNavigate();
  const spaceId = Number(ps_id);

  const { data: space, isLoading, isError } = useParkingSpace(spaceId);
  const { data: zones, isLoading: isZonesLoading } = useParkingZones();

  const updateMutation = useUpdateParkingSpace();
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<ParkingSpaceFormValues>({
    resolver: zodResolver(parkingSpaceSchema) as any,
  });

  useEffect(() => {
    if (space) {
      reset({
        ps_number: space.ps_number,
        ps_level: space.ps_level,
        ps_status: space.ps_status as any, 
        ps_auto_type: space.ps_auto_type as any,
        pz_id: space.pz_id,
      });
    }
  }, [space, reset]);
 
  const onSubmit = (data: ParkingSpaceFormValues) => {
    clearErrors(); 

    updateMutation.mutate(
      {
        id: spaceId,
        data: data,
      },
      {
        onSuccess: () => {
          alert("Паркувальне місце оновлено успішно!");
          navigate({ to: "/parkingspaces" });
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
  if (isError || !space) return <div className="h-full flex items-center justify-center text-red-500">Помилка: місце не знайдено.</div>;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування місця: {space.ps_number}
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5" 
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Рядок 1: Номер місця */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Номер місця</label>
          <input
            type="text"
            {...register("ps_number")} 
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ps_number ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Введіть номер місця"
          />
          {errors.ps_number && (
            <p className="text-red-600 text-xs mt-1">{errors.ps_number.message}</p>
          )}
        </div>

        {/* Рядок 2: Рівень та Статус */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Рівень</label>
              <input
                type="number"
                {...register("ps_level")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ps_level ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть рівень"
              />
              {errors.ps_level && (
                <p className="text-red-600 text-xs mt-1">{errors.ps_level.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <select
                {...register("ps_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ps_status ? 'border-red-500' : 'border-gray-300'}`}
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

        {/* Рядок 3: Тип та Зона */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип авто</label>
              <select
                {...register("ps_auto_type")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ps_auto_type ? 'border-red-500' : 'border-gray-300'}`}
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

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Паркінг-зона</label>
              <select
                {...register("pz_id")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.pz_id ? 'border-red-500' : 'border-gray-300'}`}
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/parkingspaces" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};