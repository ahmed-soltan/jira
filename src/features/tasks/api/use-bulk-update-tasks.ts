import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";

import { client } from "@/lib/rpc";

type RequestType = InferRequestType<
  (typeof client.api.tasks)["bulk-updates"]["$post"]
>;
type ResponseType = InferResponseType<
  (typeof client.api.tasks)["bulk-updates"]["$post"],
  200
>;

export const useBulkUpdateTasks = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      const response = await client.api.tasks["bulk-updates"]["$post"]({
        json,
      });
      if (!response.ok) {
        toast.error("Failed to Update tasks");
        throw new Error("Failed to Update tasks");
      }
      return await response.json();
    },
    onSuccess() {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  return mutation;
};
