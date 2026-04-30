import axios from "axios";

const apiErrorTranslations: Record<string, string> = {
  "User with this email already exists":
    "Пользователь с такой электронной почтой уже существует",
  "Invalid email or password": "Неверная электронная почта или пароль",
  "User is blocked": "Пользователь заблокирован",
  "Missing access token": "Отсутствует токен доступа",
  "Invalid token": "Недействительный токен",
  "Admin role required": "Требуется роль администратора",
  Forbidden: "Доступ запрещен",
  "User not found": "Пользователь не найден",
  "Parent task not found": "Родительская задача не найдена",
  "Task not found": "Задача не найдена",
};

export const translateApiError = (message: string) =>
  apiErrorTranslations[message] ?? message;

export const api = axios.create({
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error?.response?.data?.message ||
      error?.response?.data?.error ||
      error.message ||
      "Что-то пошло не так";

    return Promise.reject(new Error(translateApiError(message)));
  },
);
