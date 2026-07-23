import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function requireToolAuth(
  req: NextRequest
): Promise<NextResponse | null> {
  const authHeader = req.headers.get("authorization");

  // ===================================
  // 1️⃣ Bearer Token Authentication
  // ===================================

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];

    try {
      const decoded = jwt.verify(
        token,
        process.env.API_TOKEN_SECRET!
      ) as { userId: string };

      const stored = await prisma.verificationToken.findUnique({
        where: { token },
      });

      if (!stored) {
        return NextResponse.json(
          { error: "Invalid token" },
          { status: 401 }
        );
      }

      if (stored.expires < new Date()) {
        return NextResponse.json(
          { error: "Token expired" },
          { status: 401 }
        );
      }

      return null;
    } catch (err) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }
  }

  // ===================================
  // 2️⃣ NextAuth Session Authentication
  // ===================================

  const session = await getServerSession(authOptions);

  if (!session || !session.user?.id) {
    return NextResponse.json(
      { error: "Unauthorized. Please log in to use this service." },
      { status: 401 }
    );
  }

  return null;
}
