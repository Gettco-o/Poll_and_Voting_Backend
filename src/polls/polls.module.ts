import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from '../poll-options/entities/poll-option.entity';
import { Vote } from '../votes/entities/vote.entity';
import { Poll } from './entities/poll.entity';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption, Vote])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService, TypeOrmModule],
})
export class PollsModule {}
