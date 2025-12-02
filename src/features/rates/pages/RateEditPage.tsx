import { useParams, useNavigate } from "@tanstack/react-router";
import { useRate, useUpdateRate } from "../api"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react"; // 👈 ПОВЕРНУТО useState

import { handleServerErrors } from "../../../components/utils/formErrors";
import type { RateFormValues } from "../schema";
import { rateSchema } from "../schema"; 

// ==========================================
// COMPONENT
// ==========================================
export const RateEditPage = () => {
    const { r_id } = useParams({ from: "/rates/edit/$r_id" });
    const navigate = useNavigate();
    const rateId = Number(r_id);

    // 2. ДАНІ: Отримуємо дані поточного тарифу
    const { data: rate, isLoading, isError } = useRate(rateId); 
    const updateMutation = useUpdateRate();
    
    // 👈 ПОВЕРНУТО: mounted стан
    const [mounted, setMounted] = useState(false); 

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset,
    } = useForm<RateFormValues>({
        resolver: zodResolver(rateSchema) as any, 
    });

    // 3. ЗАПОВНЕННЯ ПОЛІВ
    useEffect(() => {
        if (rate) {
            // Заповнюємо поля даними
            reset({
                r_auto_type: rate.r_auto_type as any,
                r_parking_space_type: rate.r_parking_space_type as any,
                r_price_per_day: rate.r_price_per_day,
                r_date: rate.r_date, 
            });
        }
    }, [rate, reset]);

    // 👈 ПОВЕРНУТО: useEffect для mounted
    useEffect(() => {
        setMounted(true);
    }, []);
    
    const onSubmit = (data: RateFormValues) => {
        clearErrors(); 

        updateMutation.mutate(
            {
                id: rateId,
                data: data,
            },
            {
                onSuccess: () => {
                    alert("Тариф оновлено успішно!");
                    navigate({ to: "/rates" as any }); 
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

    if (isLoading) return <div className="h-full flex items-center justify-center text-gray-500">Завантаження даних тарифу...</div>;
    if (isError || !rate) return <div className="h-full flex items-center justify-center text-red-500">Помилка: Тариф не знайдено.</div>;

    return (
        // 💡 ПОВЕРНУТО СТИЛІ ЕТАЛОНУ: h-full, justify-center, transition-opacity, max-w-md
        <div
            className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
                mounted ? "opacity-100" : "opacity-0"
            }`}
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Редагування тарифу: #{rate.r_id}
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)} 
                // 💡 ПОВЕРНУТО ШИРИНУ: max-w-md
                className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-md space-y-5"
            >
                {/* Рядок 1: Тип авто та Тип паркомісця (2 колонки) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Тип авто */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Тип авто</label>
                        <select
                            {...register("r_auto_type")}
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.r_auto_type ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Оберіть тип авто</option>
                            <option value="Легкове">Легкове</option>
                            <option value="Вантажне">Вантажне</option>
                            <option value="Електрокар">Електрокар</option>
                            <option value="Мотоцикл">Мотоцикл</option>
                        </select>
                        {errors.r_auto_type && (
                            <p className="text-red-600 text-xs mt-1">{errors.r_auto_type.message}</p>
                        )}
                    </div>

                    {/* Тип паркомісця */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Тип паркомісця</label>
                        <select
                            {...register("r_parking_space_type")}
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.r_parking_space_type ? 'border-red-500' : 'border-gray-300'}`}
                        >
                            <option value="">Оберіть тип</option>
                            <option value="Звичайне">Звичайне</option>
                            <option value="Преміум">Преміум</option>
                            <option value="Критий">Критий</option>
                            <option value="Відкритий">Відкритий</option>
                        </select>
                        {errors.r_parking_space_type && (
                            <p className="text-red-600 text-xs mt-1">{errors.r_parking_space_type.message}</p>
                        )}
                    </div>
                </div>
                
                {/* Рядок 2: Ціна та Дата (2 колонки) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Ціна за добу */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Ціна за добу (₴)</label>
                        <input
                            type="number"
                            {...register("r_price_per_day", { valueAsNumber: true })} 
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.r_price_per_day ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Введіть ціну, напр. 150.00"
                            step="0.01"
                        />
                        {errors.r_price_per_day && (
                            <p className="text-red-600 text-xs mt-1">{errors.r_price_per_day.message}</p>
                        )}
                    </div>

                    {/* Дата (Створення/Активності) */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Дата активації/створення</label>
                        <input
                            type="date"
                            {...register("r_date")}
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.r_date ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.r_date && (
                            <p className="text-red-600 text-xs mt-1">{errors.r_date.message}</p>
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
                onClick={() => navigate({ to: "/rates" as any })}
            >
                ← Скасувати та повернутися
            </button>
        </div>
    );
};