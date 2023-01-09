import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { path as appRoot } from 'app-root-path';
import * as path from 'node:path';
import { BlockEntity } from 'src/entities/block.entity';

export const getTypeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  const database =
    configService.get<string>('DATABASE_URL') ??
    path.resolve(appRoot, `node-state.sqlite`);
  return {
    type: 'sqlite',
    synchronize: true,
    database,
    entities: [BlockEntity],
  };
};
