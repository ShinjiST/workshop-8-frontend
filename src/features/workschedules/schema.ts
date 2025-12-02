import { z } from "zod";

export const workScheduleSchema = z.object({
  ws_date: z.string().min(1, "Оберіть дату"),

  // Використовуємо z.preprocess для безпечного перетворення рядка в число
  sh_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть зміну зі списку" }) // Замінили invalid_type_error на message
      .int("ID зміни має бути цілим числом")
      .positive("Оберіть зміну зі списку")
  ),

  e_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть працівника зі списку" }) // Замінили invalid_type_error на message
      .int("ID працівника має бути цілим числом")
      .positive("Оберіть працівника зі списку")
  ),
});

export type WorkScheduleFormValues = z.infer<typeof workScheduleSchema>;