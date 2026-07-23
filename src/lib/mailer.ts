import nodemailer from "nodemailer";

type SendMailParams = {
	to: string;
	subject: string;
	html: string;
};

export async function sendMail({ to, subject, html }: SendMailParams) {
	const host = process.env.EMAIL_SERVER_HOST;
	const port = Number(process.env.EMAIL_SERVER_PORT ?? 587);
	const user = process.env.EMAIL_SERVER_USER;
	const pass = process.env.EMAIL_SERVER_PASSWORD;
	const from = process.env.EMAIL_FROM ?? "no-reply@example.com";

	if (!host || !port || !user || !pass) {
		throw new Error("Email server configuration is missing");
	}

	const transporter = nodemailer.createTransport({
		host,
		port,
		secure: port === 465,
		auth: { user, pass },
	});

	await transporter.sendMail({ from, to, subject, html });
}

export function buildVerificationEmail(verifyUrl: string) {
	return `
	  <div>
	    <h2>Verify your email</h2>
	    <p>Please click the link below to verify your email address.</p>
	    <p><a href="${verifyUrl}" target="_blank" rel="noopener noreferrer">Verify Email</a></p>
	    <p>If you did not create this account, you can ignore this email.</p>
	  </div>
	`;
}


export function buildPaymentSuccessEmail(planName: string, orderId: string) {
	return `
      <div style="font-family: sans-serif; line-height: 1.5;">
        <h2>Payment Successful!</h2>
        <p>Thank you for choosing <strong>HashTurn Tools</strong>.</p>
        <p>Your subscription to the <strong>${planName}</strong> plan is now active.</p>
        <div style="background: #f4f4f4; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Order ID:</strong> ${orderId}</p>
        </div>
        <p>You can now access all the features included in your plan from your dashboard.</p>
        <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/dashboard" style="background: #0070f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Go to Dashboard</a></p>
        <hr />
        <p style="font-size: 12px; color: #666;">Best Regards, Team HashTurn.</p>
      </div>
    `;
}


