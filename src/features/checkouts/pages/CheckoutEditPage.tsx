import { useParams, useNavigate } from "@tanstack/react-router";
import { useCheckout, useUpdateCheckout } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
// Імпорт хуків для довідників
import { useAgreements } from "../../agreements/api";
import { useEmployees } from "../../employees/api";

// 👇 ІМПОРТУЄМО СХЕМУ ДЛЯ CHECKOUT
import type { CheckoutFormValues } from "../schema";
import { checkoutSchema } from "../schema";

// ==========================================
// COMPONENT
// ==========================================
export const CheckoutEditPage = () => {
  const { ch_id } = useParams({ from: "/checkouts/edit/$ch_id" });
  const navigate = useNavigate();
  const checkoutId = Number(ch_id);

  // 2. ДАНІ
  const { data: checkout, isLoading, isError } = useCheckout(checkoutId);
  
  // Завантажуємо списки для вибору
  const { data: agreements, isLoading: isAgreementsLoading } = useAgreements();
  const { data: employees, isLoading: isEmployeesLoading } = useEmployees();

  const updateMutation = useUpdateCheckout();
  const [mounted, setMounted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    reset,
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema) as any,
  });

  // 3. ЗАПОВНЕННЯ ПОЛІВ
  useEffect(() => {
    if (checkout) {
      // Форматуємо дату для input type="datetime-local" (YYYY-MM-DDTHH:mm)
      // Беремо ISO рядок і обрізаємо секунди та літеру Z
      const formattedTime = checkout.ch_time 
        ? new Date(checkout.ch_time).toISOString().slice(0, 16) 
        : "";

      reset({
        ag_id: checkout.ag_id,
        e_id: checkout.e_id,
        ch_time: formattedTime,
        ch_amount: checkout.ch_amount,
        ch_status: checkout.ch_status,
      });
    }
  }, [checkout, reset]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const onSubmit = (data: CheckoutFormValues) => {
    clearErrors();
    
    // Перетворюємо локальний час з input назад у повний ISO рядок для бекенду
    const formattedData = {
        ...data,
        ch_time: new Date(data.ch_time).toISOString()
    };

    updateMutation.mutate(
      {
        id: checkoutId,
        data: formattedData,
      },
      {
        onSuccess: () => {
          alert("Дані виїзду оновлено успішно!");
          navigate({ to: "/checkouts" });
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
  if (isError || !checkout) return <div className="h-full flex items-center justify-center text-red-500">Помилка: запис не знайдено.</div>;

  return (
    <div
      className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Редагування виїзду #{checkout.ch_id}
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-6"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Договір (Головна прив'язка) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Договір</label>
          <select
            {...register("ag_id", { valueAsNumber: true })}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ag_id ? 'border-red-500' : 'border-gray-300'}`}
            disabled={isAgreementsLoading}
          >
            <option value="">Оберіть договір</option>
            {isAgreementsLoading && <option disabled>Завантаження договорів...</option>}
            
            {agreements?.map((ag: any) => (
              <option key={ag.ag_id} value={ag.ag_id}>
                 №{ag.ag_id} (від {new Date(ag.ag_date).toLocaleDateString()}) - {ag.client?.c_full_name}
              </option>
            ))}
          </select>
          {errors.ag_id && <p className="text-red-600 text-xs mt-1">{errors.ag_id.message}</p>}
        </div>

        {/* Час та Сума (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Час виїзду</label>
              <input
                type="datetime-local"
                {...register("ch_time")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ch_time ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ch_time && <p className="text-red-600 text-xs mt-1">{errors.ch_time.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Сума до сплати (грн)</label>
              <input
                step="0.01"
                type="number"
                {...register("ch_amount", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ch_amount ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.ch_amount && <p className="text-red-600 text-xs mt-1">{errors.ch_amount.message}</p>}
            </div>
        </div>

        {/* Статус та Співробітник (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <select
                {...register("ch_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.ch_status ? 'border-red-500' : 'border-gray-300'}`}
              >
                <option value="вчасно">Вчасно</option>
                <option value="раніше">Раніше</option>
                <option value="пізно">Пізно (Прострочено)</option>
              </select>
              {errors.ch_status && <p className="text-red-600 text-xs mt-1">{errors.ch_status.message}</p>}
            </div>

            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Оформив співробітник</label>
              <select
                {...register("e_id", { valueAsNumber: true })}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_id ? 'border-red-500' : 'border-gray-300'}`}
                disabled={isEmployeesLoading}
              >
                <option value="">Оберіть співробітника</option>
                {isEmployeesLoading && <option disabled>Завантаження...</option>}
                {employees?.map((e: any) => (
                  <option key={e.e_id} value={e.e_id}>
                    {e.e_full_name}
                  </option>
                ))}
              </select>
              {errors.e_id && <p className="text-red-600 text-xs mt-1">{errors.e_id.message}</p>}
            </div>
        </div>

        <button
          className="bg-green-600 text-white px-4 py-3 rounded-xl hover:bg-green-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-6"
          disabled={updateMutation.isPending}
          type="submit"
        >
          {updateMutation.isPending ? "Оновлення..." : "Зберегти зміни"}
        </button>
      </form>

      <button
        className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium"
        onClick={() => navigate({ to: "/checkouts" })}
      >
        ← Скасувати та повернутися
      </button>
    </div>
  );
};