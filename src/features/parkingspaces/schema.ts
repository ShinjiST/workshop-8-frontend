import { z } from "zod";

export const parkingSpaceSchema = z.object({
  ps_number: z.string().min(1, "Номер місця не може бути порожнім"),

  ps_level: z.coerce
    .number()
    .int("Рівень має бути цілим числом")
    .min(0, "Рівень не може бути від'ємним"),

  ps_status: z.enum(["вільне", "зайняте", "зарезервоване"], {
    message: "Оберіть статус",
  }),

  ps_auto_type: z.enum(["Легкове", "Вантажне", "Електрокар"], {
    message: "Оберіть тип авто",
  }),

  pz_id: z.coerce
    .number()
    .int("ID має бути цілим числом")
    .positive("Оберіть зону зі списку"),
});

export type ParkingSpaceFormValues = z.infer<typeof parkingSpaceSchema>;