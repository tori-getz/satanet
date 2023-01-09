import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PeersService } from './peers.service';
import { PeersResolver } from './peers.resolver';

@Module({
  imports: [ConfigModule],
  providers: [PeersService, PeersResolver],
  exports: [PeersService],
  controllers: [],
})
export class PeersModule {}
