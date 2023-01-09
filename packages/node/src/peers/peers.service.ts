import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxyFactory, Transport } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { sleep } from '../utils/sleep.utils';
import { v4 as uuid } from 'uuid';
import { CommandDto } from './dto/cmd.dto';
import type { IPeerClient } from './interfaces/peer-client.interface';

@Injectable()
export class PeersService implements OnApplicationBootstrap {
  private readonly logger: Logger = new Logger(PeersService.name);
  private clients: Array<IPeerClient> = [];

  public constructor(private readonly configService: ConfigService) {}

  public async onApplicationBootstrap() {
    this.logger.log('Connecting to peers...');

    const PEERS = this.configService.get<string>('PEERS');

    if (!PEERS) {
      this.logger.warn('PEERS is missing');
      return;
    }

    await sleep(5000);

    for (const peer of PEERS.split(',')) {
      this.logger.log(`Make client for ${peer}`);
      const [host, port] = peer.split(':');

      const id = uuid();

      try {
        const client = ClientProxyFactory.create({
          transport: Transport.TCP,
          options: {
            host,
            port: parseInt(port),
          },
        });

        this.logger.log(`[Client ID: ${id}] created!`);

        this.clients.push({ id, client, connected: false });
      } catch (e) {
        this.logger.error(`[Client ID: ${id}] Connection refused`);
      }
    }
  }

  public async sendMessage(dto: CommandDto): Promise<string[]> {
    this.logger.log(`Command: ${dto.cmd}`);

    const responses: Array<string> = [];

    for (const { client, id, connected } of this.clients) {
      try {
        if (!connected) {
          this.logger.log(`[Client ID: ${id}] connecting...`);
          await client.connect();

          this.logger.log(`[Client ID: ${id}] connected!`);
        }
      } catch (e) {
        this.logger.error(e);
        continue;
      }

      this.logger.log(`[Client ID: ${id}] message ending...`);
      try {
        const response = await firstValueFrom(
          client.send({ cmd: dto.cmd }, dto.args),
        );

        responses.push(response);
        this.logger.log(`[Client ID: ${id}] message received!`);
      } catch (e) {
        this.logger.error(e);
        continue;
      }
    }

    return responses;
  }
}
