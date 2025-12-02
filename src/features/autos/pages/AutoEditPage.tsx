// src/features/autos/pages/AutoEditPage.tsx

import { useParams, useNavigate } from "@tanstack/react-router";
import { useAuto, useUpdateAuto } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { AutoFormValues } from "../schema";
import { autoSchema } from "../schema";

// ==========================================
// COMPONENT
// ==========================================
export const AutoEditPage = () => {
  const { at_id } = useParams({ from: "/autos/edit/$at_id" });
  const navigate = useNavigate();
  const autoId = Number(at_id);

  const { data: auto, isLoading, isError } = useAuto(autoId);
  const updateMutation = useUpdateAuto();
  

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<AutoFormValues>({
    resolver: zodResolver(autoSchema) as any,
  });

  useEffect(() => {
    if (auto) {
      reset({
        at_license_plate: auto.at_license_plate,
        at_brand: auto.at_brand,
        at_model: auto.at_model,
        at_color: auto.at_color,
        at_type: auto.at_type as any,
      });
    }
  }, [auto, reset]);


  const onSubmit = (data: AutoFormValues) => {
    clearErrors();

    updateMutation.mutate(
      {
        id: autoId,
        data: data,
      },
      {
        onSuccess: () => {
          alert("Дані автомобіля оновлено успішно!");
          navigate({ to: "/autos" as any });
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

  if (isLoading) return <div className="h-full flex items-center justify-center text-gray-500">Завантаження даних автомобіля...</div>;
  if (isError || !auto) return <div className="h-full flex items-center justify-center text-red-500">Помилка: Автомобіль не знайдено.</div>;

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування автомобіля: {auto.at_license_plate}
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Рядок 1: Номерний знак */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Номерний знак</label>
          <input
            type="text"
            {...register("at_license_plate")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.at_license_plate ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Введіть номерний знак"
          />
          {errors.at_license_plate && (
            <p className="text-red-600 text-xs mt-1">{errors.at_license_plate.message}</p>
          )}
        </div>

        {/* Рядок 2: Бренд та Модель */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Бренд</label>
              <input
                type="text"
                {...register("at_brand")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.at_brand ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть бренд"
              />
              {errors.at_brand && (
                <p className="text-red-600 text-xs mt-1">{errors.at_brand.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Модель</label>
              <input
                type="text"
                {...register("at_model")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.at_model ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть модель"
              />
              {errors.at_model && (
                <p className="text-red-600 text-xs mt-1">{errors.at_model.message}</p>
              )}
            </div>
        </div>

        {/* Рядок 3: Колір та Тип */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Колір</label>
              <input
                type="text"
                {...register("at_color")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.at_color ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть колір"
              />
              {errors.at_color && (
                <p className="text-red-600 text-xs mt-1">{errors.at_color.message}</p>
              )}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тип транспортного засобу</label>
              <select
                {...register("at_type")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.at_type ? 'border-red-500' : 'border-gray-300'}`}
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/autos" as any })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};