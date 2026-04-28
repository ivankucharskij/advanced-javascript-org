import type { GetTasks200, GetTasksParams } from "@repo/api-client";
import { useState } from "react";
import useSWR from "swr";
import { useDebounceValue } from "usehooks-ts";

import { useTaskFilters } from "@/features/tasks/hooks/useTaskFilters";
import { useTaskOrder } from "@/features/tasks/hooks/useTaskOrder";
import { api } from "@/lib/api";

const LIMIT = 5;

export const useTasks = ({ initialTasks }: { initialTasks?: GetTasks200 }) => {
  const { order, sortBy } = useTaskOrder();
  const { priority, status, dueDateStart, dueDateEnd, query } =
    useTaskFilters();
  const [page, setPage] = useState(1);
  const [debouncedQuery] = useDebounceValue(query, 500);

  const data = useSWR<GetTasks200 | undefined, unknown, GetTasksParams>(
    {
      page,
      order: sortBy !== undefined ? order : undefined,
      sortBy: sortBy ?? undefined,
      q: debouncedQuery,
      priority: priority ?? undefined,
      status: status ?? undefined,
      dueDateStart:
        dueDateStart !== null ? dueDateStart.toISOString() : undefined,
      dueDateEnd: dueDateEnd !== null ? dueDateEnd.toISOString() : undefined,
      limit: LIMIT,
    },
    async (params) => {
      const response = await api.get<GetTasks200>("/api/tasks", {
        params,
      });

      return response.data;
    },
    {
      keepPreviousData: true,
      fallbackData: initialTasks,
      revalidateOnMount: false,
      revalidateOnFocus: false,
    },
  );

  return {
    ...data,
    page,
    setPage,
  };
};
