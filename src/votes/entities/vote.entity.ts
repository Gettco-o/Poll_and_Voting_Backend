import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  RelationId,
  Unique,
} from 'typeorm';
import { PollOption } from '../../poll-options/entities/poll-option.entity';
import { Poll } from '../../polls/entities/poll.entity';
import { User } from '../../users/entities/user.entity';

@Entity('votes')
@Unique('UQ_votes_user_poll', ['user', 'poll'])
export class Vote {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.votes, { nullable: false })
  @JoinColumn({ name: 'userId' })
  user!: User;

  @RelationId((vote: Vote) => vote.user)
  userId!: number;

  @ManyToOne(() => Poll, (poll) => poll.votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @RelationId((vote: Vote) => vote.poll)
  pollId!: number;

  @ManyToOne(() => PollOption, (option) => option.votes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'optionId' })
  option!: PollOption;

  @RelationId((vote: Vote) => vote.option)
  optionId!: number;

  @Column()
  state!: string;

  @CreateDateColumn()
  createdAt!: Date;
}
