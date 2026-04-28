import type { GetTasksSortBy } from "@repo/api-client";
import { create } from "zustand";

import { Order } from "@/features/tasks/types";

type TaskOrderState = {
  order: Order;
  sortBy: GetTasksSortBy | null;

  setOrder: (order: Order) => void;
  setSortBy: (sortBy: GetTasksSortBy | null) => void;

  resetSorting: () => void;
};

export const useTaskOrder = create<TaskOrderState>((set) => ({
  order: "asc",
  sortBy: null,

  setOrder: (order) => set({ order }),
  setSortBy: (sortBy) => set({ sortBy }),

  resetSorting: () => set({ order: "asc", sortBy: null }),
}));
