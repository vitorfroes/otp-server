import { OTPRepository } from "../../domain/ports/otpRepository";

export class InMemoryOTPRepository implements OTPRepository {
  private readonly store = new Map<string, { otp: string; expiresAt: Date }>();

  async saveOTP(userId: string, otp: string, expiresAt: Date): Promise<void> {
    this.store.set(userId, { otp, expiresAt });
  }

  async getOTP(
    userId: string
  ): Promise<{ otp: string; expiresAt: Date } | null> {
    return this.store.get(userId) ?? null;
  }
}
