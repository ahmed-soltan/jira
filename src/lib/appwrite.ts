import "server-only";

import { Client, Account, Users, Storage, Databases } from "node-appwrite";

export async function createAdminClient() {
  const client = new Client();

  console.log("Endpoint:", process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT);
  console.log("Project ID:", process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID);
  console.log("API Key exists:", !!process.env.NEXT_APPWRITE_KEY);

  client.setEndpoint(process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!);
  client.setProject(process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!);
  client.setKey(process.env.NEXT_APPWRITE_KEY!);

  return {
    get account() {
      return new Account(client);
    },
  };
}
