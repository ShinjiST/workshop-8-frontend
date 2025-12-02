import { useParams, useNavigate } from "@tanstack/react-router";
import { useEmployee, useUpdateEmployee } from "../api"; 
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react"; 


import { handleServerErrors } from "../../../components/utils/formErrors";
import type { EmployeeFormValues } from "../schema";
import { employeeSchema } from "../schema"; 


// ==========================================
// COMPONENT
// ==========================================
export const EmployeeEditPage = () => {
    const { e_id } = useParams({ from: "/employees/edit/$e_id" });
    const navigate = useNavigate();
    const employeeId = Number(e_id);

    // 2. ДАНІ: Отримуємо дані поточного співробітника
    const { data: employee, isLoading, isError } = useEmployee(employeeId); 

    const updateMutation = useUpdateEmployee();
    // ❌ ВИДАЛЕНО: const [mounted, setMounted] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setError,
        clearErrors,
        reset,
    } = useForm<EmployeeFormValues>({
        resolver: zodResolver(employeeSchema) as any, 
    });

    // 3. ЗАПОВНЕННЯ ПОЛІВ
    useEffect(() => {
        if (employee) {
            // Заповнюємо поля даними
            reset({
                e_full_name: employee.e_full_name,
                e_phone_number: employee.e_phone_number,
                e_backup_phone_number: employee.e_backup_phone_number,
                e_email: employee.e_email,
                // Дата (string)
                e_hire_date: employee.e_hire_date, 
                e_position: employee.e_position,
                // Зарплата (number)
                e_salary: employee.e_salary, 
                e_status: employee.e_status,
            });
        }
    }, [employee, reset]);

    // ❌ ВИДАЛЕНО: useEffect(() => { setMounted(true); }, []);
    
    const onSubmit = (data: EmployeeFormValues) => {
        clearErrors(); 

        updateMutation.mutate(
            {
                id: employeeId,
                data: data,
            },
            {
                onSuccess: () => {
                    alert("Дані співробітника оновлено успішно!");
                    navigate({ to: "/employees" as any }); 
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

    if (isLoading) return <div className="h-full flex items-center justify-center text-gray-500">Завантаження даних співробітника...</div>;
    if (isError || !employee) return <div className="h-full flex items-center justify-center text-red-500">Помилка: Співробітника не знайдено.</div>;

    return (
        // 💡 Оновлено: Мінімізація вертикального відступу (p-6 pt-1)
        <div
            className={`w-full flex flex-col items-center p-6 pt-1`}
        >
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Редагування співробітника: {employee.e_full_name}
            </h2>

            <form
                onSubmit={handleSubmit(onSubmit)} 
                // 💡 Використовуємо оптимізовану сітку та більшу ширину (max-w-2xl)
                className="bg-white shadow-xl rounded-2xl border border-gray-100 p-8 w-full max-w-2xl space-y-5"
            >
                {/* Рядок 1: ПІБ (повна ширина) */}
                <div>
                    <label className="block text-gray-700 font-medium mb-1 text-sm">Повне ім'я</label>
                    <input
                        type="text"
                        {...register("e_full_name")} 
                        className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_full_name ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="ПІБ"
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
                        className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Email"
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
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_phone_number ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Основний телефон"
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
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_backup_phone_number ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Додатковий телефон"
                        />
                        {errors.e_backup_phone_number && (
                            <p className="text-red-600 text-xs mt-1">{errors.e_backup_phone_number.message}</p>
                        )}
                    </div>
                </div>
                
                {/* Рядок 4: Дата найму та Посада (2 колонки) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Дата найму */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Дата найму</label>
                        <input
                            type="date"
                            {...register("e_hire_date")} 
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_hire_date ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.e_hire_date && (
                            <p className="text-red-600 text-xs mt-1">{errors.e_hire_date.message}</p>
                        )}
                    </div>

                    {/* Посада */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Посада</label>
                        <input
                            type="text"
                            {...register("e_position")}
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_position ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Посада"
                        />
                        {errors.e_position && (
                            <p className="text-red-600 text-xs mt-1">{errors.e_position.message}</p>
                        )}
                    </div>
                </div>

                {/* Рядок 5: Зарплата та Статус (2 колонки) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Зарплата */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Зарплата (10,000 - 40,000)</label>
                        <input
                            type="number"
                            {...register("e_salary", { valueAsNumber: true })} 
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_salary ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Зарплата"
                        />
                        {errors.e_salary && (
                            <p className="text-red-600 text-xs mt-1">{errors.e_salary.message}</p>
                        )}
                    </div>

                    {/* Статус */}
                    <div>
                        <label className="block text-gray-700 font-medium mb-1 text-sm">Статус</label>
                        <input
                            type="text"
                            {...register("e_status")}
                            className={`border rounded-lg p-2.5 w-full focus:ring-2 focus:ring-green-100 outline-none transition ${errors.e_status ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Статус"
                        />
                        {errors.e_status && (
                            <p className="text-red-600 text-xs mt-1">{errors.e_status.message}</p>
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
                onClick={() => navigate({ to: "/employees" as any })}
            >
                ← Скасувати та повернутися
            </button>
        </div>
    );
};