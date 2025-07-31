import { FastifyBaseLogger } from "fastify";
import { OTPService } from "../../domain/services/otpService";

interface ValidateOTPInput {
  email: string;
  token: string;
}

export class ValidateOTP {
  constructor(
    private readonly otpService: OTPService,
    private readonly logger: FastifyBaseLogger
  ) {}

  async execute({ email, token }: ValidateOTPInput): Promise<boolean> {
    this.logger.info(`Validating OTP token: ${token} for user email: ${email}`);
    return this.otpService.validate(email, token);
  }
}
