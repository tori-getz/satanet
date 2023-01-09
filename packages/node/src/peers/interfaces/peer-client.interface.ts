import { ClientProxy } from '@nestjs/microservices';

export interface IPeerClient {
  id: string;
  client: ClientProxy;
  connected: boolean;
}
