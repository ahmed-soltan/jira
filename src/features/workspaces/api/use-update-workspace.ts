import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";
import { useRouter } from "next/navigation";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import axios from "axios";

type ResponseType = InferResponseType<
  (typeof client.api.workspaces)[":workspaceId"]["$patch"],
  200
>;

export const useUpdateWorkspace = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation<
    ResponseType,
    Error,
    { form: FormData; param: { workspaceId: string } }
  >({
    mutationFn: async ({ form, param }) => {
      toast.loading("Updating Workspace...", { id: toastId });

      const response = await fetch(`/api/workspaces/${param.workspaceId}`, {
        method: "PATCH",
        body: form,
      });

      if (!response.ok) {
        toast.error("Failed to update workspace", { id: toastId });
        throw new Error("Failed to update workspace");
      }

      return await response.json();
    },
    onSuccess: ({ data }) => {
      toast.success("Workspace Updated Successfully!", { id: toastId });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
    },
    onError(error) {
      console.log(error);
      toast.error(error.message || "Failed to update workspace!", {
        id: toastId,
      });
    },
  });

  return mutation;
};
