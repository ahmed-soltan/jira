"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { Loader } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DottedSeparator } from "@/components/dotted-separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { DatePicker } from "@/components/date-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { MemberAvatar } from "@/features/members/components/member-avatar";
import { ProjectAvatar } from "@/features/projects/components/project-avatar";

import { cn } from "@/lib/utils";
import { createTaskSchema } from "../schemas";
import { Task, TaskStatus } from "../types";

import { useUpdateTask } from "../api/use-update-task";

interface EditTaskFormProps {
  onCancel?: () => void;
  projectOptions: { id: string; name: string; imageUrl: string }[];
  memberOptions: { id: string; name: string }[];
  initialValues: Task;
}

export const EditTaskForm = ({
  onCancel,
  projectOptions,
  memberOptions,
  initialValues,
}: EditTaskFormProps) => {
  const { mutate, isPending } = useUpdateTask();
  const form = useForm<z.infer<typeof createTaskSchema>>({
    resolver: zodResolver(
      createTaskSchema.omit({ workspaceId: true, description: true })
    ),
    defaultValues: {
      ...initialValues,
      dueDate: initialValues.dueDate
        ? new Date(initialValues.dueDate)
        : undefined,
    },
  });

  const onSubmit = (values: z.infer<typeof createTaskSchema>) => {
    mutate(
      {
        param: { taskId: initialValues.$id },
        json: { ...values },
      },
      {
        onSuccess: () => {
          form.reset();
          onCancel?.();
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">Edit a Task</CardTitle>
      </CardHeader>
      <div className="px-7">
        <DottedSeparator />
      </div>
      <CardContent className="p-7">
        <Form {...form}>
          <form action="" onSubmit={form.handleSubmit(onSubmit)}>
            <div className="flex flex-col gap-y-4">
              <FormField
                name="name"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Task Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Task Name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="dueDate"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Due Date</FormLabel>
                    <FormControl>
                      <DatePicker {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="assigneeId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Assignee</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select an Assignee" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {memberOptions.map((member) => (
                          <SelectItem key={member.id} value={member.id}>
                            <div className="flex items-center gap-x-2">
                              <MemberAvatar name={member.name} />
                              {member.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="status"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Status" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        <SelectItem value={TaskStatus.BACKLOG}>
                          Backlog
                        </SelectItem>
                        <SelectItem value={TaskStatus.TODO}>todo</SelectItem>
                        <SelectItem value={TaskStatus.IN_PROGRESS}>
                          in progress
                        </SelectItem>
                        <SelectItem value={TaskStatus.IN_REVIEW}>
                          in Review
                        </SelectItem>
                        <SelectItem value={TaskStatus.DONE}>Done</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="projectId"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Select Project</FormLabel>
                    <Select
                      defaultValue={field.value}
                      onValueChange={field.onChange}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select Project" />
                        </SelectTrigger>
                      </FormControl>
                      <FormMessage />
                      <SelectContent>
                        {projectOptions.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            <div className="flex items-center gap-x-2">
                              <ProjectAvatar
                                image={project.imageUrl}
                                name={project.name}
                                className="size-8"
                              />
                              {project.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <DottedSeparator className="py-7" />
            <div className="flex items-center justify-between flex-wrap-reverse gap-3">
              <Button
                type="button"
                size={"lg"}
                onClick={onCancel}
                variant={"secondary"}
                disabled={isPending}
                className={cn(
                  "w-full md:max-w-[150px]",
                  onCancel ? "block" : "invisible"
                )}
              >
                Cancel
              </Button>
              <Button
                size={"lg"}
                variant={"primary"}
                disabled={isPending}
                className="flex items-center gap-2 w-full md:max-w-[200px]"
              >
                {isPending && <Loader className="w-5 h-5 animate-spin" />}
                Edit Task
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
