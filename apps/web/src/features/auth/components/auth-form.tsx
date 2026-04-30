"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import {
  Alert,
  Box,
  Button,
  OutlinedInput,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ruRU } from "@mui/x-date-pickers/locales";
import type {
  PostAuthLogin200,
  PostAuthLoginBody,
  PostAuthRegister201,
  PostAuthRegisterBody,
} from "@repo/api-client";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useSWRMutation from "swr/mutation";

import {
  AuthFormFields,
  LoginFormSchema,
  RegisterFormSchema,
} from "@/features/auth/auth-form.schema";
import { api } from "@/lib/api";

type AuthMode = "login" | "register";
type AuthEndpoint = "/api/auth/login" | "/api/auth/register";
type AuthResponse = PostAuthLogin200 | PostAuthRegister201;
type AuthBody = PostAuthLoginBody | PostAuthRegisterBody;

const defaultValues: AuthFormFields = {
  email: "",
  password: "",
  fullName: "",
  birthDate: null,
};

const ruLocale =
  ruRU.components.MuiLocalizationProvider.defaultProps.localeText;

export default function AuthForm() {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>("login");
  const [submitError, setSubmitError] = useState<string | null>(null);
  const schema = useMemo(
    () => (mode === "login" ? LoginFormSchema : RegisterFormSchema),
    [mode],
  );

  const endpoint: AuthEndpoint =
    mode === "login" ? "/api/auth/login" : "/api/auth/register";

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<AuthFormFields>({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const { trigger, isMutating } = useSWRMutation<
    AuthResponse,
    Error,
    AuthEndpoint,
    AuthBody
  >(endpoint, async (url: AuthEndpoint, { arg }: { arg: AuthBody }) => {
    const response = await api.post<AuthResponse>(url, arg);
    return response.data;
  });

  const changeMode = (_: unknown, nextMode: AuthMode) => {
    setMode(nextMode);
    setSubmitError(null);
    reset(defaultValues);
  };

  const onSubmit = async (data: AuthFormFields) => {
    setSubmitError(null);

    try {
      await trigger(toAuthBody(mode, data));

      toast.success(mode === "login" ? "Вы вошли" : "Аккаунт создан");
      router.push("/tasks");
      router.refresh();
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Не удалось выполнить вход",
      );
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "600px",
        backgroundColor: "white",
        borderRadius: "10px",
        px: { xs: 2.5, sm: 3 },
        py: 3,
        boxShadow: "0 18px 50px rgba(35, 35, 35, 0.08)",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600, mb: 0.5 }}>
        {mode === "login" ? "Вход" : "Создание аккаунта"}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
        Используйте аккаунт для доступа к задачам.
      </Typography>

      <Tabs
        value={mode}
        onChange={changeMode}
        variant="fullWidth"
        sx={{ mb: 2 }}
      >
        <Tab value="login" label="Вход" />
        <Tab value="register" label="Регистрация" />
      </Tabs>

      <Box
        component="form"
        sx={{ display: "grid", gap: 2 }}
        onSubmit={handleSubmit(onSubmit)}
      >
        {mode === "register" && (
          <>
            <Field
              label="Полное имя"
              error={errors.fullName?.message}
              {...register("fullName")}
            />

            <Controller
              name="birthDate"
              control={control}
              render={({ field }) => (
                <DateField
                  label="Дата рождения"
                  error={errors.birthDate?.message}
                  value={field.value ?? null}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              )}
            />
          </>
        )}

        <Field
          label="Электронная почта"
          error={errors.email?.message}
          {...register("email")}
        />

        <Field
          label="Пароль"
          type="password"
          error={errors.password?.message}
          {...register("password")}
        />

        {submitError && <Alert severity="error">{submitError}</Alert>}

        <Button
          size="large"
          variant="contained"
          type="submit"
          loading={isMutating}
          startIcon={
            mode === "login" ? (
              <LoginOutlinedIcon />
            ) : (
              <PersonAddAltOutlinedIcon />
            )
          }
          sx={{ mt: 1 }}
        >
          {mode === "login" ? "Войти" : "Создать аккаунт"}
        </Button>
      </Box>
    </Box>
  );
}

const toAuthBody = (mode: AuthMode, data: AuthFormFields): AuthBody => {
  if (mode === "login") {
    return {
      email: data.email,
      password: data.password,
    };
  }

  return {
    fullName: data.fullName ?? "",
    birthDate: data.birthDate ? format(data.birthDate, "yyyy-MM-dd") : "",
    email: data.email,
    password: data.password,
  };
};

const Field = ({
  label,
  error,
  ...inputProps
}: {
  label: string;
  error?: string;
  type?: string;
}) => {
  return (
    <Box sx={{ display: "grid", gap: 0.5, textAlign: "left" }}>
      <Typography variant="h6" component="div">
        {label}
      </Typography>
      <OutlinedInput size="small" {...inputProps} error={Boolean(error)} />
      <ErrorText error={error} />
    </Box>
  );
};

const DateField = ({
  label,
  error,
  value,
  onChange,
  onBlur,
}: {
  label: string;
  error?: string;
  value: Date | null;
  onChange: (value: Date | null) => void;
  onBlur: () => void;
}) => {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={ru}
      localeText={ruLocale}
    >
      <Box sx={{ display: "grid", gap: 0.5, textAlign: "left" }}>
        <Typography variant="h6" component="div">
          {label}
        </Typography>
        <DesktopDatePicker
          value={value}
          onChange={onChange}
          slotProps={{
            textField: {
              error: Boolean(error),
              onBlur,
              variant: "outlined",
              size: "small",
            },
          }}
        />
        <ErrorText error={error} />
      </Box>
    </LocalizationProvider>
  );
};

const ErrorText = ({ error }: { error?: string }) =>
  error && (
    <Typography variant="caption" color="error">
      {error}
    </Typography>
  );
