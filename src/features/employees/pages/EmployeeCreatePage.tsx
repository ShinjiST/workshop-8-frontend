import { useEffect } from "react"; 
import { Link, useNavigate } from "@tanstack/react-router";
import { useCreateEmployee } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { create } from "zustand";
import { devtools, persist } from 'zustand/middleware'; 

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
import type { EmployeeFormValues } from "../schema";
import { employeeSchema } from "../schema"; 

// ==========================================
// ZUSTAND STORE
// ==========================================
interface EmployeeFormState {
  lastFormData?: EmployeeFormValues;
  setLastFormData: (data: EmployeeFormValues) => void;
  clearFormData: () => void;
}

export const useEmployeeFormStore = create<EmployeeFormState>()(
  devtools(
    persist(
      (set) => ({
        lastFormData: undefined,
        setLastFormData: (data) => { set({ lastFormData: data }); },
        clearFormData: () => { set({ lastFormData: undefined }); },
      }),
      { name: 'employee-create-storage' }
    )
  ),
);

// ==========================================
// COMPONENT
// ==========================================
export const EmployeeCreatePage = () => {
  const navigate = useNavigate(); 
  const createMutation = useCreateEmployee(); 

  // ❌ ВИДАЛЕНО: mounted стан

  const { lastFormData, setLastFormData, clearFormData } = useEmployeeFormStore();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    clearErrors,
    watch, 
  } = useForm<EmployeeFormValues>({
    resolver: zodResolver(employeeSchema) as any, 
    defaultValues: lastFormData || { 
        e_full_name: "",
        e_phone_number: "",
        e_backup_phone_number: "",
        e_email: "",
        e_hire_date: "", 
        e_position: "",
        e_salary: undefined, 
        e_status: "",
    },
  });

  useEffect(() => {
    const subscription = watch((value) => {
      setLastFormData(value as EmployeeFormValues);
    });
    return () => { subscription.unsubscribe(); };
  }, [watch, setLastFormData]);

  // ❌ ВИДАЛЕНО: useEffect для mounted

  const onSubmit = (data: EmployeeFormValues) => {
    clearErrors();

    createMutation.mutate(data, {
      onSuccess: () => {
        alert("Співробітника успішно зареєстровано!");
        clearFormData(); 
        navigate({ to: "/employees" as any }); 
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
    // 💡 Оновлено: pt-1 забезпечує мінімальний відступ зверху
    <div
      className={`w-full flex flex-col items-center p-6 pt-1`}
    >
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Реєстрація нового співробітника
      </h2>

      <form
        className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
        onSubmit={handleSubmit(onSubmit)}
      >
        
        {/* Рядок 1: ПІБ (повна ширина) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">Повне ім'я</label>
          <input
            type="text"
            {...register("e_full_name")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_full_name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Напр., Петренко Петро Петрович"
          />
          {errors.e_full_name && (
            <p className="text-red-600 text-xs mt-1">{errors.e_full_name.message}</p>
          )}
        </div>

        {/* Рядок 2: E-mail (повна ширина) */}
        <div>
          <label className="block text-gray-700 font-medium mb-1 text-sm">E-mail</label>
          <input
            type="email"
            {...register("e_email")}
            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_email ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Введіть email"
          />
          {errors.e_email && (
            <p className="text-red-600 text-xs mt-1">{errors.e_email.message}</p>
          )}
        </div>

        {/* Рядок 3: Основний та Додатковий телефон (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Основний телефон */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Основний телефон (10 цифр)</label>
              <input
                type="text"
                {...register("e_phone_number")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_phone_number ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., 0971234567"
              />
              {errors.e_phone_number && (
                <p className="text-red-600 text-xs mt-1">{errors.e_phone_number.message}</p>
              )}
            </div>

            {/* Додатковий телефон */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Додатковий телефон (10 цифр)</label>
              <input
                type="text"
                {...register("e_backup_phone_number")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_backup_phone_number ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., 0509876543"
              />
              {errors.e_backup_phone_number && (
                <p className="text-red-600 text-xs mt-1">{errors.e_backup_phone_number.message}</p>
              )}
            </div>
        </div>
        
        {/* Рядок 4: Посада та Зарплата (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Посада */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Посада</label>
              <input
                type="text"
                {...register("e_position")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_position ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., Менеджер"
              />
              {errors.e_position && (
                <p className="text-red-600 text-xs mt-1">{errors.e_position.message}</p>
              )}
            </div>

            {/* Зарплата */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Зарплата (10,000 - 40,000)</label>
              <input
                type="number"
                {...register("e_salary", { valueAsNumber: true })} 
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_salary ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Введіть зарплату"
              />
              {errors.e_salary && (
                <p className="text-red-600 text-xs mt-1">{errors.e_salary.message}</p>
              )}
            </div>
        </div>

        {/* Рядок 5: Дата найму та Статус (2 колонки) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Дата найму */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Дата найму</label>
              <input
                type="date"
                {...register("e_hire_date")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_hire_date ? 'border-red-500' : 'border-gray-300'}`}
              />
              {errors.e_hire_date && (
                <p className="text-red-600 text-xs mt-1">{errors.e_hire_date.message}</p>
              )}
            </div>

            {/* Статус */}
            <div>
              <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
              <input
                type="text"
                {...register("e_status")}
                className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-blue-100 outline-none transition ${errors.e_status ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Напр., Активний"
              />
              {errors.e_status && (
                <p className="text-red-600 text-xs mt-1">{errors.e_status.message}</p>
              )}
            </div>
        </div>


        <button
          className="bg-blue-600 text-white px-4 py-3 rounded-xl hover:bg-blue-700 transition w-full disabled:bg-gray-400 font-medium shadow-sm hover:shadow-md mt-4"
          disabled={createMutation.isPending}
          type="submit"
        >
          {createMutation.isPending ? "Реєстрація..." : "Зареєструвати співробітника"}
        </button>
      </form>

      <Link className="mt-6 text-gray-500 hover:text-blue-600 transition text-sm font-medium" to="/employees">
        ← Скасувати та повернутися
      </Link>
    </div>
  );
};