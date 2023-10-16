import { initTRPC } from "@trpc/server";
import { z } from "zod";

const t = initTRPC.create();

const publicProcedure = t.procedure;
const router = t.router;

const usersRouter = router({
  greeting: publicProcedure
    .input(z.object({ name: z.string() }).nullish())
    .query(({ input }) => {
      return `Hello ${input?.name ?? "World"}`;
    }),
});

export const appRouter = router({
  users: usersRouter,
});
