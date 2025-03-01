import NextAuth from "next-auth"
import Discord from "next-auth/providers/discord"
import { User } from "./db"

export const authOptions = {
  providers: [Discord({
    clientId: process.env.AUTH_DISCORD_ID as string,
    clientSecret: process.env.AUTH_DISCORD_SECRET as string,
  })],

  callbacks: {
    async session({ session, token }) {
      if (token.id) {
        try {
          // Add await and use exec() to properly execute the query
          const user = await User.findOne({ "auth.provider": "discord", "auth.providerId": token.id }).lean();
          
          if (!user) {
            console.error("User not found for providerId:", token.id);
            return null;
          }
          
          // Add necessary user data to the session
          session.user = {
            id: token.id,
            name: session.user?.name,
            image: session.user?.image,
            balance: user.balance,
            // Add any other user properties you need
          };
        } catch (error) {
          console.error("Error fetching user:", error);
          return null;
        }
      }
      
      if (token.accessToken) {
        session.accessToken = token.accessToken;
      }
      
      return session;
    },
    
    async jwt({ token, account, profile }) {
      // Persist the OAuth access_token to the token
      if (account) {
        token.accessToken = account.access_token;
      }
      if (profile) {
        token.id = profile.id;
      }
      return token;
    }
  }
}

const authProvider = NextAuth(authOptions);

export const { auth, handlers, signIn, signOut } = authProvider;
export default authProvider;