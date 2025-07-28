import { OTPRepository } from "../../domain/ports/otpRepository";

export class InMemoryOtpRepository implements OTPRepository {
  private storage = new Map<string, { otp: string; expiresAt: Date }>();

  async saveOTP(userId: string, otp: string, expiresAt: Date): Promise<void> {
    this.storage.set(userId, { otp, expiresAt });
  }

  async getOTP(userId: string) {
    return this.storage.get(userId) ?? null;
  }
}
