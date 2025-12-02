import { z } from "zod";

export const parkingZoneSchema = z.object({
  pz_name: z.string().min(1, "Назва зони не може бути порожньою"),

  pz_capacity: z.coerce
    .number()
    .int("Місткість має бути цілим числом")
    .positive("Місткість має бути більше 0"),
});

export type ParkingZoneFormValues = z.infer<typeof parkingZoneSchema>;