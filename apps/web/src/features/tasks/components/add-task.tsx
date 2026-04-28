import { Dialog, DialogTitle } from "@mui/material";
import type { PostTasksBody } from "@repo/api-client";
import useSWRMutation from "swr/mutation";

import FormFields from "@/features/tasks/components/form-fields";
import { useTasks } from "@/features/tasks/hooks/useTasks";
import { AddTaskFormSchema } from "@/features/tasks/task-form.schema";
import { api } from "@/lib/api";

export default function AddTask({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (param: boolean) => void;
}) {
  const handleClose = () => {
    setOpen(false);
  };

  const { mutate } = useTasks({});
  const { trigger: triggerEdit, isMutating: isEditing } = useSWRMutation<
    unknown,
    unknown,
    string,
    PostTasksBody
  >(`/api/tasks`, (url, { arg }) => api.post(url, arg));

  return (
    <>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle variant={"h5"}>Добавить товар</DialogTitle>
        <FormFields
          handleClose={handleClose}
          schema={AddTaskFormSchema}
          loading={isEditing}
          addDataCallback={async (values) => {
            await triggerEdit(values);
            await mutate();
            handleClose();
          }}
        />
      </Dialog>
    </>
  );
}
