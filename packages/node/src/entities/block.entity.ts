import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@ObjectType('Block')
@Entity('block')
export class BlockEntity {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id: number;

  @Field(() => Number)
  @Column()
  difficulty: number;

  @Field(() => Number)
  @Column()
  nonce: number;

  @Field(() => String)
  @Column()
  timestamp: number;

  @Field(() => String)
  @Column()
  lastHash: string;

  @Field(() => String)
  @Column()
  hash: string;

  @Field(() => String)
  @Column()
  data: string;
}
