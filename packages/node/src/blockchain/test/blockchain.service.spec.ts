import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { BlockEntity } from '../../entities/block.entity';
import { getGenesisConfig } from '../../configs/genesis.config';
import { BlockService } from '../block.service';
import { BlockchainService } from '../blockchain.service';

let chain: Array<BlockEntity> = [BlockService.genesis()];

const findLastBlockOptions = JSON.stringify({
  take: 1,
  order: { id: 'DESC' },
});

console.log = () => undefined;
describe('BlockchainService', () => {
  let service: BlockchainService;
  let blockService: BlockService;
  let genesisHash: string;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BlockService,
        BlockchainService,
        {
          provide: getRepositoryToken(BlockEntity),
          useValue: {
            find: jest.fn(() => {
              console.log('find', chain);
            }),
            save: jest.fn((block) => {
              chain.push(block);
              console.log('save', chain);
              return chain;
            }),
            findOne: jest.fn(() => {
              console.log('find one', chain);
              return chain[0];
            }),
            findAndCount: (options) => {
              console.log('find one and count', options, chain);
              if (JSON.stringify(options) === findLastBlockOptions) {
                let items = [chain[chain.length - 1]];
                console.log('last block', items[0]);
                return [items];
              }
              return [chain, chain.length];
            },
          },
        },
      ],
    }).compile();

    service = module.get<BlockchainService>(BlockchainService);
    blockService = module.get<BlockService>(BlockService);

    genesisHash = getGenesisConfig().hash;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('starts with the genesis block', async () => {
    let genesisBlock = await service.getGenesisBlock();

    expect(genesisBlock.hash).toEqual(genesisHash);
  });

  it('adds a new block', async () => {
    const data = 'next block';
    await service.addBlock(data);

    expect(chain[chain.length - 1].data).toEqual(data);
  });

  it('validates a valid chain', async () => {
    expect(await service.isValidChain(chain)).toBe(true);
  });

  it('validates a invalid chain', async () => {
    let brokenChain = chain.map((block) => ({
      ...block,
      data: 'BROKEN DATA',
    }));

    expect(await service.isValidChain(brokenChain)).toBe(false);
  });
});
