import Fastify from "fastify";
import path from "path";
import { OTPService } from "./domain/services/otpService";
import { otpRoutes } from "./infrastructure/web/otpController";
import { GenerateOTP } from "./application/useCases/generateOtp";
import { ValidateOTP } from "./application/useCases/validateOtp";
import { MongoClient } from "mongodb";
import { MongoOtpRepository } from "./adapters/repository/mongoOtpRepository";

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

  fastify.register(require("@fastify/mongodb"), {
    forceClose: true,
    url: "mongodb://localhost:27017/otp_db",
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

  const client = new MongoClient("mongodb://localhost:27017");
  await client.connect();
  const db = client.db("otp_db");
  const collection = db.collection("otps");

  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const repository = new MongoOtpRepository(collection);
  const otpService = new OTPService(repository);
  const generateOTP = new GenerateOTP(otpService);
  const validateOTP = new ValidateOTP(otpService);

  await otpRoutes(fastify, generateOTP, validateOTP);

  await fastify.listen({ port: 3000 });
  fastify.log.info(`Server listening on http://localhost:3000`);

  await fastify.ready();
}

start().catch(console.error);
