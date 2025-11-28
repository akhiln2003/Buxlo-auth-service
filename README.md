# Authentication Service

This service handles user authentication and authorization for the BUXLO application. It manages user registration, login, password reset, and JWT token generation. It also integrates with Google for OAuth2 authentication.

## Table of Contents

- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [gRPC Services](#grpc-services)
- [Kafka Integration](#kafka-integration)
- [Running Tests](#running-tests)
- [Deployment](#deployment)

## Getting Started

### Prerequisites

- Node.js (v18)
- npm
- MongoDB
- Redis
- Kafka
- AWS S3 Bucket

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/akhiln2003/Buxlo-auth-service.git
   ```
2. Navigate to the `auth` directory:
   ```bash
   cd Microservices/auth
   ```
3. Install the dependencies:
   ```bash
   npm install
   ```

## Usage

To start the service in development mode, run:

```bash
npm start
```

This will start the server using `ts-node-dev`.

## Environment Variables

This service requires the following environment variables to be set. You can create a `.env` file in the root of the `auth` directory and add the following:

| Variable                      | Description                                    | Default Value                                                                           |
| ----------------------------- | ---------------------------------------------- | --------------------------------------------------------------------------------------- |
| `PORT`                        | The port the service will run on.              | `4001`                                                                                  |
| `GRPC_SERVER`                 | The gRPC server for the user service.          | `buxlo-user:50051`                                                                      |
| `JWT_ACCESS_SECRET`           | The secret for signing JWT access tokens.      | `Buxlo_JWT_ACCESS_SECRET`                                                               |
| `JWT_REFRESH_SECRET`          | The secret for signing JWT refresh tokens.     | `Buxlo_JWT_REFRESH_SECRET`                                                              |
| `JWT_FORGOTPASSWORD_SECRET`   | The secret for signing forgot password tokens. | `Buxlo_JWT_FORGOTPASSWORD_SECRET`                                                         |
| `REDIS_URL`                   | The connection URL for Redis.                  | `redis://buxlo-redis:6379`                                                              |
| `MONGODB_URI`                 | The connection URI for MongoDB.                | `mongodb+srv://<user>:<password>@buxlo.hpj5x.mongodb.net/Auth?retryWrites=true&w=majority&appName=Buxlo` |
| `EMAIL_USER`                  | The username for the email service.            | `buxlofinance@gmail.com`                                                                |
| `EMAIL_PASS`                  | The password for the email service.            | `uptn ediv twos xtta`                                                                   |
| `GOOGLE_CLIENT_ID`            | The client ID for Google OAuth.                | `1007812232966-n9fcv58tninoqfsf10ulr7bgg75j45oe.apps.googleusercontent.com`              |
| `GOOGLE_CLIENT_SECRET`        | The client secret for Google OAuth.            | `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`                                                    |
| `AWS_S3_BUCKET_NAME`          | The name of the AWS S3 bucket.                 | `buxlo-bucket`                                                                          |
| `AWS_S3_BUCKET_REGION`        | The region of the AWS S3 bucket.               | `eu-north-1`                                                                            |
| `AWS_S3_BUCKET_ACCESS_KEY`    | The access key for the AWS S3 bucket.          | `AKIA42PHHT2HQGKHIMFB`                                                                  |
| `AWS_S3_BUCKET_SECRET_ACCESS_KEY` | The secret access key for the AWS S3 bucket. | `REDACTED — set in .env`                                               |
| `FRONTEND_URL`                | The base URL of the frontend application.      | `http://localhost:5173/`                                                                |
| `KAFKA_CLIENT_ID`             | The client ID for Kafka.                       | `auht-service`                                                                          |
| `KAFKA_BROKER`                | The Kafka broker address.                      | `kafka:9092`                                                                            |
| `KAFKA_GROUP_ID`              | The Kafka group ID.                            | `auth-group`                                                                            |
| `GRPC_PAYMENT_PORT`           | The port for the payment gRPC service.         | `50054`                                                                                 |
| `NODE_ENV`                    | The node environment.                          | `development`                                                                           |
| `COOKIE_DOMAIN`               | The domain for cookies.                        | `localhost`                                                                             |

## API Endpoints

This service exposes RESTful endpoints for user authentication and authorization.
*(Detailed documentation of the API endpoints should be added here)*

## gRPC Services

This service communicates with the user service via gRPC.

## Kafka Integration

This service uses Kafka for asynchronous communication. It acts as a producer and consumer.

## Running Tests

There are no test scripts configured for this service yet.

## Deployment

This service can be containerized using Docker. A `Dockerfile` is provided in the root of the `auth` directory.

To build the Docker image:

```bash
docker build -t auth-service .
```

To run the Docker container:

```bash
docker run -p 4001:4001 auth-service
```