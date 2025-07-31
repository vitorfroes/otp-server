import { FastifyBaseLogger } from "fastify";
import { OTPService } from "../../domain/services/otpService";

export class GenerateOTP {
  constructor(
    private readonly otpService: OTPService,
    private readonly logger: FastifyBaseLogger
  ) {}

  async execute(email: string): Promise<string> {
    this.logger.info(`Generating OTP for user: ${email}`);
    return this.otpService.generate(email);
  }
}
