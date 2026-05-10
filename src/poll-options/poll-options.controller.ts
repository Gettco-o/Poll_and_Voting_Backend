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
  UseGuards,
} from '@nestjs/common';
import { Roles } from '../auth/decorators/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UserRole } from '../users/entities/user.entity';
import { PollOptionsService } from './poll-options.service';
import { CreatePollOptionDto } from './dto/create-poll-option.dto';
import { UpdatePollOptionDto } from './dto/update-poll-option.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@ApiTags('Poll Options')
@ApiBearerAuth()
@Controller('poll-options')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.ADMIN)
export class PollOptionsController {
  constructor(private readonly pollOptionsService: PollOptionsService) {}

  @Post()
  create(@Body() createPollOptionDto: CreatePollOptionDto) {
    return this.pollOptionsService.create(createPollOptionDto);
  }

  @Get()
  findAll() {
    return this.pollOptionsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.pollOptionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updatePollOptionDto: UpdatePollOptionDto,
  ) {
    return this.pollOptionsService.update(id, updatePollOptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.pollOptionsService.remove(id);
  }
}
