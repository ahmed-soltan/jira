"use client";

import { ResponsiveModal } from "@/components/responsive-modal";
import { useCreateProjectModel } from "../hooks/use-create-project-modal";
import { CreateProjectForm } from "./create-project-form";

const CreateProjectModal = () => {
  const { isOpen, close, setIsOpen } = useCreateProjectModel();
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateProjectForm onCancel={close} />
    </ResponsiveModal>
  );
};

export default CreateProjectModal;
