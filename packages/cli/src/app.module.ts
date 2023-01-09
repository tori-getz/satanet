import { Module } from '@nestjs/common';
import { ConfigModule } from './config/config.module';
import { NodeModule } from './node/node.module';

@Module({
  imports: [ConfigModule, NodeModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
