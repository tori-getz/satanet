import { Module } from '@nestjs/common';
import { ConfigCommand } from './config.command';
import { ConfigService } from './config.service';
import { ConfigModule as EnvModule } from '@nestjs/config';
import { ConfigQuestions } from './config.questions';

@Module({
  imports: [EnvModule],
  providers: [
    ConfigService,
    ...ConfigCommand.registerWithSubCommands(),
    ConfigQuestions,
  ],
  exports: [ConfigService],
})
export class ConfigModule {}
