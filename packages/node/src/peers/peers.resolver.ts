import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { CommandDto } from './dto/cmd.dto';
import { PeersService } from './peers.service';

@Resolver('Peers')
export class PeersResolver {
  public constructor(private readonly peersService: PeersService) {}

  @Mutation(() => String)
  public async sendMessage(
    @Args('command') command: CommandDto,
  ): Promise<string> {
    await this.peersService.sendMessage(command);

    return 'done';
  }
}
