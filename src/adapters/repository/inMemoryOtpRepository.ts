import { OTPRepository } from "../../domain/ports/otpRepository";

export class InMemoryOTPRepository implements OTPRepository {
  private readonly store = new Map<string, { otp: string; expiresAt: Date }>();

  async saveOTP(email: string, otp: string, expiresAt: Date): Promise<void> {
    this.store.set(email, { otp, expiresAt });
  }

  async getOTP(
    email: string
  ): Promise<{ otp: string; expiresAt: Date } | null> {
    return this.store.get(email) ?? null;
  }
}
