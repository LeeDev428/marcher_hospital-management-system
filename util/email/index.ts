import nodemailer from "nodemailer"
import type { MailTemplate } from "~/types/app"

const getTransporterSettings = async (): Promise<nodemailer.TransportOptions> => {
	return {}
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
