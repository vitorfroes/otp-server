import { FastifyBaseLogger } from "fastify";
import { OTPService } from "../../domain/services/otpService";
import { ValidateOTP } from "./validateOtp";

describe("Validate OTP useCase", () => {
  let validateOTP: ValidateOTP;
  let mockOTPService: OTPService;
  let mockLogger: FastifyBaseLogger;

  beforeEach(() => {
    mockOTPService = {
      validate: jest.fn(),
    } as unknown as OTPService;
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as FastifyBaseLogger;

    validateOTP = new ValidateOTP(mockOTPService, mockLogger);
  });

  it("should validate an OTP for a user", async () => {
    const email = "user@mail.com";
    const token = "123456";

    (mockOTPService.validate as jest.Mock).mockResolvedValue(true);

    const isValid = await validateOTP.execute({ email, token });

    expect(mockLogger.info).toHaveBeenCalledWith(
      `Validating OTP token: ${token} for user email: ${email}`
    );
    expect(isValid).toBe(true);
    expect(mockOTPService.validate).toHaveBeenCalledWith(email, token);
  });
});
