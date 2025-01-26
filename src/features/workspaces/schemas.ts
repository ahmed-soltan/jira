import z from "zod";

export const createWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Required"),
  image: z.union([
    z.string().transform((value) => (value === "" ? undefined : value)),
    z.instanceof(File),
  ]).optional(),
});

export const updateWorkspaceSchema = z.object({
  name: z.string().trim().min(1, "Must Be one or More Characters").optional(),
  image: z.union([
    z.string().transform((value) => (value === "" ? undefined : value)),
    z.instanceof(File),
  ]).optional(),
});
