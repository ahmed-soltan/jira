import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";

export const useGetRepo = () => {
  const query = useQuery({
    queryKey: ["repos"],
    queryFn: async () => {
      const response = await  await client.api.projects["repos"]["$get"]();

      if (!response.ok) {
        return null;
      }

      console.log(response);

      const data = await response.json();

      return data;
    },
  });

  return query;
};
