import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, TrashIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/confirm-modal";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { useDeleteTask } from "../api/use-delete-task";

import { Task } from "../types";
import { Project } from "@/features/projects/type";

interface TaskBreadCrumbsProps {
  project: Omit<Project, "imageUrl" | "name">;
  task: Task;
}

export const TaskBreadCrumbs = ({ project, task }: TaskBreadCrumbsProps) => {
  const [open, setOpen] = useState(false);
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const { mutate, isPending } = useDeleteTask();

  const onDelete = () => {
    mutate(
      { param: { taskId: task.$id } },
      {
        onSuccess: () => {
          router.push(`/workspaces/${workspaceId}/tasks`);
        },
      }
    );
  };

  return (
    <div className="flex items-center gap-x-2">
      <ConfirmModal
        open={open}
        title="Delete Task"
        message="Are you sure you want to delete this task?"
        setOpen={setOpen}
        callbackFn={onDelete}
        variant={"destructive"}
      />
      <ProjectAvatar
        name={project.name}
        image={project.imageUrl}
        className="size-6 lg:size-8"
      />
      <Link href={`/workspaces/${workspaceId}/projects/${project.$id}`}>
        <p className="text-sm lg:text-lg font-semibold text-muted-foreground hover:opacity-75 transition">
          {project.name}
        </p>
      </Link>
      <ChevronRight className="size-4 lg:size-5 text-muted-foreground" />
      <p className="text-sm lg:text-lg font-semibold">{task.name}</p>
      <Button
        variant={"destructive"}
        className="ml-auto"
        size={"sm"}
        disabled={isPending}
        onClick={() => setOpen(true)}
      >
        <TrashIcon className="size-4 mr-2" />
        <span className="hidden lg:block">Delete Task</span>
      </Button>
    </div>
  );
};
