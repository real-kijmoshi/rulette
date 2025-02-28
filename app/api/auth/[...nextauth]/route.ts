import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const authHandler = NextAuth({
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
    }),
  ],
});

export { authHandler as GET, authHandler as POST };
