import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";
import { useRouter } from "next/navigation";

export const useResetInviteCode = () => {
  const queryClient = useQueryClient();
  const toastId = useId();
  const router = useRouter()

  const mutation = useMutation({
    mutationFn: async ({ param }: { param: { workspaceId: string } }) => {
      toast.loading("Resting Invite Code....", { id: toastId });

      const response = await fetch(
        `/api/workspaces/${param.workspaceId}/reset-invite-code`,
        {
          method: "POST",
        }
      );

      if (!response.ok) {
        toast.error("Failed to Reset Invite Code", { id: toastId });
        throw new Error("Failed to Reset Invite Code");
      }

      router.refresh()
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      toast.success("Invite Code reset Successfully!", { id: toastId });
      return response.json();
    },
  });

  return mutation;
};
