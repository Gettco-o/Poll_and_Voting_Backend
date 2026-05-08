import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOptionsService } from './poll-options.service';
import { PollOptionsController } from './poll-options.controller';
import { PollOption } from './entities/poll-option.entity';
import { Poll } from '../polls/entities/poll.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PollOption, Poll])],
  controllers: [PollOptionsController],
  providers: [PollOptionsService],
  exports: [PollOptionsService, TypeOrmModule],
})
export class PollOptionsModule {}
