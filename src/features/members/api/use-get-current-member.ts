import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetCurrentMember = ({ workspaceId }: { workspaceId: string }) => {
  const query = useQuery({
    queryKey: ["currentMember" , workspaceId],
    queryFn: async () => {
      const response = await client.api.members["current"]["$get"]({
        query: { workspaceId },
      });

      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
