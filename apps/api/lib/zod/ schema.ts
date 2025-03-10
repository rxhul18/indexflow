import { z } from "zod";
const ServerSchema = z.object({
  body: z.string(),
});
