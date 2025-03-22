import { KafkaProducer, UserCreatedEvent } from "@buxlo/common";
import { Topics } from "@buxlo/common/build/events/topics";

export class UserCreatedProducer extends KafkaProducer<UserCreatedEvent> {  
    topic: Topics.userCreated = Topics.userCreated;
    }   