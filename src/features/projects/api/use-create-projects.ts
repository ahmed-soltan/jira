import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

export const useCreateProject = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ form }: { form: FormData }) => {
      toast.loading("Creating a project....", { id: toastId });
  
      const response = await fetch("/api/projects", {
        method: "POST",
        body: form,
      });
  
      if (!response.ok) {
        toast.error("Failed to create project", { id: toastId });
        throw new Error("Failed to create project");
      };
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("project Created Successfully!", { id: toastId });
      return response.json();
    },
  });

  return mutation;
};
