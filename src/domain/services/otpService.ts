export interface OtpService {
  generate: (userId: string) => Promise<string>;
  verify: (userId: string, otp: string) => Promise<boolean>;
}
