import { z } from "zod";

// Припускаємо можливі значення типів
const AutoTypes = ["Легкове", "Вантажне", "Електрокар", "Мотоцикл"] as const;
const ParkingSpaceTypes = ["Звичайне", "Преміум", "Критий", "Відкритий"] as const;

export const rateSchema = z.object({
    r_auto_type: z.enum(AutoTypes, {
        message: "Оберіть коректний тип авто",
    }),

    r_parking_space_type: z.enum(ParkingSpaceTypes, {
        message: "Оберіть коректний тип паркомісця",
    }),

    r_price_per_day: z.coerce
        .number({
            message: "Ціна повинна бути коректним числом",
        })
        .min(0, "Ціна не може бути від'ємною")
        .max(99999999.99, "Ціна занадто висока"), // Обмеження за Numeric(10, 2)

    r_date: z.string().min(1, "Дата не може бути порожньою"), // Очікуємо формат дати
});

export type RateFormValues = z.infer<typeof rateSchema>;
export type CreateRateDto = RateFormValues; 
export type UpdateRateDto = Partial<RateFormValues>;