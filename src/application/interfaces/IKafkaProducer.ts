export interface IKafkaProducer<T> {
  produce(data: T, options?: Record<string, any>): Promise<void>;
  disconnect(): Promise<void>;
}

