import { z } from "zod";

const emailSchema = z.string().min(1, "Почта обязательна").email("Неверный формат почты");
const passwordSchema = z.string()
    .min(1, "Пароль обязателен")
    .min(6, "Пароль должен быть не менее 6 символов");

export const signInSchema = z.object({
    email: emailSchema,
    password: passwordSchema
});


export const signUpSchema = z.object({
    username: z.string().min(2, "Имя слишком короткое"),
    email: emailSchema,
    password: passwordSchema
});
