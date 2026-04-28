import { Box } from "@mui/material";
import type { GetTasks200 } from "@repo/api-client";

import FiltersBar from "@/features/tasks/components/filters";
import SearchBar from "@/features/tasks/components/search-bar";
import TaskTable from "@/features/tasks/components/task-table";
import { CommonError } from "@/features/tasks/types";
import { url } from "@/lib/url-builder";

export const dynamic = "force-dynamic";

async function fetchTasks(): Promise<GetTasks200> {
  const res = await fetch(url("/api/tasks", { limit: 5 }));

  if (!res.ok) {
    const parsed: CommonError = await res.json();
    throw new Error(JSON.stringify(parsed.details + parsed.message));
  }

  return (await res.json()) as GetTasks200;
}

export default async function ProductsPage() {
  const tasks = await fetchTasks();

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
      <TaskTable initialTasks={tasks} />
    </Box>
  );
}
