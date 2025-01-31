import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

interface UeGetTaskProps {
  taskId: string;
}

export const useGetTask = ({ taskId }: UeGetTaskProps) => {
  const query = useQuery({
    queryKey: ["task", taskId],
    queryFn: async () => {
      const response = await client.api.tasks[":taskId"]["$get"]({
        param: { taskId },
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
