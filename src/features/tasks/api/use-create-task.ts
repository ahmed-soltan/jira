import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";
import { InferRequestType, InferResponseType } from "hono";
import { client } from "@/lib/rpc";

type RequestType = InferRequestType<typeof client.api.tasks.$post>;
type ResponseType = InferResponseType<typeof client.api.tasks.$post, 200>;

export const useCreateTask = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      toast.loading("Creating a task....", { id: toastId });

      const response = await client.api.tasks.$post({ json });
      if (!response.ok) {
        toast.error("Failed to create task", { id: toastId });
        throw new Error("Failed to create task");
      }
      return await response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      toast.success("task Created Successfully!", { id: toastId });
    },
  });

  return mutation;
};
