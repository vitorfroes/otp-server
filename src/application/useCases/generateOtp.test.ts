import { FastifyBaseLogger } from "fastify";
import { OTPService } from "../../domain/services/otpService";
import { GenerateOTP } from "./generateOtp";

describe("Generate OTP useCase", () => {
  let generateOTP: GenerateOTP;
  let mockOTPService: OTPService;
  let mockLogger: FastifyBaseLogger;

  beforeEach(() => {
    mockOTPService = {
      generate: jest.fn(),
    } as unknown as OTPService;
    mockLogger = {
      info: jest.fn(),
      error: jest.fn(),
    } as unknown as FastifyBaseLogger;

    generateOTP = new GenerateOTP(mockOTPService, mockLogger);
  });

  it("should generate an OTP for a user", async () => {
    const email = "user@mail.com";
    const expectedOtp = "123456";

    (mockOTPService.generate as jest.Mock).mockResolvedValue(expectedOtp);

    const otp = await generateOTP.execute(email);

    expect(mockLogger.info).toHaveBeenCalledWith(
      `Generating OTP for user: ${email}`
    );
    expect(otp).toBe(expectedOtp);
    expect(mockOTPService.generate).toHaveBeenCalledWith(email);
  });
});
