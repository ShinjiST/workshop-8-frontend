import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateParkingZone } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'; // 1. Додаємо persist

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
import type { ParkingZoneFormValues } from "../schema";
import { parkingZoneSchema } from "../schema";

// ==========================================
// ZUSTAND STORE
// ==========================================
interface ParkingZoneFormState {
  lastFormData?: ParkingZoneFormValues;
  setLastFormData: (data: ParkingZoneFormValues) => void;
  clearFormData: () => void; // 2. Додаємо метод очищення
}

export const useParkingZoneFormStore = create<ParkingZoneFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'parking-zone-create-storage' } // 3. Унікальне ім'я в LocalStorage
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const ParkingZoneCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateParkingZone();
  const [mounted, setMounted] = useState(false);

  // Zustand
  const { lastFormData, setLastFormData, clearFormData } = useParkingZoneFormStore();

  // React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch, // 4. Дістаємо watch
  } = useForm<ParkingZoneFormValues>({
    resolver: zodResolver(parkingZoneSchema) as any,
    defaultValues: lastFormData || { // 5. Дефолтні значення, щоб інпути були контрольованими
        pz_name: "",
        pz_capacity: undefined
    } as any,
  });

  // 6. Слідкуємо за змінами форми і пишемо в стор
  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as ParkingZoneFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: ParkingZoneFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Паркінг-зону успішно створено!");
        clearFormData(); // 7. Очищаємо стор після успіху
        navigate({ to: '/parkingzones' });
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
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Створення нової зони
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Назва зони */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Назва зони</label>
          <input
            type="text"
            {...register("pz_name")}
            placeholder="Введіть назву (напр. Zone A)"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
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
            {...register("pz_capacity", { valueAsNumber: true })} // 8. Додаємо valueAsNumber для коректної роботи з числами
            placeholder="Введіть кількість місць"
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${
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
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Створення..." : "Створити зону"}
        </button>
      </form>

      <Link
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        to="/parkingzones"
      >
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};