import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProjectAnalytics = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["project-analytics" , projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"]["analytics"]["$get"]({
        param: { projectId },
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
