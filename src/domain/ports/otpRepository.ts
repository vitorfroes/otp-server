export interface OTPRepository {
  saveOTP: (userId: string, otp: string, expiresAt: Date) => Promise<void>;
  getOTP: (userId: string) => Promise<{ otp: string; expiresAt: Date } | null>;
}
