import * as os from 'node:os';

export const dirWithHome = (fullPath: string): string => {
  return fullPath.replace(os.homedir(), '~/');
};
