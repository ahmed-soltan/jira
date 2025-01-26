"use client"

import { ResponsiveModal } from "@/components/responsive-modal";
import { CreateWorkspaceForm } from "./create-workspace-form";
import { useCreateWorkspaceModel } from "../hooks/use-create-workspace-modal";

const CreateWorkspaceModal = () => {
    const {isOpen , close , setIsOpen} = useCreateWorkspaceModel()
  return (
    <ResponsiveModal open={isOpen} onOpenChange={setIsOpen}>
      <CreateWorkspaceForm onCancel={close}/>
    </ResponsiveModal>
  );
};

export default CreateWorkspaceModal;
