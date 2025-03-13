import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()])
});

const paginationSchema = z.object({
  cursor: z.string().optional(), // Optional because it might not be passed initially
  take: z.string().regex(/^\d+$/).transform(Number).default("10"), // Ensure take is a number
});

export { userSchema, paginationSchema };
