import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { BlockEntity } from '../entities/block.entity';
import { Repository } from 'typeorm';
import { BlockService } from './block.service';
import { isEmpty } from 'lodash';
import { PeersService } from '../peers/peers.service';

@Injectable()
export class BlockchainService implements OnModuleInit {
  private logger: Logger = new Logger(BlockchainService.name);

  public constructor(
    @InjectRepository(BlockEntity)
    private readonly blockRepository: Repository<BlockEntity>,
    private readonly blockService: BlockService,
    private readonly peersService: PeersService,
  ) {}

  public async onModuleInit() {
    const blocks = await this.blockRepository.find();
    this.logger.log(`Saved ${blocks.length ?? 0} blocks`);

    if (!isEmpty(blocks)) return;

    const firstBlock = await this.blockService.genesis();

    await this.blockRepository.save(firstBlock);
    this.logger.log(`Genesis block created`);
  }

  public async getChain(): Promise<BlockEntity[]> {
    return await this.blockRepository.find();
  }

  public async getBlocks(count = 25): Promise<BlockEntity[]> {
    const take = count < 25 ? count : 25;

    const [items] = await this.blockRepository.findAndCount({
      take,
      order: { id: 'DESC' },
    });

    return items.reverse();
  }

  public async addBlock(data: string): Promise<BlockEntity> {
    const lastBlock = await this.getLastBlock();
    const block = await this.blockService.mineBlock(lastBlock, data);
    const saved = await this.blockRepository.save(block);

    await this.syncBlockchain();

    return saved;
  }

  public async getGenesisBlock(): Promise<BlockEntity> {
    return await this.blockRepository.findOne({
      where: { id: 1 },
    });
  }

  public async getLastBlock(): Promise<BlockEntity> {
    const [items] = await this.blockRepository.findAndCount({
      take: 1,
      order: { id: 'DESC' },
    });

    const [block] = items;

    return block;
  }

  public async isValidChain(chain: Array<BlockEntity>): Promise<boolean> {
    const genesis = await this.getGenesisBlock();

    if (JSON.stringify(chain[0]) !== JSON.stringify(genesis)) return false;

    for (let i = 1; i < chain.length; i++) {
      const block = chain[i];
      const prevBlock = chain[i - 1];

      if (block.lastHash !== prevBlock.hash) return false;

      const hashedBlock = await this.blockService.hashBlock(block);

      if (block.hash !== hashedBlock) return false;
    }

    return true;
  }

  public async replaceChain(nextChain: Array<BlockEntity>) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, total] = await this.blockRepository.findAndCount();

    if (nextChain.length <= total) {
      this.logger.error('Recieved chain is not longer than the current chain');
      return false;
    }

    const isValid = await this.isValidChain(nextChain);

    if (!isValid) {
      this.logger.error('Recieved chain is invalid');
      return false;
    }

    this.logger.log('Replacing blockchain...');

    await this.blockRepository.clear();
    await this.blockRepository.save(nextChain);

    return true;
  }

  public async syncBlockchain() {
    const chain = await this.getChain();

    await this.peersService.sendMessage({
      cmd: 'syncChain',
      args: JSON.stringify(chain),
    });
  }

  public async loadChain() {
    const responses = await this.peersService.sendMessage({
      cmd: 'loadChain',
    });

    for (const response of responses) {
      const maybeChain = JSON.parse(response);
      this.replaceChain(maybeChain);
    }

    this.logger.log('Chain synced!');
  }
}
