import crypto from "crypto";

export function generateRandomToken(bytes: number = 32): string {
	return crypto.randomBytes(bytes).toString("hex");
}

export function hashToken(token: string): string {
	return crypto.createHash("sha256").update(token).digest("hex");
}

export function addMinutes(date: Date, minutes: number): Date {
	return new Date(date.getTime() + minutes * 60 * 1000);
}


