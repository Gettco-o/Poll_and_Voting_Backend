import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Poll } from '../polls/entities/poll.entity';
import { PollOption } from './entities/poll-option.entity';
import { PollOptionsService } from './poll-options.service';

describe('PollOptionsService', () => {
  let service: PollOptionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PollOptionsService,
        {
          provide: getRepositoryToken(PollOption),
          useValue: {
            create: jest.fn(),
            find: jest.fn(),
            findOne: jest.fn(),
            remove: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Poll),
          useValue: {
            findOne: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PollOptionsService>(PollOptionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
