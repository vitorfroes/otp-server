import Fastify from "fastify";
import { OTPService } from "./domain/services/otpService";
import { otpRoutes } from "./infrastructure/web/otpController";
import { InMemoryOTPRepository } from "./adapters/repository/inMemoryOtpRepository";
import { GenerateOTP } from "./application/useCases/generateOtp";

async function start() {
  const fastify = Fastify({ logger: true });

  fastify.get("/", async (request, reply) => {
    return { hello: "world" };
  });

  const repository = new InMemoryOTPRepository();
  const otpService = new OTPService(repository);
  const generateOTP = new GenerateOTP(otpService);

  await otpRoutes(fastify, generateOTP);

  await fastify.listen({ port: 3000 });
  fastify.log.info(`Server listening on http://localhost:3000`);
}

start().catch(console.error);
