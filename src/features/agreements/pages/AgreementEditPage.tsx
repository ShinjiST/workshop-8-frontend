import { useParams, useNavigate } from "@tanstack/react-router";
import { useAgreement, useUpdateAgreement } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
// Імпорт хуків для довідників
import { useClients } from "../../clients/api";
import { useAutos } from "../../autos/api";
import { useRates } from "../../rates/api";
import { useParkingSpaces } from "../../parkingspaces/api";
import { useEmployees } from "../../employees/api";

// 👇 ІМПОРТУЄМО СХЕМУ ДЛЯ AGREEMENT
import type { AgreementFormValues } from "../schema";
import { agreementSchema } from "../schema";

// 👇 ІМПОРТ ХУКА ДЛЯ РОЗРАХУНКУ СУМИ
import { useAgreementTotalCalculator } from "../hooks/useAgreementTotalCalculator";

// ==========================================
// COMPONENT
// ==========================================
export const AgreementEditPage = () => {
  const { ag_id } = useParams({ from: "/agreements/edit/$ag_id" });
  const navigate = useNavigate();
  const agreementId = Number(ag_id);

  // 2. ДАНІ
  const { data: agreement, isLoading, isError } = useAgreement(agreementId);
  
  // Завантажуємо списки для вибору
  const { data: clients, isLoading: isClientsLoading } = useClients();
  const { data: autos, isLoading: isAutosLoading } = useAutos();
  const { data: rates, isLoading: isRatesLoading } = useRates();
  const { data: spaces, isLoading: isSpacesLoading } = useParkingSpaces();
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

  const updateMutation = useUpdateAgreement();
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
    watch, // Додано watch
    setValue // Додано setValue
  } = useForm<AgreementFormValues>({
    resolver: zodResolver(agreementSchema) as any,
  });

  // 4. СЛІДКУВАННЯ ЗА ЗМІНАМИ ДЛЯ РОЗРАХУНКУ
  const watchedDuration = watch('ag_duration_days');
  const watchedRateId = watch('r_id');

  // ВИКОРИСТАННЯ ВИНОСНОЇ ЛОГІКИ РОЗРАХУНКУ
  const calculatedTotalNumber = useAgreementTotalCalculator(
    rates as any, // Припускаємо, що rates має тип, сумісний з Rate[] з хука
    watchedRateId, 
    watchedDuration
  );
  
  // Значення для відображення у disabled полі
  const calculatedTotalDisplay = calculatedTotalNumber.toFixed(2);

  // 3. ЗАПОВНЕННЯ ПОЛІВ ПРИ ЗАВАНТАЖЕННІ
  useEffect(() => {
    if (agreement) {
      // Форматуємо дату для input type="date" (YYYY-MM-DD)
      const formattedDate = agreement.ag_date 
        ? new Date(agreement.ag_date).toISOString().split('T')[0] 
        : "";

      reset({
        ag_date: formattedDate,
        ag_duration_days: agreement.ag_duration_days,
        a_total: agreement.a_total, // Це початкове значення буде замінено в наступному useEffect
        a_status: agreement.a_status as "активний" | "завершений",
        c_id: agreement.c_id,
        at_id: agreement.at_id,
        r_id: agreement.r_id,
        ps_id: agreement.ps_id,
        e_id: agreement.e_id,
      });
    }
  }, [agreement, reset]);

  useEffect(() => { 
      setValue('a_total', calculatedTotalNumber, { shouldValidate: true });
  }, [calculatedTotalNumber, setValue]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: AgreementFormValues) => {
    clearErrors();
    

    const dataToSend = {
      ...data,
      a_total: calculatedTotalNumber,
    };

    updateMutation.mutate(
      {
        id: agreementId,
        data: dataToSend,
      },
      {
        onSuccess: () => {
          console.log("Договір оновлено успішно!");
          // alert("Договір оновлено успішно!"); // Замінено
          navigate({ to: "/agreements" });
        },
        onError: (error) => {
          const generalError = handleServerErrors(error, setError);
          if (generalError) {
            console.error("Помилка оновлення:", generalError);
            // alert(generalError); // Замінено
          }
        },
      }
    );
  };

  if (isLoading) return <div className="h-full flex items-center justify-center text-gray-500">Завантаження...</div>;
  if (isError || !agreement) return <div className="h-full flex items-center justify-center text-red-500">Помилка: договір не знайдено.</div>;

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування договору #{agreement.ag_id}
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
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ag_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ag_date && <p className="text-red-600 text-xs mt-1">{errors.ag_date.message}</p>}
            </div>

            {/* Тривалість */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Тривалість (днів)</label>
              <input
                type="number"
                {...register("ag_duration_days", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ag_duration_days ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ag_duration_days && <p className="text-red-600 text-xs mt-1">{errors.ag_duration_days.message}</p>}
            </div>

            {/* Статус */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <select
                {...register("a_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.a_status ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.c_id ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.at_id ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.ps_id ? 'border-red-500' : 'border-gray-300'}`}
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
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.r_id ? 'border-red-500' : 'border-gray-300'}`}
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
             <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Загальна сума (грн)</label>
              <input
                step="0.01"
                type="number"
                {...register("a_total", { valueAsNumber: true })}
                disabled 
                className={`border rounded-lg p-2.5 w-full bg-gray-50 border-gray-300 outline-none transition font-bold text-green-700`}
                value={calculatedTotalDisplay} 
              />
              {errors.a_total && <p className="text-red-600 text-xs mt-1">{errors.a_total.message}</p>}
              <p className="text-xs text-gray-500 mt-1">
                 Сума розрахована автоматично.
              </p>
            </div>

            {/* Співробітник */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Співробітник</label>
              <select
                {...register("e_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_id ? 'border-red-500' : 'border-gray-300'}`}
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
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/agreements" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};
