export interface IKafkaConsumer {
  listen(): Promise<void>;
  disconnect(): Promise<void>;
}
