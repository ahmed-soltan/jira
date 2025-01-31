"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { useRouter } from "next/navigation";
import { ImageIcon, Loader } from "lucide-react";
import { ChangeEvent, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";

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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

import { useCreateProject } from "../api/use-create-projects";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";

import { createProjectSchema } from "../schemas";
import { cn } from "@/lib/utils";

interface CreateProjectFormProps {
  onCancel?: () => void;
}

export const CreateProjectForm = ({ onCancel }: CreateProjectFormProps) => {
  const inputRef = useRef<HTMLInputElement>(null);
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

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    mutate(
      { form: formData },
      {
        onSuccess: ({ data }) => {
          form.reset();
          router.push(`/workspaces/${workspaceId}/projects/${data.$id}`);
        },
      }
    );
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];

    if (file) {
      form.setValue("image", file);
    } else {
      console.error("No file selected");
    }
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
              <FormField
                name="image"
                control={form.control}
                render={({ field }) => (
                  <div className="flex flex-col gap-y-2">
                    <div className="flex items-center gap-x-5">
                      {field.value ? (
                        <div className="size-[72px] relative rounded-md overflow-hidden">
                          <Image
                            src={
                              field.value instanceof File
                                ? URL.createObjectURL(field.value)
                                : field.value
                            }
                            alt={"logo"}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <Avatar className="size-[72px]">
                          <AvatarFallback className="bg-neutral-200 text-xl text-neutral-500 flex items-center justify-center font-medium">
                            <ImageIcon className="size-[36px] text-neutral-400" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        <p className="text-sm">Project Icon</p>
                        <p className="text-sm text-muted-foreground">
                          JPG, PNG, SVG or JPEG, max 1MB
                        </p>
                        <input
                          type="file"
                          className="hidden"
                          accept=".png, .jpg, .svg, .jpeg"
                          ref={inputRef}
                          disabled={isPending}
                          onChange={handleImageChange}
                        />
                        {!field.value ? (
                          <Button
                            variant={"tertiary"}
                            size={"xs"}
                            type="button"
                            disabled={isPending}
                            className="w-fit mt-2"
                            onClick={() => inputRef?.current?.click()}
                          >
                            Upload Image
                          </Button>
                        ) : (
                          <Button
                            variant={"destructive"}
                            size={"xs"}
                            type="button"
                            disabled={isPending}
                            className="w-fit mt-2"
                            onClick={() => {
                              field.onChange(null);
                              if (inputRef.current) {
                                inputRef.current.value = "";
                              }
                            }}
                          >
                            Remove Image
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
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
