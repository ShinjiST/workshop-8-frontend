import { z } from "zod";

// Регулярний вираз для перевірки, що телефон складається рівно з 10 цифр
const phoneRegex = /^\d{10}$/;

export const clientSchema = z.object({
    c_full_name: z.string().min(3, "Повне ім'я не може бути порожнім і має бути довше 3 символів").max(90, "Максимальна довжина 90 символів"),

    c_phone_number: z
        .string()
        .regex(phoneRegex, "Телефон має містити рівно 10 цифр")
        .min(10, "Основний телефон має містити 10 цифр"),

    c_backup_phone_number: z
        .string()
        .regex(phoneRegex, "Додатковий телефон має містити рівно 10 цифр")
        .min(10, "Додатковий телефон має містити 10 цифр"),

    c_email: z.string().email("Введіть коректну електронну адресу").max(255, "Максимальна довжина email 255 символів"),
});

// Типи для форм створення та оновлення
export type ClientFormValues = z.infer<typeof clientSchema>;

// Тип для операції створення (той самий, що й форма)
export type CreateClientDto = ClientFormValues; 

// Тип для операції оновлення (можна оновити лише частину полів)
export type UpdateClientDto = Partial<ClientFormValues>;