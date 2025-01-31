import { useId } from "react";
import { toast } from "sonner";
import { InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.projects)[":projectId"]["$patch"],
  200
>;

export const useUpdateProject = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation<
    ResponseType,
    Error,
    { form: FormData; param: { projectId: string } }
  >({
    mutationFn: async ({ form, param }) => {
      toast.loading("Updating project...", { id: toastId });

      const response = await fetch(`/api/projects/${param.projectId}`, {
        method: "PATCH",
        body: form,
      });

      if (!response.ok) {
        toast.error("Failed to update project", { id: toastId });
        throw new Error("Failed to update project");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("project Updated Successfully!", { id: toastId });
      queryClient.invalidateQueries({ queryKey: ["projects"] });
      queryClient.invalidateQueries({ queryKey: ["project", data.$id] });
    },
    onError(error) {
      console.log(error);
      toast.error(error.message || "Failed to update project!", {
        id: toastId,
      });
    },
  });

  return mutation;
};
