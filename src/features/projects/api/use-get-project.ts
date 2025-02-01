import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetProject = ({ projectId }: { projectId: string }) => {
  const query = useQuery({
    queryKey: ["project" , projectId],
    queryFn: async () => {
      const response = await client.api.projects[":projectId"]["$get"]({
        param: { projectId },
      });

      console.log(response)


      if (!response.ok) {
        return null;
      }

      const { data } = await response.json();

      return data;
    },
  });

  return query;
};
