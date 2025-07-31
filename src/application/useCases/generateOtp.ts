import { FastifyBaseLogger } from "fastify";
import { OTPService } from "../../domain/services/otpService";

export class GenerateOTP {
  constructor(
    private readonly otpService: OTPService,
    private readonly logger: FastifyBaseLogger
  ) {}

  async execute(userId: string): Promise<string> {
    this.logger.info(`Generating OTP for user: ${userId}`);
    return this.otpService.generate(userId);
  }
}
