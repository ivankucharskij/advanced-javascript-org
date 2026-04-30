import { startOfDay, subYears } from "date-fns";
import z from "zod";

export const LoginFormSchema = z.object({
  email: z.email("Введите корректный адрес электронной почты"),
  password: z.string().min(1, "Введите пароль"),
});

export const RegisterFormSchema = LoginFormSchema.extend({
  fullName: z.string().trim().min(1, "Введите полное имя"),
  birthDate: z
    .date()
    .nullable()
    .refine((date) => Boolean(date), "Выберите дату рождения")
    .refine(
      (date) => !date || date <= startOfDay(new Date()),
      "Дата рождения не может быть в будущем",
    )
    .refine(
      (date) => !date || date >= subYears(new Date(), 120),
      "Проверьте дату рождения",
    ),
  password: z.string().min(8, "Пароль должен содержать минимум 8 символов"),
});

export type LoginFormFields = z.infer<typeof LoginFormSchema>;
export type RegisterFormFields = z.infer<typeof RegisterFormSchema>;
export type AuthFormFields = LoginFormFields & Partial<RegisterFormFields>;
