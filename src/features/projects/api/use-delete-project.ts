import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

export const useDeleteProject = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      param,
    }: {
      param: { projectId: string };
    }) => {
      toast.loading("Deleting a project....", { id: toastId });

      const response = await fetch(`/api/projects/${param.projectId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to Delete project", { id: toastId });
        throw new Error("Failed to Delete project");
      }
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      toast.success("project Deleted Successfully!", { id: toastId });
      return response.json();
    },
  });

  return mutation;
};
