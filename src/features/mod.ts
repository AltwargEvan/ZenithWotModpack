import { z } from "zod";

export const modSchema = z.object({
  category: z.string(),
  downloadUrl: z.string().url(),
  gameversion: z.string(),
  modversion: z.string(),
  name: z.string(),
  thumbnailUrl: z.string().url(),
  wgModsId: z
    .preprocess((val) => parseInt(val as string), z.number())
    .optional(),
  id: z.preprocess((val) => parseInt(val as string), z.number()),
  createdBy: z.string(),
  installdata: z.string().transform((str, ctx) => {
    try {
      const res = JSON.parse(str);
      const parsed = z
        .array(
          z.object({
            resPath: z.string().optional(),
            modsPath: z.string().optional(),
            name: z.string().optional(),
          })
        )
        .safeParse(res);

      if (parsed.success) return parsed.data;
      throw new Error("failed parse");
    } catch (e) {
      ctx.addIssue({ code: "custom", message: `Invalid JSON` });
      return z.NEVER;
    }
  }),
});

export type ModType = z.infer<typeof modSchema>;
