import { Module } from '@nestjs/common';
import { ConfigModule } from '../config/config.module';
import { NodeCommand } from './node.command';

@Module({
  imports: [ConfigModule],
  providers: [NodeCommand],
})
export class NodeModule {}
