import { Injectable } from '@nestjs/common';
import { getGenesisConfig, mineRate } from '../configs/genesis.config';
import { BlockEntity } from '../entities/block.entity';
import { SHA256 } from 'crypto-js';

@Injectable()
export class BlockService {
  public async genesis(): Promise<BlockEntity> {
    return BlockService.genesis();
  }

  public static genesis(): BlockEntity {
    const { timestamp, lastHash, hash, data, nonce, difficulty } =
      getGenesisConfig();

    const block = new BlockEntity();

    block.timestamp = timestamp;
    block.lastHash = lastHash;
    block.hash = hash;
    block.data = data;
    block.nonce = nonce;
    block.difficulty = difficulty;

    return block;
  }

  public async hash(
    timestamp: number,
    lastHash: string,
    data: string,
    nonce: number,
    difficulty: number,
  ) {
    return BlockService.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  public static hash(
    timestamp: number,
    lastHash: string,
    data: string,
    nonce: number,
    difficulty: number,
  ): string {
    const str = [timestamp, lastHash, data, nonce, difficulty].join(':');

    return SHA256(str).toString();
  }

  public async hashBlock(block: BlockEntity): Promise<string> {
    const { timestamp, lastHash, data, difficulty, nonce } = block;

    return await this.hash(timestamp, lastHash, data, nonce, difficulty);
  }

  public async mineBlock(
    lastBlock: BlockEntity,
    data: string,
  ): Promise<BlockEntity> {
    const block = new BlockEntity();

    block.timestamp = Date.now();
    block.lastHash = lastBlock.hash;
    block.data = data;
    block.nonce = 0;
    block.timestamp = Date.now();

    const { difficulty } = lastBlock;

    do {
      block.nonce++;
      block.timestamp = Date.now();
      block.difficulty = BlockService.adjustDifficulty(
        lastBlock,
        block.timestamp,
      );

      block.hash = await this.hash(
        block.timestamp,
        block.lastHash,
        block.data,
        block.nonce,
        block.difficulty,
      );
    } while (block.hash.substring(0, difficulty) !== '0'.repeat(difficulty));

    return block;
  }

  public static adjustDifficulty(lastBlock: BlockEntity, currentTime: number) {
    let { difficulty } = lastBlock;

    difficulty =
      lastBlock.timestamp + mineRate > currentTime
        ? difficulty + 1
        : difficulty - 1;

    return difficulty;
  }
}
