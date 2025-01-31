import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";
import { useRouter } from "next/navigation";

type RequestType = InferRequestType<
  (typeof client.api.tasks)[":taskId"]["$patch"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.tasks)[":taskId"]["$patch"],
  200
>;

export const useUpdateTask = () => {
  const router = useRouter()
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json, param }) => {
      toast.loading("Updating a task....", { id: toastId });

      const response = await client.api.tasks[":taskId"]["$patch"]({
        param,
        json,
      });
      if (!response.ok) {
        toast.error("Failed to Update task", { id: toastId });
        throw new Error("Failed to Update task");
      }
      return await response.json();
    },
    onSuccess({ data }) {
      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      queryClient.invalidateQueries({ queryKey: ["task", data.$id] });
      toast.success("task Updated Successfully!", { id: toastId });
    },
  });

  return mutation;
};
