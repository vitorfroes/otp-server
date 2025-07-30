import Fastify from "fastify";
import path from "path";
import { OTPService } from "./domain/services/otpService";
import { otpRoutes } from "./infrastructure/web/otpController";
import { InMemoryOTPRepository } from "./adapters/repository/inMemoryOtpRepository";
import { GenerateOTP } from "./application/useCases/generateOtp";
import { ValidateOTP } from "./application/useCases/validateOtp";

async function start() {
  const fastify = Fastify({ logger: true });

  await fastify.register(require("@fastify/swagger"), {
    swagger: {
      info: {
        title: "OTP API",
        description: "API to manage OTP tokens",
        version: "1.0.0",
      },
    },
  });

  fastify.register(require("@fastify/autoload"), {
    dir: path.join(__dirname, "infrastructure", "web"),
  });

  await fastify.register(import("@fastify/swagger-ui"), {
    routePrefix: "/documentation",
    uiConfig: {
      docExpansion: "full",
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => {
      return swaggerObject;
    },
    transformSpecificationClone: true,
  });

  const repository = new InMemoryOTPRepository();
  const otpService = new OTPService(repository);
  const generateOTP = new GenerateOTP(otpService);
  const validateOTP = new ValidateOTP(otpService);

  await otpRoutes(fastify, generateOTP, validateOTP);

  await fastify.listen({ port: 3000 });
  fastify.log.info(`Server listening on http://localhost:3000`);

  await fastify.ready();
}

start().catch(console.error);
