import { EmailService } from "../ports/emailService";
import { OTPRepository } from "../ports/otpRepository";
import { OTPService } from "./otpService";

describe("OTP Service", () => {
  let otpService: OTPService;
  let mockRepository: OTPRepository;
  let mockEmailService: EmailService;
  const userMail = "user@mail.com";

  beforeEach(() => {
    mockRepository = {
      saveOTP: jest.fn(),
      getOTP: jest.fn(),
    };
    mockEmailService = {
      sendEmail: jest.fn(),
    };
    otpService = new OTPService(mockRepository, mockEmailService);
  });

  it("should generate an OTP token and save it", async () => {
    const otp = await otpService.generate(userMail);

    expect(otp).toHaveLength(6);
    expect(mockRepository.saveOTP).toHaveBeenCalledWith(
      userMail,
      expect.any(String),
      expect.any(Date)
    );
  });

  it("should validate a correct OTP token", async () => {
    (mockRepository.getOTP as jest.Mock).mockResolvedValue({
      otp: "123456",
      expiresAt: new Date(Date.now() + 300 * 1000),
    });

    const result = await otpService.validate("user@mail.com", "123456");
    expect(result).toBe(true);
  });

  it("should return invalid when token is not found", async () => {
    (mockRepository.getOTP as jest.Mock).mockResolvedValue(null);

    const result = await otpService.validate("user@mail.com", "123456");
    expect(result).toBe(false);
  });

  it("should return invalid when token is expired", async () => {
    const expiredDate = new Date(Date.now() - 1000);
    (mockRepository.getOTP as jest.Mock).mockResolvedValue({
      otp: "123456",
      expiresAt: expiredDate,
    });

    const result = await otpService.validate("user@mail.com", "123456");
    expect(result).toBe(false);
  });

  it("should return invalid when token does not match", async () => {
    (mockRepository.getOTP as jest.Mock).mockResolvedValue({
      otp: "654321",
      expiresAt: new Date(Date.now() + 300 * 1000),
    });

    const result = await otpService.validate("user@mail.com", "123456");
    expect(result).toBe(false);
  });

  it("should throw an error for invalid email format", async () => {
    await expect(otpService.generate("invalid-email")).rejects.toThrow(
      "Invalid email address"
    );
  });
});
