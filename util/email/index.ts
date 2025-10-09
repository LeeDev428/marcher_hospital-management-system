import nodemailer from "nodemailer"
import type { MailTemplate } from "~/types/app"

const getTransporterSettings = async () => {
	return {
		host: process.env.SMTP_HOST || "smtp.gmail.com",
		port: parseInt(process.env.SMTP_PORT || "587"),
		secure: false, // true for 465, false for other ports
		auth: {
			user: process.env.SMTP_USERNAME || "marcher.csb@gmail.com",
			pass: process.env.SMTP_PASSWORD || "xlbc tpvc vdxf simc"
		},
		tls: {
			rejectUnauthorized: false
		}
	}
}

export const sendEmail = async (receiver: string, template: MailTemplate) => {
	try {
		const transporterSettings = await getTransporterSettings()
		const transporter = nodemailer.createTransport(transporterSettings)
		await transporter.sendMail({
			to: receiver,
			from: template.from,
			subject: template.subject,
			html: template.html,
			text: template.text,
		})

	} catch (error) {
		console.error(error)
	}
}
