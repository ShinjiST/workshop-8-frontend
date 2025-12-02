import { z } from "zod";

export const checkoutSchema = z.object({
  // ID Договору (обов'язкове поле, унікальне)
  ag_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть договір" }).positive("Оберіть договір")
  ),

  // ID Співробітника (хто оформив виїзд)
  e_id: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Оберіть співробітника" }).positive("Оберіть співробітника")
  ),

  // Час виїзду
  ch_time: z.string().min(1, "Вкажіть час виїзду"),

  // Сума до сплати
  ch_amount: z.preprocess(
    (value) => Number(value),
    z.number({ message: "Введіть суму" })
      .min(0, "Сума не може бути від'ємною")
  ),

  // Статус виїзду
  ch_status: z.enum(["вчасно", "раніше", "пізно"], {
    message: "Оберіть статус (вчасно, раніше, пізно)",
  }),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;