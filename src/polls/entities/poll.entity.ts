import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  RelationId,
  UpdateDateColumn,
} from 'typeorm';
import { PollOption } from '../../poll-options/entities/poll-option.entity';
import { User } from '../../users/entities/user.entity';
import { Vote } from '../../votes/entities/vote.entity';

export enum PollStatus {
  ACTIVE = 'ACTIVE',
  CLOSED = 'CLOSED',
}

@Entity('polls')
export class Poll {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  title!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: PollStatus, default: PollStatus.ACTIVE })
  status!: PollStatus;

  @ManyToOne(() => User, (user) => user.polls, { nullable: false })
  @JoinColumn({ name: 'createdBy' })
  createdBy!: User;

  @RelationId((poll: Poll) => poll.createdBy)
  createdById!: number;

  @OneToMany(() => PollOption, (option) => option.poll, { cascade: true })
  options!: PollOption[];

  @OneToMany(() => Vote, (vote) => vote.poll)
  votes!: Vote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
