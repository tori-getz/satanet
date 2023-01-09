import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { LoggerService } from '@satanet/shared/dist/index';
import * as ip from 'ip';
import { Transport } from '@nestjs/microservices';
import findFreePorts from 'find-free-ports';
import { BlockchainService } from './blockchain/blockchain.service';

export const start = async () => {
  LoggerService.startup();

  const app = await NestFactory.create(AppModule, {
    logger: new LoggerService(),
  });

  const logger = new Logger('NodeInstance');
  const configService = app.get<ConfigService>(ConfigService);

  const [randomPort] = await findFreePorts(1);

  const apiPort = configService.get<number>('API_PORT');
  const peerHost = configService.get<string>('PEER_HOST') ?? ip.address();
  const peerPort = configService.get<number>('PEER_PORT') ?? randomPort;

  await app.connectMicroservice({
    transport: Transport.TCP,
    options: {
      host: peerHost,
      port: peerPort,
    },
  });

  await app.init();
  await app.startAllMicroservices();

  if (apiPort) {
    await app.listen(apiPort);
    logger.log(
      `GraphQL API listen at http://${ip.address()}:${apiPort}/graphql`,
    );
  } else {
    logger.warn('API_PORT is missing! aborting');
  }

  logger.log(`Peer node started! Your address - ${peerHost}:${peerPort}`);

  const blockchainService = await app.get<BlockchainService>(BlockchainService);

  // await blockchainService.loadChain();
};
