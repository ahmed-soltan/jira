import { getCurrent } from "@/features/auth/queries";
import { redirect } from "next/navigation";

interface WorkspaceIdSettingsPage {
  params: {
    workspaceId: string;
  };
}

const WorkspaceIdSettingsPage = async ({ params }: WorkspaceIdSettingsPage) => {
  const user = await getCurrent();

  if (!user) {
    return redirect("/sign-in");
  }

  return <div>{params.workspaceId}</div>;
};

export default WorkspaceIdSettingsPage;
