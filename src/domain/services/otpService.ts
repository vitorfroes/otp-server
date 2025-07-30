import { authenticator } from "otplib";
import { OTPRepository } from "../ports/otpRepository";

export class OTPService {
  constructor(private readonly otpRepository: OTPRepository) {}

  async generate(userId: string): Promise<string> {
    const secret = authenticator.generateSecret();
    const token = authenticator.generate(secret);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await this.otpRepository.saveOTP(userId, token, expiresAt);

    return token;
  }

  async validate(userId: string, token: string): Promise<boolean> {
    const record = await this.otpRepository.getOTP(userId);
    if (!record) return false;
    if (record.expiresAt < new Date()) return false;

    return record.otp === token;
  }
}
