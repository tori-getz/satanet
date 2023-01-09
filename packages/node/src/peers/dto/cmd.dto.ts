import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CommandDto {
  @Field(() => String)
  cmd: string;

  @Field(() => String)
  args?: string;
}
