import { Test, TestingModule } from '@nestjs/testing';
import { BlockEntity } from 'src/entities/block.entity';
import { BlockService } from '../block.service';

describe('BlockService', () => {
  let service: BlockService;
  let lastBlock: BlockEntity;
  let block: BlockEntity;

  let testBlockData: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockService],
    }).compile();

    service = module.get<BlockService>(BlockService);

    testBlockData = 'test data';

    lastBlock = await service.genesis();
    block = await service.mineBlock(lastBlock, testBlockData);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('sets the `data` to match the input', () => {
    expect(block.data).toEqual(testBlockData);
  });

  it('sets the `lastHash` to match the hash of the last block', () => {
    expect(block.lastHash).toEqual(lastBlock.hash);
  });
});
