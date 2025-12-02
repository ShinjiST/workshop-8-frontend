// src/features/shifts/schema.ts
import { z } from "zod";

export const shiftSchema = z.object({
  sh_name: z.string().min(1, "Назва зміни обов'язкова"),
  
  // Валідація часу (рядок). HTML input type="time" повертає рядок "HH:MM"
  sh_start_time: z.string().min(1, "Час початку обов'язковий"),
  
  sh_end_time: z.string().min(1, "Час закінчення обов'язковий"),
  
  // Якщо статусів небагато, можна використати z.enum(["active", "inactive"]), 
  // але поки залишаємо string, щоб було універсально
  sh_status: z.string().min(1, "Статус обов'язковий"),
});

export type ShiftFormValues = z.infer<typeof shiftSchema>;