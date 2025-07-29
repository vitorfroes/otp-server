import { FastifyInstance } from "fastify";
import { GenerateOTP } from "../../application/useCases/generateOtp";

export const otpRoutes = async (
  fastify: FastifyInstance,
  generateOTP: GenerateOTP
) => {
  fastify.post(
    "/generate",
    {
      schema: {
        description: "Generate a new OTP for a user",
        body: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
          required: ["userId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              otp: { type: "string" },
            },
          },
          400: {
            type: "object",
            properties: {
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
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
    }
  );
};
