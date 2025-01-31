import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type RequestType = InferRequestType<typeof client.api.tasks[":taskId"]["$delete"]>;
type ResponseType = InferResponseType<typeof client.api.tasks[":taskId"]["$delete"], 200>;

export const useDeleteTask = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ param }) => {
      toast.loading("Deleting a task....", { id: toastId });

      const response = await client.api.tasks[":taskId"]["$delete"]({ param });
      if (!response.ok) {
        toast.error("Failed to delete task", { id: toastId });
        throw new Error("Failed to delete task");
      }
      return await response.json();
    },
    onSuccess({data}) {
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task" , data.$id] });
      toast.success("task deleted Successfully!", { id: toastId });
    },
  });

  return mutation;
};
