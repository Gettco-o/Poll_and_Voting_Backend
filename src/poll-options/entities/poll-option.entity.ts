import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { Poll } from '../../polls/entities/poll.entity';
import { Vote } from '../../votes/entities/vote.entity';

@Entity('poll_options')
export class PollOption {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => Poll, (poll) => poll.options, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pollId' })
  poll!: Poll;

  @RelationId((option: PollOption) => option.poll)
  pollId!: number;

  @Column()
  optionText!: string;

  @OneToMany(() => Vote, (vote) => vote.option)
  votes!: Vote[];
}
