import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PollOption } from '../poll-options/entities/poll-option.entity';
import { NigerianStates } from '../common/enums/nigerian-states';
import { UserResp } from '../users/users.service';
import { Vote } from '../votes/entities/vote.entity';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { Poll, PollStatus } from './entities/poll.entity';

interface PollResultRow {
  optionId: string;
  votes: string;
}

@Injectable()
export class PollsService {
  constructor(
    @InjectRepository(Poll)
    private readonly pollsRepository: Repository<Poll>,
    @InjectRepository(PollOption)
    private readonly pollOptionsRepository: Repository<PollOption>,
    @InjectRepository(Vote)
    private readonly votesRepository: Repository<Vote>,
  ) {}

  async create(createPollDto: CreatePollDto, admin: UserResp): Promise<Poll> {
    const poll = this.pollsRepository.create({
      title: createPollDto.title,
      description: createPollDto.description,
      createdBy: { id: admin.id },
      options: createPollDto.options.map((optionText) =>
        this.pollOptionsRepository.create({ optionText }),
      ),
    });

    return this.pollsRepository.save(poll);
  }

  findAll(): Promise<Poll[]> {
    return this.pollsRepository.find({
      relations: { options: true, createdBy: true },
      order: { createdAt: 'DESC' },
    });
  }

  findActive(): Promise<Poll[]> {
    return this.pollsRepository.find({
      where: { status: PollStatus.ACTIVE },
      relations: { options: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Poll> {
    const poll = await this.pollsRepository.findOne({
      where: { id },
      relations: { options: true, createdBy: true },
    });

    if (!poll) {
      throw new NotFoundException(`Poll with id ${id} was not found`);
    }

    return poll;
  }

  async update(id: number, updatePollDto: UpdatePollDto): Promise<Poll> {
    const poll = await this.findOne(id);

    if (updatePollDto.options) {
      const voteCount = await this.votesRepository.count({
        where: { poll: { id } },
      });

      if (voteCount > 0) {
        throw new BadRequestException('Poll options cannot be changed after voting starts');
      }

      await this.pollOptionsRepository.delete({ poll: { id } });
      poll.options = updatePollDto.options.map((optionText) =>
        this.pollOptionsRepository.create({ optionText }),
      );
    }

    if (updatePollDto.title !== undefined) {
      poll.title = updatePollDto.title;
    }

    if (updatePollDto.description !== undefined) {
      poll.description = updatePollDto.description;
    }

    return this.pollsRepository.save(poll);
  }

  async close(id: number): Promise<Poll> {
    const poll = await this.findOne(id);
    poll.status = PollStatus.CLOSED;

    return this.pollsRepository.save(poll);
  }

  async remove(id: number): Promise<void> {
    const poll = await this.findOne(id);
    await this.pollsRepository.remove(poll);
  }

  async getResults(id: number, state?: NigerianStates) {
    const poll = await this.findOne(id);
    let query = this.votesRepository
      .createQueryBuilder('vote')
      .select('vote.optionId', 'optionId')
      .addSelect('COUNT(vote.id)', 'votes')
      .where('vote.pollId = :pollId', { pollId: id })
      .groupBy('vote.optionId');

    if (state) {
      query = query.andWhere('vote.state = :state', { state });
    }

    const rows = await query.getRawMany<PollResultRow>();
    const voteCounts = new Map(
      rows.map((row) => [Number(row.optionId), Number(row.votes)]),
    );
    const results = poll.options.map((option) => ({
      optionId: option.id,
      optionText: option.optionText,
      votes: voteCounts.get(option.id) ?? 0,
    }));

    return {
      pollId: poll.id,
      title: poll.title,
      status: poll.status,
      state: state ?? null,
      totalVotes: results.reduce((total, result) => total + result.votes, 0),
      results,
    };
  }
}
