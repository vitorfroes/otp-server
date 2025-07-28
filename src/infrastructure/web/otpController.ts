import { FastifyInstance } from "fastify";
import { GenerateOTP } from "../../application/useCases/generateOtp";

export const otpRoutes = async (
  fastify: FastifyInstance,
  generateOTP: GenerateOTP
) => {
  fastify.post("/generate", async (request, reply) => {
    const { userId } = request.body as { userId: string };
    if (!userId) {
      return reply.status(400).send({ error: "User ID is required" });
    }

    try {
      const otp = await generateOTP.execute(userId);
      return reply.status(200).send({ otp });
    } catch (error) {
      request.log.error(error);
      return reply.status(500).send({ error: "Failed to generate OTP" });
    }
  });
};
