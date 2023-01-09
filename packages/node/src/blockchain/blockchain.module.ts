import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockEntity } from '../entities/block.entity';
import { BlockService } from './block.service';
import { BlockchainService } from './blockchain.service';
import { BlockchainResolver } from './blockchain.resolver';
import { BlockchainController } from './blockchain.controller';
import { PeersModule } from 'src/peers/peers.module';

@Module({
  imports: [TypeOrmModule.forFeature([BlockEntity]), PeersModule],
  providers: [BlockchainService, BlockService, BlockchainResolver],
  controllers: [BlockchainController],
})
export class BlockchainModule {}
