import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";
import { TaskViewSwitcher } from "@/features/tasks/components/task-view-switcher";

interface TasksPageProps {
  params: {
    workspaceId: string;
  };
}

const TasksPage = async ({ params }: TasksPageProps) => {
  const user = await getCurrent();
  if (!user) {
    redirect(`/sign-in-page?origin=workspaces/${params.workspaceId}/tasks`);
  }

  return (
    <div className="flex flex-col h-full">
      <TaskViewSwitcher />
    </div>
  );
};

export default TasksPage;
