import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useId } from "react";

import { client } from "@/lib/rpc";

export const useJoinWorkspace = () => {
  const queryClient = useQueryClient();
  const toastId = useId();

  const mutation = useMutation({
    mutationFn: async ({
      param,
      json,
    }: {
      param: { workspaceId: string };
      json: { code: string };
    }) => {
      toast.loading("Joining Workspace....", { id: toastId });

      const response = await client.api.workspaces[":workspaceId"]["join"][
        "$post"
      ]({ param, json });

      if (!response.ok) {
        toast.error("Failed to Join workspace", { id: toastId });
        throw new Error("Failed to Reset Invite Code");
      }

      return response.json();
    },
    onSuccess: ({ data }) => {
      queryClient.invalidateQueries({ queryKey: ["workspaces"] });
      queryClient.invalidateQueries({ queryKey: ["workspace", data.$id] });
      toast.success("Joined Workspace Successfully!", { id: toastId });
    },
  });

  return mutation;
};
