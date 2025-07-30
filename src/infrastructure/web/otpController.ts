import { FastifyInstance } from "fastify";
import { GenerateOTP } from "../../application/useCases/generateOtp";
import { ValidateOTP } from "../../application/useCases/validateOtp";
import { error } from "console";

export const otpRoutes = async (
  fastify: FastifyInstance,
  generateOTP: GenerateOTP,
  validateOTP: ValidateOTP
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

  fastify.get(
    "/validate",
    {
      schema: {
        description: "Check if a OTP token is valid",
        querystring: {
          type: "object",
          properties: {
            token: { type: "string" },
            userId: { type: "string" },
          },
          required: ["token", "userId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              valid: { type: "boolean" },
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
      const { token, userId } = request.query as {
        token: string;
        userId: string;
      };
      let errorMessage = [] as string[];
      if (!token) {
        errorMessage.push("Token is required");
      }

      if (!userId) {
        errorMessage.push("User ID is required");
      }

      if (errorMessage.length > 0) {
        return reply.status(400).send({ error: errorMessage.join(", ") });
      }

      try {
        const isValid = await validateOTP.execute({ userId, token });

        if (isValid) {
          return reply.status(200).send({ valid: true });
        }
      } catch (error) {
        request.log.error(error);
        return reply.status(500).send({ error: "Failed to validate OTP" });
      }
    }
  );
};
