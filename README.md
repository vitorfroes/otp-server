# OTP Server

REST API application to manage OTP (One-Time Password) tokens, providing endpoints for generation and validation. The project follows hexagonal architecture principles to keep the domain logic decoupled from infrastructure.

## Tech stack

- Node.js
- Fastify
- Typescript
- MongoDB
- Docker
- Mailpit

## Installation

Use docker to compose the application.

```bash
docker compose up --build
```

## Unit tests

```bash
npm test
```

### Usage

- API: http://localhost:3000
- Swagger: http://localhost:3000/documentation
- Mongo Express: http://localhost:8081
- Email Service (Mailpit): http://localhost:8025

### Endpoints

- `POST /generate`: Generate OTP for a user
- `GET /validate`: Check if a OTP token is valid
