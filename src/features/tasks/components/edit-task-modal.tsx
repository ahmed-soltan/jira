"use client";

import { ResponsiveModal } from "@/components/responsive-modal";

import { useEditTaskModel } from "../hooks/use-edit-task-modal";
import { EditTaskFormWrapper } from "./edit-task-form-wrapper";

export const EditTaskModal = () => {
  const { taskId, close } = useEditTaskModel();
  return (
    <ResponsiveModal open={!!taskId} onOpenChange={close}>
      {taskId && <EditTaskFormWrapper onCancel={close} id={taskId}/>}
    </ResponsiveModal>
  );
};
