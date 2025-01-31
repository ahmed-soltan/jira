"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, ImageIcon, Loader } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
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
import { ConfirmModal } from "@/components/confirm-modal";

import { updateProjectSchema } from "../schemas";
import { cn } from "@/lib/utils";
import { Project } from "../type";

import { useUpdateProject } from "../api/use-update-project";
import { useDeleteProject } from "../api/use-delete-project";

interface EditProjectFormProps {
  onCancel?: () => void;
  initialValues: Project;
}

export const EditProjectForm = ({
  onCancel,
  initialValues,
}: EditProjectFormProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const { mutate: updateProjectMutation, isPending: isUpdating } =
    useUpdateProject();
  const { mutate: deleteProjectMutation, isPending: isDeleting } =
    useDeleteProject();

  const form = useForm<z.infer<typeof updateProjectSchema>>({
    resolver: zodResolver(updateProjectSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });

  const handleDelete = () => {
    deleteProjectMutation(
      { param: { projectId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof updateProjectSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name!);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    } else if (values.image === undefined || values.image === null) {
      formData.append("image", "");
    }

    updateProjectMutation({
      form: formData,
      param: { projectId: initialValues.$id },
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];
    if (file) {
      form.setValue("image", file);
    } else {
      form.setValue("image", undefined);
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="Delete Project"
        message="This Action can not be undone"
        variant={"destructive"}
        callbackFn={handleDelete}
      />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () =>
                    router.push(
                      `/workspaces/${initialValues.workspaceId}/projects/${initialValues.$id}`
                    )
            }
          >
            <ArrowLeft className="size-4 mr-2" />
            Back
          </Button>
          <CardTitle className="text-xl font-bold">
            {initialValues.name}
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
                          disabled={isUpdating || isDeleting}
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
                            disabled={isUpdating || isDeleting}
                            onChange={handleImageChange}
                          />
                          {!field.value ? (
                            <Button
                              variant={"tertiary"}
                              size={"xs"}
                              type="button"
                              disabled={isUpdating || isDeleting}
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
                              disabled={isUpdating || isDeleting}
                              className="w-fit mt-2"
                              onClick={() => {
                                field.onChange(null);
                                if (inputRef.current) {
                                  inputRef.current.value = "";
                                }
                                form.setValue("image", undefined);
                                form.trigger("image");
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
                  disabled={isUpdating || isDeleting}
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
                  disabled={isUpdating || isDeleting}
                  className="flex items-center gap-2 w-full md:max-w-[200px]"
                >
                  {isUpdating ||
                    (isDeleting && <Loader className="w-5 h-5 animate-spin" />)}
                  Save Changes
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h1 className="font-bold">Danger Zone</h1>
            <p className="text-sm text-muted-foreground">
              Deleting a Project is irreversible and will Delete all Associated
              Data
            </p>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isUpdating || isDeleting}
              onClick={() => setOpenDeleteModal(true)}
            >
              Delete Project
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
