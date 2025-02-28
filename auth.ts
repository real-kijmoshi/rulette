import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";

const authHandler = NextAuth({
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      console.log("signIn callback - user:", user);
      console.log("signIn callback - account:", account);
      console.log("signIn callback - profile:", profile);
      return true;  // Ensure sign-in is successful
    },
    async session({ session, token }) {
      console.log("session callback - session:", session);
      console.log("session callback - token:", token);
      return session;  // Return session data
    },
    async redirect({ url, baseUrl }) {
      console.log("redirect callback - url:", url);
      console.log("redirect callback - baseUrl:", baseUrl);
      return url.startsWith(baseUrl) ? url : baseUrl;  // Ensure the redirect works
    },
  },
});

export { authHandler as GET, authHandler as POST };
