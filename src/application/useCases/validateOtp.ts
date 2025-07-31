import { FastifyBaseLogger } from "fastify";
import { OTPService } from "../../domain/services/otpService";

interface ValidateOTPInput {
  userId: string;
  token: string;
}

export class ValidateOTP {
  constructor(
    private readonly otpService: OTPService,
    private readonly logger: FastifyBaseLogger
  ) {}

  async execute({ userId, token }: ValidateOTPInput): Promise<boolean> {
    this.logger.info(`Validating OTP token: ${token} for user: ${userId}`);
    return this.otpService.validate(userId, token);
  }
}
