// src/features/agreements/schema.ts
import { z } from "zod";

export const agreementSchema = z.object({
  // Дата укладання
  ag_date: z.string().min(1, "Оберіть дату початку"),

  // Тривалість (дні)
  ag_duration_days: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Введіть кількість днів" })
      .int("Має бути цілим числом")
      .min(1, "Мінімальна тривалість - 1 день")
  ),
  
  a_total: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Сума є обов'язковою" })
      .min(0, "Сума не може бути від'ємною")
  ),
  
  // Статус
  a_status: z.enum(["активний", "завершений"], {
    message: "Оберіть статус (активний або завершений)",
  }),

  // ID Клієнта
  c_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть клієнта" }).positive("Оберіть клієнта")
  ),

  // ID Авто
  at_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть авто" }).positive("Оберіть авто")
  ),

  // ID Тарифу
  r_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть тариф" }).positive("Оберіть тариф")
  ),

  // ID Паркомісця
  ps_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть паркомісце" }).positive("Оберіть паркомісце")
  ),

  // ID Співробітника
  e_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть співробітника" }).positive("Оберіть співробітника")
  ),
});

export type AgreementFormValues = z.infer<typeof agreementSchema>;