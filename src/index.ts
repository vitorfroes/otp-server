import Fastify from "fastify";
import path from "path";
import { OTPService } from "./domain/services/otpService";
import { otpRoutes } from "./infrastructure/web/otpController";
import { GenerateOTP } from "./application/useCases/generateOtp";
import { ValidateOTP } from "./application/useCases/validateOtp";
import { MongoClient } from "mongodb";
import { MongoOtpRepository } from "./adapters/repository/mongoOtpRepository";
import dotenv from "dotenv";
import { NodemailerService } from "./adapters/email/nodemailerService";
import { AppError } from "./shared/error/appError";

dotenv.config();

async function start() {
  const mongoUrl = process.env.MONGO_URL || "mongodb://localhost:27017";
  const fastify = Fastify({
    logger: {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
        },
      },
    },
  });

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
    url: `${mongoUrl}/otp_db`,
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

  fastify.setErrorHandler((error, request, reply) => {
    if (error instanceof AppError) {
      reply.status(error.statusCode).send({ error: error.message });
    } else {
      request.log.error(error);
      reply.status(500).send({ error: "Internal Server Error" });
    }
  });

  // MongoDB Client setup
  const client = new MongoClient(mongoUrl);
  await client.connect();
  const db = client.db("otp_db");
  const collection = db.collection("otps");

  await collection.createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });

  const repository = new MongoOtpRepository(collection);
  const emailService = new NodemailerService();
  const otpService = new OTPService(repository, emailService);
  const generateOTP = new GenerateOTP(otpService, fastify.log);
  const validateOTP = new ValidateOTP(otpService, fastify.log);

  await otpRoutes(fastify, generateOTP, validateOTP);

  await fastify.listen({ port: 3000, host: "0.0.0.0" });
  fastify.log.info(`Server listening on http://localhost:3000`);

  await fastify.ready();
}

start().catch(console.error);
