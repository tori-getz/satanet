import { BlockService } from '../blockchain/block.service';

export const mineRate = 2 * 60 * 1000;

export const getGenesisConfig = () => {
  const timestamp = 1;
  const data = 'GENESIS-BLOCK';
  const difficulty = 4;
  const nonce = 0;
  const hash = BlockService.hash(timestamp, 'root', data, nonce, difficulty);

  return {
    timestamp,
    data,
    hash,
    lastHash: hash,
    difficulty,
    nonce,
  };
};
