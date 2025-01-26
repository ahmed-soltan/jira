import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";
import { useId } from "react";
import { toast } from "sonner";

import { client } from "@/lib/rpc";

type ResponseType = InferResponseType<
  (typeof client.api.auth.register)["$post"]
>;
type RequestType = InferRequestType<(typeof client.api.auth.register)["$post"]>;

export const useRegister = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const toastId = useId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      toast.loading("Creating Account....", { id: toastId });
      const response = await client.api.auth.register["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account Created Successfully!", { id: toastId });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError() {
      toast.error("Email Already Exist!", { id: toastId });
    },
  });

  return mutation;
};
