import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { userService } from "./services/database/firebase/userService";

export const { handlers, signIn, signOut, auth } = NextAuth({
    providers: [
        Google({
            clientId: process.env.AUTH_GOOGLE_ID,
            clientSecret: process.env.AUTH_GOOGLE_SECRET,
        }),
        Credentials({
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
              if(!credentials.email || !credentials.password) return null;
              try{
                const user = await userService.validateCredentialsUser(
                  credentials.email as string,
                  credentials.password as string,
                )
                return user
              }catch(error){
                throw new Error((error as Error).message || "Ошибка авторизации. Попробуйте еще раз.");
              }
            }
        }),
    ],
    callbacks: {
        async signIn({ account, profile }) {
          if(account?.provider === "google" && profile) {
            try{
              await userService.syncOAuthUser(
                account.providerAccountId,
                profile.email ?? "",
                profile.name ?? "Guest"
              )
              return true
            }catch{
              return false
            }
          }
          return true
        },
        async jwt({ token, account, user }) {
          if (account && user) {
            token.userId = account.provider === "google" ? account.providerAccountId : user.id;
          }
          return token;
        },
        async session({ session, token }) {
          if(session.user){
            session.user.id = token.userId as string;
          }
          return session;
        }
    },
    pages:{
      signIn : "/auth/signin",
    }
});
