import { Logger } from '@nestjs/common';
import { CommandRunner, Command, InquirerService } from 'nest-commander';
import { IConfiguratioOptions } from './config.interfaces';
import { ConfigService } from './config.service';

@Command({
  name: 'config',
  description: 'manage configuration',
})
export class ConfigCommand extends CommandRunner {
  private readonly logger = new Logger(ConfigCommand.name);

  public constructor(
    private readonly inquirerService: InquirerService,
    private readonly configService: ConfigService,
  ) {
    super();
  }

  public async run(_: string[], options?: Record<string, any>): Promise<void> {
    options = await this.inquirerService.ask('configQuestions', options);

    const configuration: IConfiguratioOptions = {
      ports: {
        api: options.apiPort,
        peer: options.peerPort,
      },
      host: options.hostname,
      database: options.database,
      peers: options.peers,
    };

    await this.logger.log('Save config...');
    await this.configService.setConfiguration(configuration);
  }
}
