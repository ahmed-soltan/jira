import { redirect } from "next/navigation";

import { getCurrent } from "@/features/auth/queries";

import { ProjectIdClient } from "./client";

interface ProjectIdPageProps {
  params: {
    projectId: string;
    workspaceId: string;
  };
}

const ProjectIdPage = async ({ params }: ProjectIdPageProps) => {
  const user = await getCurrent();

  if (!user) {
    redirect(
      `/sign-in-page?origin=workspaces/${params.workspaceId}/projects/${params.projectId}`
    );
  }

  return <ProjectIdClient />;
};

export default ProjectIdPage;
