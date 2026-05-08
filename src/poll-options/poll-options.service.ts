import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Poll, PollStatus } from '../polls/entities/poll.entity';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';
import { PollOption } from './entities/poll-option.entity';

@Injectable()
export class PollOptionsService {
  constructor(
    @InjectRepository(PollOption)
    private readonly pollOptionsRepository: Repository<PollOption>,
    @InjectRepository(Poll)
    private readonly pollsRepository: Repository<Poll>,
  ) {}

  async create(createPollOptionDto: CreatePollOptionDto): Promise<PollOption> {
    const poll = await this.pollsRepository.findOne({
      where: { id: createPollOptionDto.pollId },
      relations: { options: true },
    });

    if (!poll) {
      throw new NotFoundException(
        `Poll with id ${createPollOptionDto.pollId} was not found`,
      );
    }

    if (poll.status !== PollStatus.ACTIVE) {
      throw new BadRequestException('Cannot add options to a closed poll');
    }

    if (poll.options.length >= 4) {
      throw new BadRequestException('A poll can have at most 4 options');
    }

    const pollOption = this.pollOptionsRepository.create({
      optionText: createPollOptionDto.optionText,
      poll: { id: poll.id },
    });

    return this.pollOptionsRepository.save(pollOption);
  }

  findAll(): Promise<PollOption[]> {
    return this.pollOptionsRepository.find({
      relations: { poll: true },
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<PollOption> {
    const pollOption = await this.pollOptionsRepository.findOne({
      where: { id },
      relations: { poll: true },
    });

    if (!pollOption) {
      throw new NotFoundException(`Poll option with id ${id} was not found`);
    }

    return pollOption;
  }

  async update(
    id: number,
    updatePollOptionDto: UpdatePollOptionDto,
  ): Promise<PollOption> {
    const pollOption = await this.findOne(id);

    if (updatePollOptionDto.optionText !== undefined) {
      pollOption.optionText = updatePollOptionDto.optionText;
    }

    return this.pollOptionsRepository.save(pollOption);
  }

  async remove(id: number): Promise<void> {
    const pollOption = await this.findOne(id);
    await this.pollOptionsRepository.remove(pollOption);
  }
}
