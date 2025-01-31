import { redirect } from "next/navigation";

import { JoinWorkspaceForm } from "@/features/workspaces/components/join-workspace-form";

import { getCurrent } from "@/features/auth/queries";
import { getWorkspaceInfo } from "@/features/workspaces/queries";

interface WorkspaceIdJoinPageProps {
  params: {
    workspaceId: string;
    inviteCode: string;
  };
}

const WorkspaceIdJoinPage = async ({ params }: WorkspaceIdJoinPageProps) => {
  const user = await getCurrent();

  
  if (!user) {
    redirect(
      `/sign-in?origin=workspaces/${params.workspaceId}/join/${params.inviteCode}`
    );
  }
  
  const workspaceInfo = await getWorkspaceInfo({
    workspaceId: params.workspaceId,
  });
  if (!workspaceInfo) {
    redirect("/workspaces");
  }

  if (workspaceInfo.userId === user.$id) {
    redirect(`/workspaces/${params.workspaceId}`);
  }

  return (
    <div className="w-full lg:max-w-xl">
      <JoinWorkspaceForm initialValues={workspaceInfo} />
    </div>
  );
};

export default WorkspaceIdJoinPage;
