import { Hono } from "hono";
import { ID, Query } from "node-appwrite";

import {
  DATABASE_ID,
  IMAGES_BUCKET_ID,
  WORKSPACES_ID,
  MEMBERS_ID,
} from "../../../config";
import { MemberRole } from "../../members/types";
import { sessionMiddleware } from "@/lib/session-middleware";
import { generateInviteCode } from "@/lib/utils";
import { getMember } from "@/features/members/utils";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { Workspace } from "../type";

const app = new Hono()
  .get("/", sessionMiddleware, async (c) => {
    const databases = c.get("databases");
    const user = c.get("user");

    const members = await databases.listDocuments(DATABASE_ID, MEMBERS_ID, [
      Query.equal("userId", user.$id),
    ]);

    if (members.total === 0) {
      return c.json({ data: { documents: [], total: 0 } });
    }

    const workspacesIds = members.documents.map((member) => member.workspaceId);

    const workspaces = await databases.listDocuments(
      DATABASE_ID,
      WORKSPACES_ID,
      [Query.orderDesc("$createdAt"), Query.contains("$id", workspacesIds)]
    );

    return c.json({ data: workspaces });
  })
  .patch("/:workspaceId", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const formData = await c.req.formData();
      const name = formData.get("name") as string;
      const imageBlob = formData.get("image") as Blob;

      const { workspaceId } = c.req.param();

      console.log(workspaceId);

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      let uploadedImageUrl: string | undefined;
      if (imageBlob) {
        const image = new File([imageBlob], "uploaded-image.jpg", {
          type: imageBlob.type,
        });

        const uploadedFile = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          uploadedFile.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = imageBlob;
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(10),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    } catch (error) {
      console.error("Upload Error:", error);
      return c.json({ error: "Something went wrong" }, 500);
    }
  })
  .post("/", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const storage = c.get("storage");
      const user = c.get("user");

      const formData = await c.req.formData();
      const name = formData.get("name") as string;
      const imageBlob = formData.get("image") as Blob;

      let uploadedImageUrl: string | undefined;
      if (imageBlob) {
        const image = new File([imageBlob], "uploaded-image.jpg", {
          type: imageBlob.type,
        });

        const uploadedFile = await storage.createFile(
          IMAGES_BUCKET_ID,
          ID.unique(),
          image
        );

        const arrayBuffer = await storage.getFilePreview(
          IMAGES_BUCKET_ID,
          uploadedFile.$id
        );

        uploadedImageUrl = `data:image/png;base64,${Buffer.from(
          arrayBuffer
        ).toString("base64")}`;
      } else {
        uploadedImageUrl = imageBlob;
      }

      const workspace = await databases.createDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        ID.unique(),
        {
          name,
          userId: user.$id,
          imageUrl: uploadedImageUrl,
          inviteCode: generateInviteCode(10),
        }
      );

      await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
        userId: user.$id,
        workspaceId: workspace.$id,
        role: MemberRole.ADMIN,
      });

      return c.json({ data: workspace });
    } catch (error) {
      console.error("Upload Error:", error);
      return c.json({ error: "Something went wrong" }, 500);
    }
  })
  .delete("/:workspaceId", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      await databases.deleteDocument(DATABASE_ID, WORKSPACES_ID, workspaceId);

      return c.json({ data: { $id: workspaceId } });
    } catch (error) {
      console.error("Delete Error:", error);
      return c.json({ error: "Something went wrong" }, 500);
    }
  })
  .post("/:workspaceId/reset-invite-code", sessionMiddleware, async (c) => {
    try {
      const databases = c.get("databases");
      const user = c.get("user");
      const { workspaceId } = c.req.param();

      const member = await getMember({
        databases,
        workspaceId,
        userId: user.$id,
      });

      if (!member || member.role !== MemberRole.ADMIN) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const workspace = await databases.updateDocument(
        DATABASE_ID,
        WORKSPACES_ID,
        workspaceId,
        {
          inviteCode: generateInviteCode(6),
        }
      );

      return c.json({ data: workspace });
    } catch (error) {
      console.error("Delete Error:", error);
      return c.json({ error: "Something went wrong" }, 500);
    }
  })
  .post(
    "/:workspaceId/join",
    sessionMiddleware,
    zValidator("json", z.object({ code: z.string() })),
    async (c) => {
      try {
        const databases = c.get("databases");
        const user = c.get("user");
        
        const { workspaceId } = c.req.param();
        const { code } = c.req.valid("json");

        const member = await getMember({  
          databases,
          workspaceId,
          userId: user.$id,
        });

        if (member ) {
          return c.json({ error: "Already a Member" }, 400);
        }

        const workspace = await databases.getDocument<Workspace>(
          DATABASE_ID,
          WORKSPACES_ID,
          workspaceId,
        );

        if(workspace.inviteCode !== code){
          return c.json({ error: "Invalid Invite Code" }, 400);
        }

        await databases.createDocument(DATABASE_ID, MEMBERS_ID, ID.unique(), {
          userId: user.$id,
          workspaceId,
          role: MemberRole.MEMBER,
        });

        return c.json({ data: workspace });
      } catch (error) {
        console.error("Delete Error:", error);
        return c.json({ error: "Something went wrong" }, 500);
      }
    }
  );

export default app;
