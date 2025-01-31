"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateTaskFormWrapper } from "./create-task-form-wrapper";

import { useCreateTaskModel } from "../hooks/use-create-task-modal";

const CreateTaskModal = () => {
  const { data, close } = useCreateTaskModel();
  return (
    <ResponsiveModal open={data.isOpen} onOpenChange={close}>
      <CreateTaskFormWrapper onCancel={close} initialStatus={data.initialStatus}/>
    </ResponsiveModal>
  );
};

export default CreateTaskModal;
