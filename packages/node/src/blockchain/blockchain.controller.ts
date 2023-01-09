import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, TcpContext } from '@nestjs/microservices';
import { BlockEntity } from '../entities/block.entity';
import { BlockchainService } from './blockchain.service';

@Controller('blockchain')
export class BlockchainController {
  private readonly logger = new Logger(BlockchainController.name);

  public constructor(private readonly blockchainService: BlockchainService) {}

  @MessagePattern({ cmd: 'syncChain' })
  public async syncChain(data: string) {
    await this.logger.log(`- syncChain`);

    const chain: Array<BlockEntity> = JSON.parse(data);
    const valid = await this.blockchainService.replaceChain(chain);

    return JSON.stringify(valid);
  }

  @MessagePattern({ cmd: 'loadChain' })
  public async loadChain(@Ctx() context: TcpContext): Promise<string> {
    await this.logger.log(`- loadChain`);

    const chain = await this.blockchainService.getChain();

    return JSON.stringify(chain);
  }
}
