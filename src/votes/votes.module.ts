import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VotesService } from './votes.service';
import { VotesController } from './votes.controller';
import { Vote } from './entities/vote.entity';
import { Poll } from '../polls/entities/poll.entity';
import { PollOption } from '../poll-options/entities/poll-option.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Vote, Poll, PollOption])],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [VotesService, TypeOrmModule],
})
export class VotesModule {}
