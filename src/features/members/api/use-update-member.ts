import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

import { client } from "@/lib/rpc";
import { MemberRole } from "../types";

export const useUpdateMember = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      param,
      json,
    }: {
      param: { memberId: string };
      json: { role: MemberRole };
    }) => {
      toast.loading("Updating a Member....", { id: toastId });

      const response = await client.api.members[":memberId"]["$patch"]({
        param,
        json,
      });

      if (!response.ok) {
        toast.error("Failed to update member", { id: toastId });
        throw new Error("Failed to Delete member");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("member updated Successfully!", { id: toastId });
    },
  });

  return mutation;
};
