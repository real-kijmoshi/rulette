import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { User } from "./db";

// Custom type definitions
interface CustomUser {
  id: string;
  name: string;
  image?: string;
  balance: number;
}

interface CustomSession {
  user: CustomUser;
  accessToken?: string;
}

interface CustomToken {
  id: string;
  accessToken: string;
  provider: string;
}

export const authOptions = {
  providers: [
    Discord({
      clientId: process.env.AUTH_DISCORD_ID as string,
      clientSecret: process.env.AUTH_DISCORD_SECRET as string,
    }),
  ],

  callbacks: {
    async session({
      session,
      token,
    }: {
      session: CustomSession;
      token: CustomToken;
    }): Promise<CustomSession | null> {
      if (token.id) {
        try {
          // Use lean() for performance as we only need plain JS objects.
          const user = await User.findOne({
            "auth.provider": token.provider,
            "auth.providerId": token.id,
          }).lean();
          
          if (!user) {
            console.error("User not found for providerId:", token.id);
            return null;
          }
          
          // Enrich the session with the user data from your DB.
          session.user = {
            id: (user as { _id: string })._id,
            name: session.user?.name || "",
            image: session.user?.image || "",
            balance: (user as unknown as { balance: number }).balance,
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
    
    async jwt({
      token,
      account,
      profile,
    }: {
      token: CustomToken;
      account?: { provider: string; providerId: string; access_token: string };
      profile?: { id: string; email: string; username: string };
    }): Promise<CustomToken> {
      // Persist the OAuth access_token and provider info to the token.
      if (account) {
        token.accessToken = account.access_token;
        token.provider = account.provider;
      }
      if (profile) {
        token.id = profile.id;
      }
      return token;
    },
    
    async signIn({
      account,
      profile,
    }: {
      account: { provider: string; providerId: string };
      profile: { id: string; email: string; username: string };
    }): Promise<boolean> {
      // Check if the user exists; if not, create a new user with an initial balance.
      const userExists = await User.findOne({
        "auth.provider": account.provider,
        "auth.providerId": profile.id,
      });
      
      if (!userExists) {
        await User.create({
          auth: {
            provider: account.provider,
            providerId: profile.id,
          },
          balance: 1000,
          email: profile.email,
          name: profile.username,
        });
      }
      return true;
    },
  },
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const authProvider = NextAuth(authOptions as any);

export const { auth, handlers, signIn, signOut } = authProvider;
export default authProvider;
