import { getCurrent } from "@/features/auth/queries";
import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";
import { getWorkspaceInfo } from "@/features/workspaces/queries";
import { redirect } from "next/navigation";
import React from "react";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();
  if (!user) {
    redirect("/sign-in");
  }

  const workspaceInfo = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });

  if(!workspaceInfo){
    redirect("/workspaces");
  }


  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
