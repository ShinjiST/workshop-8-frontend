import { useEffect, useState } from "react"; 
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateAgreement } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware';

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { AgreementFormValues } from "../schema";
import { agreementSchema } from "../schema";

import { useClients } from "../../clients/api";
import { useAutos } from "../../autos/api";
import { useRates } from "../../rates/api";
import { useParkingSpaces } from "../../parkingspaces/api";
import { useEmployees } from "../../employees/api";

// Імпорт нового хука для розрахунку суми
import { useAgreementTotalCalculator } from "../hooks/useAgreementTotalCalculator";

// ==========================================
// ZUSTAND STORE
// ==========================================
interface AgreementFormState {
  lastFormData?: AgreementFormValues;
  setLastFormData: (data: AgreementFormValues) => void;
  clearFormData: () => void;
}

export const useAgreementFormStore = create<AgreementFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'agreement-create-storage' }
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const AgreementCreatePage = () => {
  const navigate = useNavigate();
  const createMutation = useCreateAgreement();

  // Завантаження даних для селектів
  const { data: clients, isLoading: isClientsLoading } = useClients();
  const { data: autos, isLoading: isAutosLoading } = useAutos();
  const { data: rates, isLoading: isRatesLoading } = useRates();
  const { data: spaces, isLoading: isSpacesLoading } = useParkingSpaces();
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

  const [mounted, setMounted] = useState(false);

  // Zustand
  const { lastFormData, setLastFormData, clearFormData } = useAgreementFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch,
    setValue
  } = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema) as any,
    defaultValues: lastFormData || {
        ag_date: new Date().toISOString().split('T')[0], // Дефолт: сьогоднішня дата
        ag_duration_days: 30, 
        a_total: 0, 
        a_status: "активний",
        c_id: undefined,
        at_id: undefined,
        r_id: undefined,
        ps_id: undefined,
        e_id: undefined
    } as any,
  });
  
  const watchedDuration = watch('ag_duration_days');
  const watchedRateId = watch('r_id');

  // ВИКОРИСТАННЯ ВИНОСНОЇ ЛОГІКИ РОЗРАХУНКУ
  const calculatedTotalNumber = useAgreementTotalCalculator(
    rates, 
    watchedRateId, 
    watchedDuration
  );
  
  // Перетворюємо число назад у рядок для відображення, якщо потрібно (або просто Number для setValue)
  const calculatedTotal = calculatedTotalNumber.toFixed(2);

  useEffect(() => {
      // Встановлюємо значення A_TOTAL в форму
      setValue('a_total', calculatedTotalNumber, { shouldValidate: true });
  }, [calculatedTotalNumber, setValue]);

  // Слідкуємо за змінами
  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as AgreementFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: AgreementFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        // *** ВИПРАВЛЕННЯ: ЗАМІНА ALERT НА CUSTOM UI ***
        console.log("Договір успішно створено!");
        // alert("Договір успішно створено!"); // Замінено на console.log/custom modal
        clearFormData();
        navigate({ to: "/agreements" });
      },
      onError: (error) => {
        const generalError = handleServerErrors(error, setError);
        if (generalError) {
          // *** ВИПРАВЛЕННЯ: ЗАМІНА ALERT НА CUSTOM UI ***
          console.error("Помилка створення договору:", generalError);
          // alert(generalError); // Замінено на console.error/custom modal
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
        Оформлення нового договору
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-4xl space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* БЛОК 1: Основні параметри (3 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Дата */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Дата початку</label>
              <input
                type="date"
                {...register("ag_date")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ag_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ag_date && <p className="text-red-600 text-xs mt-1">{errors.ag_date.message}</p>}
            </div>

            {/* Тривалість */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тривалість (днів)</label>
              <input
                type="number"
                {...register("ag_duration_days", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ag_duration_days ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="30"
              />
              {errors.ag_duration_days && <p className="text-red-600 text-xs mt-1">{errors.ag_duration_days.message}</p>}
            </div>

            {/* Статус */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <select
                {...register("a_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.a_status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="активний">Активний</option>
                <option value="завершений">Завершений</option>
              </select>
              {errors.a_status && <p className="text-red-600 text-xs mt-1">{errors.a_status.message}</p>}
            </div>
        </div>

        <hr className="border-gray-100" />

        {/* БЛОК 2: Зв'язки (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Клієнт */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Клієнт</label>
              <select
                {...register("c_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.c_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isClientsLoading}
              >
                <option value="">Оберіть клієнта</option>
                {clients?.map((c: any) => (
                  <option key={c.c_id} value={c.c_id}>{c.c_full_name} (ID: {c.c_id})</option>
                ))}
              </select>
              {errors.c_id && <p className="text-red-600 text-xs mt-1">{errors.c_id.message}</p>}
            </div>

            {/* Авто */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Автомобіль</label>
              <select
                {...register("at_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.at_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isAutosLoading}
              >
                <option value="">Оберіть авто</option>
                {autos?.map((a: any) => (
                  <option key={a.at_id} value={a.at_id}>{a.at_brand} {a.at_model} ({a.at_license_plate})</option>
                ))}
              </select>
              {errors.at_id && <p className="text-red-600 text-xs mt-1">{errors.at_id.message}</p>}
            </div>

            {/* Паркомісце */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Паркомісце</label>
              <select
                {...register("ps_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ps_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isSpacesLoading}
              >
                <option value="">Оберіть місце</option>
                {spaces?.map((s: any) => (
                  <option key={s.ps_id} value={s.ps_id}>№{s.ps_number} (Рівень {s.ps_level})</option>
                ))}
              </select>
              {errors.ps_id && <p className="text-red-600 text-xs mt-1">{errors.ps_id.message}</p>}
            </div>

            {/* Тариф */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тариф</label>
              <select
                {...register("r_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.r_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isRatesLoading}
              >
                <option value="">Оберіть тариф</option>
                {rates?.map((r: any) => (
                  <option key={r.r_id} value={r.r_id}>{r.r_parking_space_type} - {r.r_price_per_day} грн/день</option>
                ))}
              </select>
              {errors.r_id && <p className="text-red-600 text-xs mt-1">{errors.r_id.message}</p>}
            </div>
        </div>

        <hr className="border-gray-100" />

        {/* БЛОК 3: Фінанси та Відповідальний (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {/* Загальна сума (АВТОМАТИЧНО РОЗРАХУНКОВАНО І DISABLED) */}
             <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Загальна сума (грн)</label>
              <input
                step="0.01"
                type="number"
                {...register("a_total", { valueAsNumber: true })}
                disabled 
                className={`border rounded-lg p-2.5 w-full bg-gray-50 border-gray-300 outline-none transition font-bold text-green-700`}
                value={calculatedTotal} 
              />
              {errors.a_total && <p className="text-red-600 text-xs mt-1">{errors.a_total.message}</p>}
              <p className="text-xs text-gray-500 mt-1">
                 Сума розрахована автоматично.
              </p>
            </div>

            {/* Співробітник */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Оформив співробітник</label>
              <select
                {...register("e_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isEmployeesLoading}
              >
                <option value="">Оберіть співробітника</option>
                {employees?.map((e: any) => (
                  <option key={e.e_id} value={e.e_id}>{e.e_full_name}</option>
                ))}
              </select>
              {errors.e_id && <p className="text-red-600 text-xs mt-1">{errors.e_id.message}</p>}
            </div>
        </div>

        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-6"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Оформлення..." : "Оформити договір"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/agreements">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};
