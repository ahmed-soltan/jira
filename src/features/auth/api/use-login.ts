import { useMutation, useQueryClient } from "@tanstack/react-query";
import { InferRequestType, InferResponseType } from "hono";
import { useRouter } from "next/navigation";

import { client } from "@/lib/rpc";
import { toast } from "sonner";
import { useId } from "react";

type ResponseType = InferResponseType<(typeof client.api.auth.login)["$post"]>;
type RequestType = InferRequestType<(typeof client.api.auth.login)["$post"]>;

export const useLogin = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const toastId = useId();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async ({ json }) => {
      toast.loading("Signing in....", { id: toastId });
      const response = await client.api.auth.login["$post"]({ json });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Signed In Successfully!", { id: toastId });
      router.refresh();
      queryClient.invalidateQueries({ queryKey: ["current"] });
    },
    onError: () => {
      toast.error("Invalid Credentials", { id: toastId });
    },
  });

  return mutation;
};
