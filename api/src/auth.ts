import NextAuth from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { env } from "./env";

const options = {
  providers: [
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
    }),
  ],
};

const authHandler = (req: any, res: any) => NextAuth(req, res, options);
export default authHandler;
