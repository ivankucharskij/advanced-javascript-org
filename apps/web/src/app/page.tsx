import { Box, Typography } from "@mui/material";

import AuthForm from "@/features/auth/components/auth-form";

export default function AuthPage() {
  return (
    <Box
      sx={{
        minHeight: "100%",
        backgroundColor: "#f6f6f6",
        display: "grid",
        gridTemplateColumns: {
          xs: "minmax(0, 500px)",
          md: "minmax(0, 1000px) 500px",
        },
        alignItems: "start",
        justifyContent: "center",
        alignContent: { xs: "center", md: undefined },
        gap: { xs: 3, md: 6 },
        px: { xs: 2, sm: 4, md: 8 },
        py: { xs: 4, md: 6 },
      }}
    >
      <Box>
        <Typography variant="h3" component="h1" sx={{ mb: 2 }}>
          Рабочее пространство задач
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Войдите или создайте аккаунт, чтобы открыть список задач.
        </Typography>
      </Box>

      <AuthForm />
    </Box>
  );
}
