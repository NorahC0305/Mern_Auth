import nodemailer from "nodemailer";

const sendMail = async (email, subject, htmlContent) => {
	try {
		let transporter = nodemailer.createTransport({
			service: "Gmail",
			auth: {
				user: process.env.EMAIL_SENDER,
				pass: process.env.EMAIL_PASSWORD,
			},
			tls: {
				rejectUnauthorized: false,
			},
		});

		await transporter.sendMail({
			from: process.env.EMAIL_SENDER,
			to: email,
			subject: subject,
			html: htmlContent,
		});

		console.log(`Email sent to ${email}`);
	} catch (error) {
		console.error(`Failed to send email to ${email}:`, error);
		throw new Error("Email sending failed.");
	}
};

export default sendMail;
