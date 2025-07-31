import { Collection } from "mongodb";
import { OTPRepository } from "../../domain/ports/otpRepository";

export class MongoOtpRepository implements OTPRepository {
  constructor(private readonly collection: Collection) {}

  async saveOTP(email: string, otp: string, expiresAt: Date): Promise<void> {
    await this.collection.updateOne(
      { email },
      { $set: { otp, expiresAt } },
      { upsert: true }
    );
  }

  async getOTP(
    email: string
  ): Promise<{ otp: string; expiresAt: Date } | null> {
    const record = await this.collection.findOne({ email });
    if (!record) return null;
    return {
      otp: record.otp,
      expiresAt: record.expiresAt,
    };
  }
}
