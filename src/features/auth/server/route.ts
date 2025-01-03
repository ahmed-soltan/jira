import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { ID } from "node-appwrite";
import { deleteCookie, setCookie } from "hono/cookie";

import { createAdminClient } from "@/lib/appwrite";

import { loginSchema, registerSchema } from "@/features/schemas";

import { AUTH_COOKIE } from "../constants";

const app = new Hono()
  .post("/login", zValidator("json", loginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    const { account } = await createAdminClient();

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, `${session.secret}${session.$id}${session.userId}`, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/register", zValidator("json", registerSchema), async (c) => {
    const { email, password, name } = c.req.valid("json");

    const { account } = await createAdminClient();

    const user = await account.create(ID.unique(), email, password, name);

    const session = await account.createEmailPasswordSession(email, password);

    setCookie(c, AUTH_COOKIE, `${session.secret}${session.$id}${session.userId}`, {
      path: "/",
      httpOnly: true,
      sameSite: "strict",
      secure: true,
      maxAge: 60 * 60 * 24 * 30,
    });

    return c.json({ success: true });
  })
  .post("/logout" , async(c)=>{
    deleteCookie(c, AUTH_COOKIE);

    return c.json({ success: true });
  })

export default app;
