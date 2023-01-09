import { Injectable } from '@nestjs/common';
import * as fs from 'fs-extra';
import { CONFIGURATION_FILE } from './config.constants';
import type { IConfiguratioOptions } from './config.interfaces';

@Injectable()
export class ConfigService {
  private readonly fs = fs;

  public async setConfiguration(options: IConfiguratioOptions) {
    await this.fs.ensureFile(CONFIGURATION_FILE);
    await this.fs.writeJSON(CONFIGURATION_FILE, options, { spaces: 2 });
  }

  public async configExists() {
    return await this.fs.exists(CONFIGURATION_FILE);
  }

  public async getConfiguration(): Promise<IConfiguratioOptions> {
    return await this.fs.readJSON(CONFIGURATION_FILE);
  }
}
