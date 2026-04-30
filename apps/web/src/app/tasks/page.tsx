import { Box, Typography } from "@mui/material";
import type { GetTasks200 } from "@repo/api-client";
import { headers } from "next/headers";

import FiltersBar from "@/features/tasks/components/filters";
import SearchBar from "@/features/tasks/components/search-bar";
import TaskTable from "@/features/tasks/components/task-table";
import { CommonError } from "@/features/tasks/types";
import { translateApiError } from "@/lib/api";
import { url } from "@/lib/url-builder";

export const dynamic = "force-dynamic";

async function fetchTasks(): Promise<GetTasks200> {
  const cookieHeader = (await headers()).get("cookie");
  const res = await fetch(url("/api/tasks", { limit: 5 }), {
    cache: "no-store",
    headers: cookieHeader ? { Cookie: cookieHeader } : {},
  });

  if (!res.ok) {
    const parsed = (await res.json().catch(() => null)) as
      | Partial<CommonError>
      | null;
    const message =
      parsed?.message ?? `API request failed with status ${res.status}`;

    throw new Error(translateApiError(message));
  }

  return (await res.json()) as GetTasks200;
}

export default async function TasksPage() {
  let tasks: GetTasks200 | null = null;
  let errorMessage: string | null = null;

  try {
    tasks = await fetchTasks();
  } catch (e) {
    errorMessage =
      e instanceof Error ? e.message : "Не удалось загрузить задачи";
  }

  return (
    <Box
      sx={{
        backgroundColor: "#f6f6f6",
        pt: 2.5,
        height: "100%",
      }}
    >
      <SearchBar />
      <FiltersBar />
      {tasks ? (
        <TaskTable initialTasks={tasks} />
      ) : (
        <Box
          sx={{
            backgroundColor: "white",
            padding: "30px",
            height: "100%",
            borderRadius: "10px",
          }}
        >
          <Typography sx={{ color: "error.main" }}>{errorMessage}</Typography>
        </Box>
      )}
    </Box>
  );
}
