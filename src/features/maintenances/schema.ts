import { z } from "zod";

export const maintenanceSchema = z.object({
  // Дата (рядок з input type="date")
  m_date: z.string().min(1, "Оберіть дату проведення"),

  // Опис
  m_description: z.string()
    .min(1, "Опишіть проведені роботи")
    .max(500, "Опис занадто довгий (макс 500)"),

  // Вартість
  // Використовуємо preprocess, як у прикладі з інцидентами
  m_cost: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Введіть коректну вартість" })
      .min(0, "Вартість не може бути від'ємною")
  ),

  // ID Паркомісця
  ps_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть паркомісце" })
      .int()
      .positive("Оберіть паркомісце")
  ),

  // ID Співробітника
  e_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть співробітника" })
      .int()
      .positive("Оберіть співробітника")
  ),
});

export type MaintenanceFormValues = z.infer<typeof maintenanceSchema>;