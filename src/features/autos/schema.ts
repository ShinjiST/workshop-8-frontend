import { z } from "zod";

// Регулярний вираз для номерного знаку (припускаємо формат, 10 символів)
const licensePlateRegex = /^[A-Z0-9]{1,10}$/i; 

export const autoSchema = z.object({
    at_license_plate: z
        .string()
        .min(1, "Номерний знак не може бути порожнім")
        .max(10, "Максимальна довжина номерного знака 10 символів")
        .regex(licensePlateRegex, "Номерний знак містить лише латинські літери та цифри"),

    at_brand: z.string().min(1, "Бренд не може бути порожнім").max(30, "Максимальна довжина 30 символів"),

    at_model: z.string().min(1, "Модель не може бути порожньою").max(30, "Максимальна довжина 30 символів"),

    at_color: z.string().min(1, "Колір не може бути порожнім").max(20, "Максимальна довжина 20 символів"),

    // Типи, які можуть бути обрані (припускаємо загальні категорії)
    at_type: z.enum(["Легкове", "Вантажне", "Електрокар", "Мотоцикл"], {
        message: "Оберіть тип транспортного засобу",
    }),
});

export type AutoFormValues = z.infer<typeof autoSchema>;

// Типи DTO, що відповідають твоєму прикладу ParkingSpace
export type CreateAutoDto = AutoFormValues; 
export type UpdateAutoDto = Partial<AutoFormValues>;