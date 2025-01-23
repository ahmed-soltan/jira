import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";
import axios from "axios";

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ form }: { form: FormData }) => {
      toast.loading("Creating a Workspace....", { id: toastId });
  
      const response = await fetch("/api/workspaces", {
        method: "POST",
        body: form,
      });
  
      if (!response.ok) {
        toast.error("Failed to create workspace", { id: toastId });
        throw new Error("Failed to create workspace");
      };
      toast.success("Workspace Created Successfully!", { id: toastId });
      return response.json();
    },
  });

  return mutation;
};
