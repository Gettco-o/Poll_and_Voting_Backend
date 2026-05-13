import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { NigerianStates } from '../common/enums/nigerian-states';
import { UserRole } from '../users/entities/user.entity';
import type { UserResp } from '../users/users.service';
import { PollsService } from './polls.service';
import { CreatePollDto } from './dto/create-poll.dto';
import { UpdatePollDto } from './dto/update-poll.dto';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';

@ApiTags('Polls')
@ApiBearerAuth()
@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) { }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  create(@Body() createPollDto: CreatePollDto, @CurrentUser() user: UserResp) {
    return this.pollsService.create(createPollDto, user);
  }

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  findAll() {
    return this.pollsService.findAll();
  }

  @Get('active')
  @UseGuards(JwtAuthGuard)
  findActive() {
    return this.pollsService.findActive();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.findOne(id);
  }

  @Get(':id/results')
  @ApiQuery({
    name: 'state',
    enum: NigerianStates,
    required: false,
    description: 'Optional voter state filter. Omit to return results for all states.',
  })
  @UseGuards(JwtAuthGuard)
  getResults(
    @Param('id', ParseIntPipe) id: number,
    @Query('state') state?: NigerianStates,
  ) {
    return this.pollsService.getResults(id, state);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePollDto: UpdatePollDto,
  ) {
    return this.pollsService.update(id, updatePollDto);
  }

  @Patch(':id/close')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  close(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.close(id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pollsService.remove(id);
  }
}
