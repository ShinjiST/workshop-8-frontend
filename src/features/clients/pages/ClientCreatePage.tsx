import { useEffect, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateClient } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'; 

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
import type { ClientFormValues } from "../schema";
import { clientSchema } from "../schema";

// ==========================================
// ZUSTAND STORE (для чернетки форми)
// ==========================================
interface ClientFormState {
  lastFormData?: ClientFormValues;
  setLastFormData: (data: ClientFormValues) => void;
  clearFormData: () => void;
}

export const useClientFormStore = create<ClientFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'client-create-storage' } // Зберігання у LocalStorage
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const ClientCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateClient();
  const [mounted, setMounted] = useState(false);

  const { lastFormData, setLastFormData, clearFormData } = useClientFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
  } = useForm<ClientFormValues>({
    resolver: zodResolver(clientSchema) as any, 
    defaultValues: lastFormData || {
        c_full_name: "",
        c_phone_number: "",
        c_backup_phone_number: "",
        c_email: "",
    },
  });

  // Зберігання форми при зміні
  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as ClientFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: ClientFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Клієнта успішно створено!");
        clearFormData(); 
        navigate({ to: "/clients" as any });
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
        Реєстрація нового клієнта
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        {/* Повне ім'я */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Повне ім'я</label>
          <input
            type="text"
            {...register("c_full_name")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.c_full_name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Напр., Іванов Іван Іванович"
          />
          {errors.c_full_name && (
            <p className="text-red-600 text-xs mt-1">{errors.c_full_name.message}</p>
          )}
        </div>

        {/* E-mail */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">E-mail</label>
          <input
            type="email"
            {...register("c_email")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.c_email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Введіть email"
          />
          {errors.c_email && (
            <p className="text-red-600 text-xs mt-1">{errors.c_email.message}</p>
          )}
        </div>

        {/* Основний телефон */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Основний телефон (10 цифр)</label>
          <input
            type="text"
            {...register("c_phone_number")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.c_phone_number ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Напр., 0971234567"
          />
          {errors.c_phone_number && (
            <p className="text-red-600 text-xs mt-1">{errors.c_phone_number.message}</p>
          )}
        </div>

        {/* Додатковий телефон */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Додатковий телефон (10 цифр)</label>
          <input
            type="text"
            {...register("c_backup_phone_number")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.c_backup_phone_number ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Напр., 0509876543"
          />
          {errors.c_backup_phone_number && (
            <p className="text-red-600 text-xs mt-1">{errors.c_backup_phone_number.message}</p>
          )}
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Реєстрація..." : "Зареєструвати клієнта"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/clients">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};