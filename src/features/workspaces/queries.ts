"use server";

import { Query } from "node-appwrite";

import { DATABASE_ID, MEMBERS_ID, WORKSPACES_ID } from "@/config";
import { getMember } from "../members/utils";
import { Workspace } from "./type";
import { createSessionClient } from "@/lib/appwrite";

export const getWorkspaces = async () => {
  try {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return { documents: [], total: 0 };
    }

    const workspacesIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspacesIds)]
    );

    return workspaces;
  } catch (error) {
    console.log(error)
    return { documents: [], total: 0 };
  }
};

interface GetWorkspace {
  workspaceId: string;
}

export const getWorkspace = async ({ workspaceId }: GetWorkspace) => {
    const { account, databases } = await createSessionClient();

    const user = await account.get();

    const member = await getMember({
      databases,
      workspaceId,
      userId: user.$id,
    });

    if (!member){
      throw new Error("Unauthorized")
    };

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

    return workspace;
};

export const getWorkspaceInfo = async ({ workspaceId }: GetWorkspace) => {
  try {
    const { databases } = await createSessionClient();

    const workspace = await databases.getDocument<Workspace>(
      DATABASE_ID,
      WORKSPACES_ID,
      workspaceId
    );

     

    return {
      name:workspace.name,
      userId:workspace.userId,
    };
  } catch (error) {
    console.log(error)
    return null;
  }
};
