import { useEffect, useState } from "react";
import { useParams, useNavigate } from "@tanstack/react-router";
import { useParkingZone, useUpdateParkingZone } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod"; 

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { ParkingZoneFormValues } from "../schema";
import { parkingZoneSchema } from "../schema";

export const ParkingZoneEditPage = () => {
  const { pz_id } = useParams({ from: "/parkingzones/edit/$pz_id" });
  const navigate = useNavigate();
  const zoneId = Number(pz_id);

  const { data: zone, isLoading, isError } = useParkingZone(zoneId);
  const updateMutation = useUpdateParkingZone();
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => { 
    setMounted(true); 
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<ParkingZoneFormValues>({
    resolver: zodResolver(parkingZoneSchema) as any,
  });

  useEffect(() => {
    if (zone) {
      reset({
        pz_name: zone.pz_name,
        pz_capacity: zone.pz_capacity,
      });
    }
  }, [zone, reset]);

  const onSubmit = (data: ParkingZoneFormValues) => {
    clearErrors();

    updateMutation.mutate(
      { id: zoneId, data: data },
      {
        onSuccess: () => {
          alert("Паркінг-зону оновлено успішно!");
          navigate({ to: "/parkingzones" });
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
  if (isError || !zone) return <div className="h-full flex items-center justify-center text-red-500">Помилка: зону не знайдено.</div>;

  return (
    <div 
        // 🎨 ДИЗАЙН: Вирівнювання по центру, h-full
        className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
        }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування зони: {zone.pz_name}
      </h2>

      <form
        onSubmit={handleSubmit(onSubmit)}
        // 🎨 КАРТКА: Ті самі стилі
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
      >
        {/* Назва зони */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Назва зони</label>
          <input
            type="text"
            {...register("pz_name")}
            placeholder="Введіть назву"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
              errors.pz_name ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pz_name && (
            <p className="text-red-600 text-xs mt-1">
              {errors.pz_name.message}
            </p>
          )}
        </div>

        {/* Місткість */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Місткість</label>
          <input
            type="number"
            /* 👇 ДОБАВЛЕНО { valueAsNumber: true } */
            {...register("pz_capacity", { valueAsNumber: true })} 
            placeholder="Введіть количество мест"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${
              errors.pz_capacity ? 'border-red-500' : 'border-gray-300'
            }`}
          />
          {errors.pz_capacity && (
            <p className="text-red-600 text-xs mt-1">
              {errors.pz_capacity.message}
            </p>
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
        onClick={() => navigate({ to: "/parkingzones" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};