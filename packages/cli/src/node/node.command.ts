import { CommandRunner, Command } from 'nest-commander';
import * as node from '@satanet/node/dist/index';
import { ConfigService } from '../config/config.service';
import { Logger } from '@nestjs/common';

@Command({
  name: 'node',
  description: 'start blockchain nodew',
})
export class NodeCommand extends CommandRunner {
  private readonly logger = new Logger(NodeCommand.name);

  public constructor(private readonly configService: ConfigService) {
    super();
  }

  public async run(): Promise<void> {
    await this.logger.log('Load configuration...');

    const configExists = await this.configService.configExists();
    if (!configExists) {
      this.logger.error(
        'Configuration file not found! Please, run: satanet-cli config',
      );
    }

    const configuration = await this.configService.getConfiguration();

    process.env.PEER_HOST = configuration.host;
    process.env.PEER_PORT = configuration.ports.peer.toString();
    process.env.API_PORT = configuration.ports.api.toString();
    process.env.DATABASE_URL = configuration.database;
    process.env.PEERS = configuration.peers.join(',');

    await this.logger.log('Configuration loaded');
    await this.logger.log('Starting node...');

    await node.start();
  }
}
