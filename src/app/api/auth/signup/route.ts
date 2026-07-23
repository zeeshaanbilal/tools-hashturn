import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { addMinutes, generateRandomToken, hashToken } from "@/lib/tokens";
import { buildVerificationEmail, sendMail } from "@/lib/mailer";

type SignupBody = {
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

function isValidEmail(email: string) {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SignupBody;
    const { firstName, lastName, email, password } = body;

    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const trialDays = 7;
    const now = new Date();
    const trialEnd = new Date(now.getTime() + trialDays * 24 * 60 * 60 * 1000);

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`.trim(),
        email,
        passwordHash,
        emailVerified: null,
        isTrialActive: true,
        trialStartDate: now,
        trialEndDate: trialEnd,
      },
    });

    // Create verification token
    const rawToken = generateRandomToken(32);
    const tokenHash = hashToken(rawToken);
    const expires = addMinutes(new Date(), 60);

    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token: tokenHash,
        expires,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
    const verifyUrl = `${baseUrl}/auth/verify?token=${rawToken}&email=${encodeURIComponent(user.email)}`;
    const html = buildVerificationEmail(verifyUrl);
 
    try {
      await sendMail({ to: user.email, subject: "Verify your email", html });
    } catch (e) {
      // Do not leak email errors to the client; allow manual retry later
      console.error("Failed to send verification email", e);
    }

    return NextResponse.json({ success: true, userId: user.id, message: "We sent a verification email. Please check your inbox." });
  } catch (err) {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}


