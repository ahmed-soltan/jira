"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { ArrowLeft, CopyIcon, ImageIcon, Loader } from "lucide-react";
import { ChangeEvent, useRef, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
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

import { updateWorkspaceSchema } from "../schemas";
import { cn } from "@/lib/utils";
import { Workspace } from "../type";

import { useUpdateWorkspace } from "../api/use-update-workspace";
import { useDeleteWorkspace } from "../api/use-delete-workspace";
import { useResetInviteCode } from "../api/use-reset-invite-code";

interface EditWorkspaceFormProps {
  onCancel?: () => void;
  initialValues: Workspace;
}

export const EditWorkspaceForm = ({
  onCancel,
  initialValues,
}: EditWorkspaceFormProps) => {
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openResetModal, setOpenResetModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate: updateWorkspaceMutation, isPending: isUpdating } =
    useUpdateWorkspace();
  const { mutate: deleteWorkspaceMutation, isPending: isDeleting } =
    useDeleteWorkspace();
  const { mutate: resetInviteCode, isPending: isResettingInviteCode } =
    useResetInviteCode();
  const form = useForm<z.infer<typeof updateWorkspaceSchema>>({
    resolver: zodResolver(updateWorkspaceSchema),
    defaultValues: {
      ...initialValues,
      image: initialValues.imageUrl ?? "",
    },
  });
  const router = useRouter();

  const fullInviteLink = `${window.location.origin}/workspaces/${initialValues.$id}/join/${initialValues.inviteCode}`;

  const handleCopyInviteLink = () => {
    navigator.clipboard
      .writeText(fullInviteLink)
      .then(() => toast.success("invite Link copied to your Clipboard"));
  };

  const handleDelete = () => {
    deleteWorkspaceMutation(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          window.location.href = "/";
        },
      }
    );
  };

  const handleResetInviteCode = () => {
    resetInviteCode(
      { param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          router.refresh()
        },
      }
    );
  };

  const onSubmit = (values: z.infer<typeof updateWorkspaceSchema>) => {
    const formData = new FormData();
    formData.append("name", values.name!);

    if (values.image instanceof File) {
      formData.append("image", values.image);
    }

    updateWorkspaceMutation(
      { form: formData, param: { workspaceId: initialValues.$id } },
      {
        onSuccess: () => {
          form.reset();
          router.push(`/workspaces/${initialValues.$id}`);
        },
      }
    );
  };



  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e?.target?.files?.[0];

    if (file) {
      console.log("Selected File:", file.name, file.type, file.size);
      form.setValue("image", file);
    } else {
      console.error("No file selected");
    }
  };

  return (
    <div className="flex flex-col gap-y-4">
      <ConfirmModal
        open={openDeleteModal}
        setOpen={setOpenDeleteModal}
        title="Delete Workspace"
        message="This Action can not be undone"
        variant={"destructive"}
        callbackFn={handleDelete}
      />
      <ConfirmModal
        open={openResetModal}
        setOpen={setOpenResetModal}
        title="Reset Invite Link"
        message="This will Invalidate The current invite link"
        variant={"destructive"}
        callbackFn={handleResetInviteCode}
      />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-0">
          <Button
            size={"sm"}
            variant={"secondary"}
            onClick={
              onCancel
                ? onCancel
                : () => router.push(`/workspaces/${initialValues.$id}`)
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
                      <FormLabel>Workspace Name</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          placeholder="Enter Workspace Name"
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
                          <p className="text-sm">Workspace Icon</p>
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
            <h1 className="font-bold">Invite Members</h1>
            <p className="text-sm text-muted-foreground">
              Use The Invite Link to Add members to your workspace.
            </p>
            <div className="mt-2">
              <div className="flex items-center gap-x-2">
                <Input disabled value={fullInviteLink} />
                <Button
                  onClick={handleCopyInviteLink}
                  className="size-12"
                  variant={"secondary"}
                >
                  <CopyIcon className="size-5" />
                </Button>
              </div>
            </div>
            <DottedSeparator className="py-7" />
            <Button
              className="mt-6 w-fit ml-auto"
              size={"sm"}
              variant={"destructive"}
              type="button"
              disabled={isUpdating || isResettingInviteCode}
              onClick={() => setOpenResetModal(true)}
            >
              Reset Invite Link
            </Button>
          </div>
        </CardContent>
      </Card>
      <Card className="w-full h-full border-none shadow-none">
        <CardContent className="p-7">
          <div className="flex flex-col">
            <h1 className="font-bold">Danger Zone</h1>
            <p className="text-sm text-muted-foreground">
              Deleting a Workspace is irreversible and will Delete all
              Associated Data
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
              Delete Workspace
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
