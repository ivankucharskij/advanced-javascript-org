"use client";

import { Box, Typography } from "@mui/material";
import { PropsWithChildren } from "react";
import toast from "react-hot-toast";
import { SWRConfig } from "swr";

export const SWRConfigWrapper = ({ children }: PropsWithChildren) => (
  <SWRConfig
    value={{
      onError: (error) => {
        if (!error) return;

        toast.error(
          <Box
            sx={{
              maxWidth: 500,
              whiteSpace: "pre-wrap",
              wordBreak: "break-word",
            }}
          >
            <Typography variant="body2">
              {error.message || "Что-то пошло не так"}
            </Typography>
          </Box>,
        );
      },
    }}
  >
    {children}
  </SWRConfig>
);
