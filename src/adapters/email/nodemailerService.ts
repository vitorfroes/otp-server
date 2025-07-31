import nodemailer from "nodemailer";
import { EmailService } from "../../domain/ports/emailService";

interface IEmail {
  to: string;
  subject: string;
  body: string;
}

export class NodemailerService implements EmailService {
  private readonly transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || "587", 10),
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendEmail({ to, subject, body }: IEmail) {
    await this.transporter.sendMail({
      from: "OTP Server <noreply@otpserver.com>",
      to,
      subject,
      html: body,
    });
  }
}
