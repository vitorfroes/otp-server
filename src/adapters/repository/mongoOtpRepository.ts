import { Collection } from "mongodb";
import { OTPRepository } from "../../domain/ports/otpRepository";

export class MongoOtpRepository implements OTPRepository {
  constructor(private readonly collection: Collection) {}

  async saveOTP(userId: string, otp: string, expiresAt: Date): Promise<void> {
    await this.collection.updateOne(
      { userId },
      { $set: { otp, expiresAt } },
      { upsert: true }
    );
  }

  async getOTP(
    userId: string
  ): Promise<{ otp: string; expiresAt: Date } | null> {
    const record = await this.collection.findOne({ userId });
    if (!record) return null;
    return {
      otp: record.otp,
      expiresAt: record.expiresAt,
    };
  }
}
