import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

export type UserResp = Omit<User, 'password'>;

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserResp> {
    const email = createUserDto.email.toLowerCase();
    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new ConflictException('Email is already registered');
    }

    const password = await bcrypt.hash(createUserDto.password, 10);
    const user = this.usersRepository.create({
      ...createUserDto,
      email,
      password,
    });

    return this.toUserResp(await this.usersRepository.save(user));
  }

  async findAll(): Promise<UserResp[]> {
    const users = await this.usersRepository.find({
      order: { createdAt: 'DESC' },
    });

    return users.map((user) => this.toUserResp(user));
  }

  async findOne(id: number): Promise<UserResp> {
    const user = await this.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    return this.toUserResp(user);
  }

  async findById(id: number): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      where: { email: email.toLowerCase() },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResp> {
    const user = await this.findOne(id);

    if (updateUserDto.email) {
      const email = updateUserDto.email.toLowerCase();
      const existingUser = await this.findByEmail(email);

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Email is already registered');
      }

      updateUserDto.email = email;
    }

    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    Object.assign(user, updateUserDto);

    return this.toUserResp(await this.usersRepository.save(user));
  }

  async remove(id: number): Promise<void> {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} was not found`);
    }

    await this.usersRepository.delete(id);
  }

  toUserResp(user: User): UserResp {
    const { password, ...userResp } = user;

    return userResp;
  }
}
