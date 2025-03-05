import { KafkaClient } from "@buxlo/common";
import { UserUpdatedConsumer } from "./kafka/consumer/userUpdateConsumer";

class MessageBroker {
  private kafka: KafkaClient;
  constructor() {
    this.kafka = new KafkaClient();
  }

  async connect() {
    const KAFKA_BROKER = process.env.KAFKA_BROKER || "localhost:9092";
    const KAFKA_CLIENT_ID = process.env.KAFKA_CLIENT_ID || "auth-service";
    const KAFKA_GROUP_ID = process.env.KAFKA_GROUP_ID || "auth-group";
    await this.kafka.connect(KAFKA_CLIENT_ID, [KAFKA_BROKER], KAFKA_GROUP_ID);
    this.setupConsumers();
  }

  async disconnect() {
    try {
      console.log("Disconnecting from Kafka...");
      await this.kafka.disconnect();
      console.log("Disconnected from Kafka");
    } catch (error) {
      console.error("Error while disconnecting from Kafka:", error);
    }
  }

  private setupConsumers() {
    new UserUpdatedConsumer(this.kafka.consumer).listen();
  }

  getKafkaClient() {
    return this.kafka;
  }
}

export const messageBroker = new MessageBroker();
