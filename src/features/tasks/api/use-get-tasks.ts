import { client } from "@/lib/rpc";
import { useQuery } from "@tanstack/react-query";
import { TaskStatus } from "../types";

interface UeGetTasksProps {
  workspaceId: string;
  projectId?: string | null;
  status?: TaskStatus | null;
  assigneeId?: string | null;
  dueDate?: string | null;
  search?: string | null;
}

export const useGetTasks = ({
  workspaceId,
  projectId,
  status,
  assigneeId,
  dueDate,
  search,
}: UeGetTasksProps) => {
  const query = useQuery({
    queryKey: [
      "tasks",
      workspaceId,
      projectId,
      status,
      assigneeId,
      dueDate,
      search,
    ],
    queryFn: async () => {
      const response = await client.api.tasks["$get"]({
        query: { 
          workspaceId,
          projectId : projectId ?? undefined, 
          status : status?? undefined, 
          assigneeId : assigneeId?? undefined, 
          dueDate : dueDate?? undefined, 
          search : search?? undefined, 
         },
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
