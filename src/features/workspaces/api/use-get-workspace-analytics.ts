import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetWorkspaceAnalytics = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["workspace-analytics" , workspaceId],
    queryFn: async () => {
      const response = await client.api.workspaces[":workspaceId"]["analytics"]["$get"]({
        param: { workspaceId },
      });

      if (!response.ok) {
        return null;
      }

      console.log(response)

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
