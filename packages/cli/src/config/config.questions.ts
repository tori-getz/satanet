import { Question, QuestionSet } from 'nest-commander';
import * as ip from 'ip';
import * as path from 'node:path';
import { CONFIG_ROOT } from './config.constants';

const DEFAULT_PEERS = 'example1:port,example2:port,example3:port';
const DEFAULT_DATABASE = `node-data.sqlite`;

@QuestionSet({ name: 'configQuestions' })
export class ConfigQuestions {
  @Question({
    type: 'input',
    name: 'hostname',
    message: 'Hosr',
    default: ip.address(),
  })
  public parseHost(val: string) {
    return val;
  }

  @Question({
    type: 'input',
    name: 'apiPort',
    message: 'API Port',
    default: 3000,
  })
  public parseApiPort(val: string) {
    return Number.parseInt(val, 10);
  }

  @Question({
    type: 'input',
    name: 'peerPort',
    message: 'Peer Port',
    default: 4000,
  })
  public parsePeerPort(val: string) {
    return Number.parseInt(val, 10);
  }

  @Question({
    type: 'input',
    name: 'database',
    message: 'Database filename',
    default: DEFAULT_DATABASE,
  })
  public parseDatabase(val: string) {
    if (val === DEFAULT_DATABASE) return path.resolve(CONFIG_ROOT, val);
    return val;
  }

  @Question({
    type: 'input',
    name: 'peers',
    message: 'Peers list',
    default: DEFAULT_PEERS,
  })
  public parsePeers(val: string) {
    if (val === DEFAULT_PEERS) return [];
    return val.trim().replace(' ', '').split(',');
  }
}
