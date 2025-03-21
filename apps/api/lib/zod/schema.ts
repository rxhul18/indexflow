import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string(),
  role: z.string(),
  image: z.string().nullable(),
  emailVerified: z.boolean(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

const serverSchema = z.object({
  id: z.string(),
  name: z.string(),
  owner_id: z.string(),
  is_config: z.boolean().optional(),
  config_id: z.string().nullable().optional(),
  logo: z.string().nullable().optional(),
  invite_url: z.string().nullable(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

const configSchema = z.object({
  id: z.string(),
  server_id: z.string(),
  qna_channels: z.array(z.string()),
  qna_channel_webhooks: z.array(z.string()),
  qna_endpoint: z.string().nullable().optional(),
  mod_role: z.string().nullable().optional(),
  log_channel: z.string().nullable().optional(),
  log_channel_webhook: z.string().nullable().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

const serverAPISchema = z.object({
  api_key: z.string(),
});

const tagSchema = z.object({
  id: z.string(),
  name: z.string(),
  usedAt: z.union([z.date(), z.string()]).nullable().optional(),
  posts: z.array(z.string()).optional(),
  usages: z.number().optional(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

const indexedQnsSchema = z.object({
  id: z.string(),
  title: z.string(),
  ans_id: z.string().optional(),
  author: z.string(),
  content: z.string(),
  tldr: z.string().nullable().optional(),
  is_anon: z.boolean().optional(),
  is_nsfw: z.boolean().optional(),
  server_id: z.string(),
  thread_id: z.string(),
  thread_mems: z.array(z.string()).optional(),
  msg_url: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

const indexedAnsSchema = z.object({
  id: z.string(),
  author: z.string(),
  content: z.string(),
  tldr: z.string().nullable().optional(),
  is_anon: z.boolean().optional(),
  is_nsfw: z.boolean().optional(),
  qns_id: z.string(),
  server_id: z.string(),
  thread_id: z.string(),
  msg_url: z.string(),
  createdAt: z.union([z.date(), z.string()]),
  updatedAt: z.union([z.date(), z.string()]),
});

const paginationSchema = z.object({
  cursor: z.string().optional(), // Optional because it might not be passed initially
  take: z.string().regex(/^\d+$/).transform(Number).default("100"), // Ensure take is a number
});

export {
  userSchema,
  paginationSchema,
  serverSchema,
  tagSchema,
  indexedAnsSchema,
  indexedQnsSchema,
  configSchema,
  serverAPISchema,
};
