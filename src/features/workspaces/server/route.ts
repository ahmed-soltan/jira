import { Hono } from "hono";
import { ID } from "node-appwrite";
import { DATABASE_ID, IMAGES_BUCKET_ID, WORKSPACES_ID } from "../../../config";
import { sessionMiddleware } from "@/lib/session-middleware";

const app = new Hono();

app.post("/", sessionMiddleware, async (c) => {
  try {
    const databases = c.get("databases");
    const storage = c.get("storage");
    const user = c.get("user");
    // Parse `multipart/form-data`
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
    }
    const workspace = await databases.createDocument(
      DATABASE_ID,
      WORKSPACES_ID,
      ID.unique(),
      {
        name,
        userId: user.$id,
        imageUrl: uploadedImageUrl,
      }
    );

    return c.json({ data: workspace });
  } catch (error) {
    console.error("Upload Error:", error);
    return c.json({ error: "Something went wrong" }, 500);
  }
});

export default app;
