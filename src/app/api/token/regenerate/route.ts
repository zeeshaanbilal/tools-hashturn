import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Delete old token(s)
  await prisma.verificationToken.deleteMany({
    where: { identifier: session.user.id },
  });

  // Create new token
  const token = jwt.sign(
    { userId: session.user.id },
    process.env.API_TOKEN_SECRET!,
    { expiresIn: "30d" }
  );

  await prisma.verificationToken.create({
    data: {
      identifier: session.user.id,
      token,
      expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
    },
  });

  return NextResponse.json({ token });
}
