"use client";

import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import {
  Box,
  InputAdornment,
  OutlinedInput,
  outlinedInputClasses,
  Typography,
} from "@mui/material";
import { useTransition } from "react";

import { useTaskFilters } from "@/features/tasks/hooks/useTaskFilters";
import { COLORS } from "@/theme/tokens";

const searchInputStyles = {
  width: "100%",
  maxWidth: "1024px",
  backgroundColor: "#f3f3f3",
  paddingLeft: "20px",
  [`&.${outlinedInputClasses.focused}`]: {
    backgroundColor: "unset",
  },
  [`& .${outlinedInputClasses.input}`]: {
    paddingTop: "12px",
    paddingBottom: "12px",
    "&::placeholder": {
      color: COLORS["$grey-12"],
      opacity: 1,
    },
  },
};

export default function SearchBar() {
  const { query, setQuery } = useTaskFilters();
  const [, startTransition] = useTransition();

  return (
    <Box
      sx={{
        backgroundColor: "white",
        padding: "26px 30px",
        display: "grid",
        gap: 2,
        gridTemplateColumns: "auto 1fr auto",
        alignItems: "center",
        mb: "30px",
        borderRadius: "10px",
      }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Задачи
      </Typography>
      <Box
        sx={{
          display: "grid",
          justifyItems: "center",
        }}
      >
        <OutlinedInput
          value={query}
          onChange={(e) => {
            const value = e.target.value;
            startTransition(() => {
              setQuery(value);
            });
          }}
          startAdornment={
            <InputAdornment position="start">
              <SearchOutlinedIcon
                sx={{ color: COLORS["$grey-12"], zIndex: 1 }}
              />
            </InputAdornment>
          }
          placeholder="Найти"
          sx={searchInputStyles}
        />
      </Box>
      <Typography
        variant="h6"
        className="up-md"
        sx={{ fontWeight: 600, color: "transparent" }}
      >
        Задачи
      </Typography>
    </Box>
  );
}
