import { z } from "zod";

const phoneRegex = /^\d{10}$/;
const minHireDate = new Date('2020-01-01');

// Схема для співробітника
export const employeeSchema = z.object({
    e_full_name: z.string().min(3, "Повне ім'я не може бути порожнім").max(90, "Максимальна довжина 90 символів"),

    e_phone_number: z
        .string()
        .regex(phoneRegex, "Телефон має містити рівно 10 цифр"),

    e_backup_phone_number: z
        .string()
        .regex(phoneRegex, "Додатковий телефон має містити рівно 10 цифр"),

    e_email: z.string().email("Введіть коректну електронну адресу").max(255, "Максимальна довжина email 255 символів"),

    e_hire_date: z.string().refine((dateString) => {
        const date = new Date(dateString);
        return date >= minHireDate;
    }, {
        message: `Дата найму не може бути раніше ${minHireDate.toLocaleDateString()}`,
    }),
    
    e_position: z.string().min(2, "Посада не може бути порожньою").max(30, "Максимальна довжина 30 символів"),

    e_salary: z.coerce
        .number()
        .int("Зарплата має бути цілим числом")
        .min(10000, "Мінімальна зарплата 10,000")
        .max(40000, "Максимальна зарплата 40,000"),

    // Припускаємо, що статус може бути одним із кількох варіантів (або будь-яким рядком)
    e_status: z.string().min(1, "Статус не може бути порожнім").max(100, "Максимальна довжина 100 символів"),
});

export type EmployeeFormValues = z.infer<typeof employeeSchema>;
export type CreateEmployeeDto = EmployeeFormValues; 
export type UpdateEmployeeDto = Partial<EmployeeFormValues>;