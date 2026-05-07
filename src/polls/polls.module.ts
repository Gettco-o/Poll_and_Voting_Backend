import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PollOption } from '../poll-options/entities/poll-option.entity';
import { Poll } from './entities/poll.entity';
import { PollsService } from './polls.service';
import { PollsController } from './polls.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Poll, PollOption])],
  controllers: [PollsController],
  providers: [PollsService],
  exports: [PollsService, TypeOrmModule],
})
export class PollsModule {}
