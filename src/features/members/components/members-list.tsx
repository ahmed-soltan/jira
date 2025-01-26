"use client";

import { Fragment, useState } from "react";
import { ArrowLeft, MoreVerticalIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { DottedSeparator } from "@/components/dotted-separator";
import { MemberAvatar } from "@/features/members/components/member-avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MemberRole } from "@/features/members/types";
import { ConfirmModal } from "@/components/confirm-modal";

import { useGetMembers } from "@/features/members/api/use-get-members";
import { useWorkspaceId } from "@/features/workspaces/hooks/use-workspace-id";
import { useDeleteMember } from "@/features/members/api/use-delete-member";
import { useUpdateMember } from "@/features/members/api/use-update-member";
import { useGetCurrentMember } from "../api/use-get-current-member";

export const MemberList = () => {
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [openDeleteMember, setOpenDeleteMember] = useState(false);
  const workspaceId = useWorkspaceId();
  const { data: members } = useGetMembers({ workspaceId });
  const { data: currentMember } = useGetCurrentMember({ workspaceId });

  const { mutate: deleteMember, isPending: isDeletingMember } =
    useDeleteMember();
  const { mutate: updateMember, isPending: isUpdatingMember } =
    useUpdateMember();

  const handleDelete = () => {
    deleteMember({ param: { memberId: selectedMemberId } });
  };

  const handleUpdate = (memberId: string, role: MemberRole) => {
    updateMember({ param: { memberId }, json: { role } });
  };

  return (
    <>
      <ConfirmModal
        open={openDeleteMember}
        setOpen={setOpenDeleteMember}
        title="Delete Member"
        message="This Action can not be undone"
        variant={"destructive"}
        callbackFn={handleDelete}
      />
      <Card className="w-full h-full border-none shadow-none">
        <CardHeader className="flex flex-row items-center gap-x-4 p-7 space-y-2">
          <Button asChild variant={"secondary"} size={"sm"}>
            <Link href={`/workspaces/${workspaceId}`}>
              <ArrowLeft />
              Back
            </Link>
          </Button>
          <CardTitle className="text-xl font-bold">Member List</CardTitle>
        </CardHeader>
        <div className="px-7">
          <DottedSeparator />
        </div>
        <CardContent className="p-7">
          {members?.documents.map((member, index) => (
            <Fragment key={member.$id}>
              <div className="flex items-center gap-2">
                <MemberAvatar
                  name={member.name}
                  className="size-10"
                  fallbackClassname="text-lg"
                />
                <div className="flex flex-col">
                  <p className="text-sm font-medium">{member.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                {currentMember?.member.role === MemberRole.ADMIN && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="ml-auto"
                        variant={"secondary"}
                        size={"icon"}
                      >
                        <MoreVerticalIcon className="size-4 text-muted-foreground" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent side="bottom" align="end">
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() =>
                          handleUpdate(member.$id, MemberRole.ADMIN)
                        }
                        disabled={isDeletingMember || isUpdatingMember}
                      >
                        Set as Administrator
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium"
                        onClick={() =>
                          handleUpdate(member.$id, MemberRole.ADMIN)
                        }
                        disabled={isDeletingMember || isUpdatingMember}
                      >
                        Set as Member
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        className="font-medium text-amber-700"
                        onClick={() => {
                          setSelectedMemberId(member.$id);
                          setOpenDeleteMember(true);
                        }}
                        disabled={isDeletingMember || isUpdatingMember}
                      >
                        Remove {member.name}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
              {index < members.documents.length - 1 && (
                <Separator className="my-2.5" />
              )}
            </Fragment>
          ))}
        </CardContent>
      </Card>
    </>
  );
};
