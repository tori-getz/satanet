import * as path from 'node:path';
import * as os from 'node:os';

export const CONFIG_ROOT = path.resolve(os.homedir(), '.satanet/');
export const CONFIGURATION_FILE = path.resolve(
  CONFIG_ROOT,
  'configuration.json',
);
