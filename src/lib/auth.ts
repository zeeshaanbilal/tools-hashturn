import { PrismaAdapter } from "@next-auth/prisma-adapter";
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import FacebookProvider from "next-auth/providers/facebook";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/login",
  },
  providers: [
    EmailProvider({
      server: {
        host: process.env.EMAIL_SERVER_HOST,
        port: Number(process.env.EMAIL_SERVER_PORT),
        auth: {
          user: process.env.EMAIL_SERVER_USER,
          pass: process.env.EMAIL_SERVER_PASSWORD,
        },
      },
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.passwordHash) return null;

        if (!user.emailVerified) {
          throw new Error("UNVERIFIED_EMAIL");
        }

        const valid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        );

        if (!valid) return null;

        return { id: user.id, name: user.name ?? undefined, email: user.email } as any;
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
      // allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
           id: profile.sub,
          name: profile.name,
          email: profile.email,
          image: profile.picture,
        } as any;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID ?? "",
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET ?? "",
      // allowDangerousEmailAccountLinking: true,
      profile(profile) {
        return {
          id: profile.id,
          name: profile.name,
          email: (profile as any).email,
          image: (profile as any).picture?.data?.url,
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        (token as any).id = (user as any).id;
        (token as any).emailVerified = (user as any).emailVerified ?? null;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        (session.user as any).id = (token as any).id as string;
        (session.user as any).emailVerified = (token as any).emailVerified;
      }
      return session;
    }    
  },
  events: {
    async createUser({ user }) {
      try {
        // 1. Get Free plan
      const freePlan = await prisma.plan.findFirst({
        where: { isFree: true },
      });

      if (!freePlan) {
        console.error("❌ Free plan not found");
        return;
      }

      // 2. Ensure user has NO active plan (idempotent safety)
      await prisma.userPlan.updateMany({
        where: {
          userId: user.id,
          isActive: true,
        },
        data: {
          isActive: false,
          endDate: new Date(),
          status: "cancelled",
        },
      });

      // 3. Assign Free plan
      await prisma.userPlan.create({
        data: {
          userId: user.id,
          planId: freePlan.id,
          startDate: new Date(),
          endDate: null,
          isActive: true,
          status: "active",
        },
      });
  
        // 3. If email is not verified, set trial — optional
        if (!("emailVerified" in user) || !(user as any).emailVerified) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              isTrialActive: true,
              trialStartDate: new Date(),
              trialEndDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            },
          });
        }
  
        console.log("User creation complete:", user.id);
      } catch (error) {
        console.error("Error during createUser event:", error);
      }
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
};

