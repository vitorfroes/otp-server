export interface OTPRepository {
  saveOtp: (userId: string, otp: string, expiresAt: Date) => Promise<void>;
  getOtp: (userId: string) => Promise<{ otp: string; expiresAt: Date }>;
}
