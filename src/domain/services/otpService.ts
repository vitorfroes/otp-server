import { authenticator } from "otplib";
import validator from "validator";
import { OTPRepository } from "../ports/otpRepository";
import { EmailService } from "../ports/emailService";
import { otpBodyTemplate } from "../../infrastructure/email/templates";
import { AppError } from "../../shared/error/appError";

export class OTPService {
  constructor(
    private readonly otpRepository: OTPRepository,
    private readonly emailService: EmailService
  ) {}

  async generate(email: string): Promise<string> {
    if (!validator.isEmail(email))
      throw new AppError("Invalid email address", 400);

    const secret = authenticator.generateSecret();
    const token = authenticator.generate(secret);
    const expirationTime = parseInt(
      process.env.OTP_EXPIRATION_TIME || "300",
      10
    );
    const expiresAt = new Date(Date.now() + expirationTime * 1000);

    await this.otpRepository.saveOTP(email, token, expiresAt);

    await this.emailService.sendEmail({
      to: email,
      subject: "Your token has arrived!",
      body: otpBodyTemplate({ token, expiresAt }),
    });

    return token;
  }

  async validate(email: string, token: string): Promise<boolean> {
    const record = await this.otpRepository.getOTP(email);
    if (!record)
      throw new AppError("OTP not found for the email provided", 404);
    if (record.expiresAt < new Date()) return false;

    return record.otp === token;
  }
}
