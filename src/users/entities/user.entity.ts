import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Poll } from '../../polls/entities/poll.entity';
import { Vote } from '../../votes/entities/vote.entity';
import { NigerianStates } from '../../common/enums/nigerian-states';

export enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

@Entity('users')
export class User {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  name!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;

  @Column({ type: 'enum', enum: NigerianStates })
  state!: NigerianStates;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
  role!: UserRole;

  @OneToMany(() => Poll, (poll) => poll.createdBy)
  polls!: Poll[];

  @OneToMany(() => Vote, (vote) => vote.user)
  votes!: Vote[];

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;
}
