import { useParams, useNavigate } from "@tanstack/react-router";
import { useClient, useUpdateClient } from "../api";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react"; // ОК, якщо використовуєш useState

// 1. ІМПОРТИ
import { handleServerErrors } from "../../../components/utils/formErrors";
import type { ClientFormValues } from "../schema";
import { clientSchema } from "../schema"; 
// import { ArrowLeft, User, Edit } from "lucide-react"; // Імпортуй це, якщо використовуєш у JSX

// ==========================================
// COMPONENT
// ==========================================
export const ClientEditPage = () => {
    // Отримуємо ID з URL. Припускаємо, що роут має параметр $c_id
    const { c_id } = useParams({ from: "/clients/edit/$c_id" });
    const navigate = useNavigate();
    const clientId = Number(c_id);

    // 2. ДАНІ: Отримуємо дані поточного клієнта
    const { data: client, isLoading, isError } = useClient(clientId);

    const updateMutation = useUpdateClient();
    const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset,
    } = useForm<ClientFormValues>({
        // Використовуємо ту ж схему валідації, що і для створення
        resolver: zodResolver(clientSchema) as any, 
    });

    // 3. ЗАПОВНЕННЯ ПОЛІВ
    useEffect(() => {
        if (client) {
            // Заповнюємо форму даними, отриманими з бекенду
            reset({
                c_full_name: client.c_full_name,
                c_email: client.c_email,
                c_phone_number: client.c_phone_number,
                c_backup_phone_number: client.c_backup_phone_number,
            });
        }
    }, [client, reset]);

    useEffect(() => {
        setMounted(true);
    }, []);
    
    const onSubmit = (data: ClientFormValues) => {
        clearErrors(); 

        // Оскільки бекенд очікує лише змінені дані (UpdateClientDto = Partial<Omit<Client, 'c_id'>>),
        // ми передаємо дані форми напряму
        updateMutation.mutate(
            {
                id: clientId,
                data: data,
            },
            {
                onSuccess: () => {
                    alert("Дані клієнта оновлено успішно!");
                    // Перенаправлення на список, як у ParkingSpace
                    navigate({ to: "/clients" }); 
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

    if (isLoading) return <div className="h-full flex items-center justify-center text-gray-500">Завантаження даних клієнта...</div>;
    if (isError || !client) return <div className="h-full flex items-center justify-center text-red-500">Помилка: Клієнта не знайдено.</div>;

    return (
        <div
            className={`h-full w-full flex flex-col items-center justify-center p-6 transition-opacity duration-300 ${
                mounted ? "opacity-100" : "opacity-0"
            }`}
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Редагування клієнта: {client.c_full_name}
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
                        className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.c_full_name ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.c_email ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.c_phone_number ? 'border-red-500' : 'border-gray-300'}`}
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
                        className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.c_backup_phone_number ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Напр., 0509876543"
                    />
                    {errors.c_backup_phone_number && (
                        <p className="text-red-600 text-xs mt-1">{errors.c_backup_phone_number.message}</p>
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
                onClick={() => navigate({ to: "/clients" })}
            >
                ← Скасувати та повернутися
            </button>
        </div>
    );
};