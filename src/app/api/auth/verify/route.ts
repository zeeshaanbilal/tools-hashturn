import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { hashToken } from "@/lib/tokens";

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const token = searchParams.get("token");
	const email = searchParams.get("email");

	if (!token || !email) {
		return NextResponse.redirect(new URL("/auth/login?verified=0", req.url));
	}

	const tokenHash = hashToken(token);
	const record = await prisma.verificationToken.findFirst({
		where: { identifier: email, token: tokenHash },
	});

	if (!record || record.expires < new Date()) {
		return NextResponse.redirect(new URL("/auth/login?verified=0", req.url));
	}

	await prisma.$transaction([
		prisma.user.update({ where: { email }, data: { emailVerified: new Date() } }),
		prisma.verificationToken.deleteMany({ where: { identifier: email } }),
	]);

	return NextResponse.redirect(new URL("/auth/login?verified=1", req.url));
}


