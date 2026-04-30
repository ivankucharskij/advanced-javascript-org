import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";
import {
  Dialog,
  DialogTitle,
  IconButton,
  Menu,
  MenuItem,
  Tooltip,
  Typography,
} from "@mui/material";
import type {
  DeleteTasksBody,
  GetTasks200DataItem,
  PatchTasksIdBody,
} from "@repo/api-client";
import { useState } from "react";
import useSWRMutation from "swr/mutation";

import FormFields from "@/features/tasks/components/form-fields";
import { usePopover } from "@/features/tasks/hooks/usePopover";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { EditTaskFormSchema } from "@/features/tasks/task-form.schema";
import { api } from "@/lib/api";

export default function RemoveAndEdit({ task }: { task: GetTasks200DataItem }) {
  const [dialogOpened, setDialogOpened] = useState(false);
  const { mutate } = useTasks({});
  const { handleOpen, popoverProps, handleClose } = usePopover();

  const { trigger: triggerRemoveMany, isMutating: isRemovingMany } =
    useSWRMutation<unknown, unknown, string, DeleteTasksBody>(
      "/api/tasks",
      (url, { arg }) => api.delete(url, { data: arg }),
    );

  const { trigger: triggerEdit, isMutating: isEditing } = useSWRMutation<
    unknown,
    unknown,
    string,
    PatchTasksIdBody
  >(`/api/tasks/${task.id}`, (url, { arg }) => api.patch(url, arg));

  return (
    <>
      <Dialog
        onClose={() => {
          setDialogOpened(false);
          handleClose();
        }}
        open={dialogOpened}
      >
        <DialogTitle variant={"h5"}>Редактировать задачу</DialogTitle>
        <FormFields
          handleClose={handleClose}
          schema={EditTaskFormSchema}
          loading={isEditing}
          defaultValues={task}
          editDataCallback={async (values) => {
            await triggerEdit(values);
            await mutate();
            setDialogOpened(false);
            handleClose();
          }}
        />
      </Dialog>
      <Tooltip title="Открыть действия">
        <IconButton
          aria-label="Открыть действия"
          size={"small"}
          sx={{ borderRadius: "23px" }}
          loading={isRemovingMany || isEditing}
          onClick={(e) => {
            e.stopPropagation();
            handleOpen(e);
          }}
        >
          <MoreVertOutlinedIcon />
        </IconButton>
      </Tooltip>
      <Menu {...popoverProps} onClick={(e) => e.stopPropagation()}>
        <MenuItem
          aria-label="Редактировать задачу"
          sx={{ gap: 1 }}
          onClick={() => {
            setDialogOpened(true);
          }}
        >
          <EditOutlinedIcon fontSize="small" />
          <Typography variant={"body2"}>Редактировать</Typography>
        </MenuItem>
        <MenuItem
          aria-label="Удалить задачу"
          sx={{ gap: 1 }}
          onClick={() => {
            triggerRemoveMany({ ids: [task.id] })
              .then(() => mutate())
              .then(handleClose);
          }}
        >
          <DeleteOutlinedIcon fontSize="small" />
          <Typography variant={"body2"}>Удалить</Typography>
        </MenuItem>
      </Menu>
    </>
  );
}
