import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BlockEntity } from '../entities/block.entity';
import { BlockchainService } from './blockchain.service';

@Resolver()
export class BlockchainResolver {
  public constructor(private readonly blockchainService: BlockchainService) {}

  @Query(() => BlockEntity)
  public async genesisBlock(): Promise<BlockEntity> {
    return await this.blockchainService.getGenesisBlock();
  }

  @Query(() => BlockEntity)
  public async lastBlock(): Promise<BlockEntity> {
    return await this.blockchainService.getLastBlock();
  }

  @Query(() => [BlockEntity])
  public async blocks(@Args('count') count?: number): Promise<BlockEntity[]> {
    return await this.blockchainService.getBlocks(count);
  }

  @Mutation(() => BlockEntity)
  public async addBlock(@Args('data') data: string): Promise<BlockEntity> {
    return await this.blockchainService.addBlock(data);
  }
}
