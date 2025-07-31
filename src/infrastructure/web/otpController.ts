import { FastifyInstance } from "fastify";
import { GenerateOTP } from "../../application/useCases/generateOtp";
import { ValidateOTP } from "../../application/useCases/validateOtp";

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
            email: { type: "string" },
          },
          required: ["email"],
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
      const { email } = request.body as { email: string };
      if (!email) {
        return reply.status(400).send({ error: "Email is required" });
      }

      const otp = await generateOTP.execute(email);
      return reply.status(200).send({ otp });
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
            email: { type: "string" },
          },
          required: ["token", "email"],
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
      const { token, email } = request.query as {
        token: string;
        email: string;
      };
      let errorMessage = [] as string[];
      if (!token) {
        errorMessage.push("Token is required");
      }

      if (!email) {
        errorMessage.push("Email is required");
      }

      if (errorMessage.length > 0) {
        return reply.status(400).send({ error: errorMessage.join(", ") });
      }

      const isValid = await validateOTP.execute({ email, token });

      return reply.status(200).send({ valid: isValid });
    }
  );
};
