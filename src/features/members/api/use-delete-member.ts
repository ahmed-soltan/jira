import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

export const useDeleteMember = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({ param }: { param: { memberId: string } }) => {
      toast.loading("Deleting a Member....", { id: toastId });

      const response = await fetch(`/api/members/${param.memberId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        toast.error("Failed to Delete member", { id: toastId });
        throw new Error("Failed to Delete member");
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["members"] });
      toast.success("member Deleted Successfully!", { id: toastId });
    },
  });

  return mutation;
};
