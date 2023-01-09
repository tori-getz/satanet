import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BlockchainModule } from './blockchain/blockchain.module';
import { getTypeOrmConfig } from './configs/typeorm.config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver } from '@nestjs/apollo';
import { PeersModule } from './peers/peers.module';
import * as path from 'node:path';
@Module({
  imports: [
    ConfigModule.forRoot(),
    BlockchainModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    GraphQLModule.forRoot({
      driver: ApolloDriver,
      autoSchemaFile: path.resolve(__dirname, '..', 'src', 'schema.gql'),
    }),
    PeersModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
