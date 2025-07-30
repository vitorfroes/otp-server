import { OTPService } from "../../domain/services/otpService";

interface ValidateOTPInput {
  userId: string;
  token: string;
}

export class ValidateOTP {
  constructor(private readonly otpService: OTPService) {}

  async execute({ userId, token }: ValidateOTPInput): Promise<boolean> {
    return this.otpService.validate(userId, token);
  }
}
