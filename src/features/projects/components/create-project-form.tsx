"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
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

import { useCreateProject } from "../api/use-create-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { createProjectSchema } from "../schemas";
import { cn } from "@/lib/utils";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const { mutate, isPending } = useCreateProject();
  const form = useForm<z.infer<typeof createProjectSchema>>({
    resolver: zodResolver(createProjectSchema.omit({ workspaceId: true })),
    defaultValues: {
      name: "",
    },
  });
  const workspaceId = useWorkspaceId();
  const router = useRouter();

  const onSubmit = (values: z.infer<typeof createProjectSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name);
    formData.append("workspaceId", workspaceId);

    mutate(
      { form: formData },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
          onCancel?.()
        },
      }
    );
  };

  return (
    <Card className="w-full h-full border-none shadow-none">
      <CardHeader className="flex p-7">
        <CardTitle className="text-xl font-bold">
          Create a new Project
        </CardTitle>
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
                    <FormLabel>Project Name</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Enter Project Name"
                        {...field}
                        disabled={isPending}
                      />
                    </FormControl>
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
                Create Project
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
