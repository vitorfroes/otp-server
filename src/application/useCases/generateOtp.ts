import { OTPService } from "../../domain/services/otpService";

export class GenerateOTP {
  constructor(private readonly otpService: OTPService) {}

  async execute(userId: string): Promise<string> {
    return this.otpService.generate(userId);
  }
}
