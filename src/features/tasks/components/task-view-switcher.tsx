"use client";

import { useCallback } from "react";
import { useQueryState } from "nuqs";
import { Loader, PlusIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { columns } from "./columns";
import { DataTable } from "./data-table";
import { DataFilters } from "./data-filters";
import { DataCalendar } from "./data-calendar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { DottedSeparator } from "@/components/dotted-separator";
import { DataKanban, UploadUpdatesType } from "./data-kanban";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetTasks } from "../api/use-get-tasks";
import { useTaskFilters } from "../hooks/use-task-filters";
import { useCreateTaskModel } from "../hooks/use-create-task-modal";
import { useBulkUpdateTasks } from "../api/use-bulk-update-tasks";
import { useProjectId } from "@/features/projects/hooks/use-project-id";

interface TaskViewSwitcherProps {
  hideProjectFilter?: boolean;
}

export const TaskViewSwitcher = ({
  hideProjectFilter,
}: TaskViewSwitcherProps) => {
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [{ assigneeId, dueDate, search, projectId: urlProjectId, status }, _] =
    useTaskFilters();
  const [view, setView] = useQueryState("task-view", {
    defaultValue: "table",
  });
  const projectId = useProjectId();

  const { mutate: bulkUpdateTasks } = useBulkUpdateTasks();

  const workspaceId = useWorkspaceId();
  const { open } = useCreateTaskModel();
  const { data: tasks, isLoading: isLoadingTasks } = useGetTasks({
    workspaceId,
    assigneeId,
    dueDate,
    search,
    projectId: urlProjectId || projectId,
    status,
  });


  
  const onKanbanChange = useCallback((tasks: UploadUpdatesType[]) => {
    bulkUpdateTasks({ json: { tasks } });
  }, [bulkUpdateTasks]);
  
  return (
    <Tabs
      className="flex-1 w-full border rounded-lg"
      defaultValue={view}
      onValueChange={setView}
    >
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="h-8 w-full lg:w-auto" value="table">
              Table
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="kanban">
              Kanban
            </TabsTrigger>
            <TabsTrigger className="h-8 w-full lg:w-auto" value="calender">
              Calender
            </TabsTrigger>
          </TabsList>
          <Button
            size={"sm"}
            className="w-full lg:w-auto"
            onClick={() =>
              open({
                isOpen: true,
              })
            }
          >
            <PlusIcon className="size-4 mr-2" />
            New
          </Button>
        </div>
        <DottedSeparator className="my-4" />
        <DataFilters hideProjectFilter={hideProjectFilter} />
        <DottedSeparator className="my-4" />
        {isLoadingTasks ? (
          <div className="w-full border h-[200px] flex items-center justify-center flex-col">
            <Loader className="size-5 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            <TabsContent value="table" className="mt-0">
              <DataTable columns={columns} data={tasks?.documents || []} />
            </TabsContent>
            <TabsContent value="kanban" className="mt-0">
              <DataKanban
                data={tasks?.documents || []}
                onChange={onKanbanChange}
              />
            </TabsContent>
            <TabsContent value="calender" className="mt-0">
              <DataCalendar data={tasks?.documents || []} />
            </TabsContent>
          </>
        )}
      </div>
    </Tabs>
  );
};
