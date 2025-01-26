import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

export const useDeleteWorkspace = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      param,
    }: {
      param: { workspaceId: string };
    }) => {
      toast.loading("Deleting a Workspace....", { id: toastId });

      const response = await fetch(`/api/workspaces/${param.workspaceId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to Delete workspace", { id: toastId });
        throw new Error("Failed to Delete workspace");
      }
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Workspace Deleted Successfully!", { id: toastId });
      return response.json();
    },
  });

  return mutation;
};
