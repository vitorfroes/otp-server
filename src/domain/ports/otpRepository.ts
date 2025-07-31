export interface OTPRepository {
  saveOTP: (email: string, otp: string, expiresAt: Date) => Promise<void>;
  getOTP: (email: string) => Promise<{ otp: string; expiresAt: Date } | null>;
}
