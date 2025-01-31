import { Models } from "node-appwrite";

export enum TaskStatus {
  BACKLOG = "BACKLOG",
  IN_PROGRESS = "IN_PROGRESS",
  DONE = "DONE",
  TODO = "TODO",
  IN_REVIEW = "IN_REVIEW",
}

export type Task = Models.Document & {
  name: string;
  workspaceId: string
  status: TaskStatus;
  projectId: string;
  assigneeId: string;
  position: number;
  dueDate: string;
  description:string
};
