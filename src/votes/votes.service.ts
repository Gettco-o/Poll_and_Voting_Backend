import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from '../poll-options/entities/poll-option.entity';
import { Poll, PollStatus } from '../polls/entities/poll.entity';
import type { UserResp } from '../users/users.service';
import { CreateVoteDto } from './dto/create-vote.dto';
import { UpdateVoteDto } from './dto/update-vote.dto';
import { Vote } from './entities/vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>,
    @InjectRepository(Poll)
    private readonly pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionsRepository: Repository<PollOption>,
  ) {}

  async create(createVoteDto: CreateVoteDto, user: UserResp): Promise<Vote> {
    const poll = await this.pollsRepository.findOne({
      where: { id: createVoteDto.pollId },
    });

    if (!poll) {
      throw new NotFoundException(
        `Poll with id ${createVoteDto.pollId} was not found`,
      );
    }

    if (poll.status !== PollStatus.ACTIVE) {
      throw new BadRequestException('Cannot vote on a closed poll');
    }

    const option = await this.pollOptionsRepository.findOne({
      where: {
        id: createVoteDto.optionId,
        poll: { id: createVoteDto.pollId },
      },
    });

    if (!option) {
      throw new BadRequestException('Selected option does not belong to poll');
    }

    const existingVote = await this.votesRepository.findOne({
      where: {
        user: { id: user.id },
        poll: { id: createVoteDto.pollId },
      },
    });

    if (existingVote) {
      throw new ConflictException('You have already voted on this poll');
    }

    const vote = this.votesRepository.create({
      user: user,
      poll: poll,
      option: option,
      state: user.state,
    });

    return this.votesRepository.save(vote);
  }

  findAll(): Promise<Vote[]> {
    return this.votesRepository.find({
      relations: { poll: true, option: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Vote> {
    const vote = await this.votesRepository.findOne({
      where: { id },
      relations: { poll: true, option: true },
    });

    if (!vote) {
      throw new NotFoundException(`Vote with id ${id} was not found`);
    }

    return vote;
  }

  async update(
    id: number,
    updateVoteDto: UpdateVoteDto,
    user: UserResp,
  ): Promise<Vote> {
    const vote = await this.votesRepository.findOne({
      where: { id },
      relations: { poll: true, user:true, option: true },
    });

    if (!vote) {
      throw new NotFoundException(`Vote with id ${id} was not found`);
    }

    if (vote.user.id !== user.id) {
      throw new ForbiddenException('You can only update your own vote');
    }

    if (vote.poll.status !== PollStatus.ACTIVE) {
      throw new BadRequestException('Cannot update a vote on a closed poll');
    }

    const option = await this.pollOptionsRepository.findOne({
      where: {
        id: updateVoteDto.optionId,
        poll: { id: vote.poll.id },
      },
    });

    if (!option) {
      throw new BadRequestException('Selected option does not belong to poll');
    }

    vote.option = option;

    return this.votesRepository.save(vote);
  }

  async remove(id: number): Promise<void> {
    const vote = await this.findOne(id);
    await this.votesRepository.remove(vote);
  }

  findMine(user: UserResp): Promise<Vote[]> {
    return this.votesRepository.find({
      where: { user: { id: user.id } },
      relations: { poll: true, option: true },
      order: { createdAt: 'DESC' },
    });
  }
}
