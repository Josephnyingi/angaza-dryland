import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  ParseUUIDPipe,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { TrainingService } from './training.service';
import { CompleteModuleDto } from './dto/complete-module.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';

@ApiTags('training')
@Controller('training')
export class TrainingController {
  constructor(private readonly trainingService: TrainingService) {}

  @Get()
  @ApiOperation({ summary: 'List all training modules' })
  @ApiResponse({ status: 200, description: 'Returns all training modules ordered by sequence' })
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return this.trainingService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a training module by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Returns the training module' })
  @ApiResponse({ status: 404, description: 'Training module not found' })
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.trainingService.findOne(id);
  }

  @Post(':id/complete')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Mark a training module as completed' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 201, description: 'Module marked as completed' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Training module not found' })
  @HttpCode(HttpStatus.CREATED)
  async complete(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: CompleteModuleDto,
    @CurrentUser() user: User,
  ) {
    return this.trainingService.complete(id, user.id, dto);
  }

  @Get('my/completions')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all completions for the authenticated user' })
  @ApiResponse({ status: 200, description: 'Returns user training completions' })
  @HttpCode(HttpStatus.OK)
  async myCompletions(@CurrentUser() user: User) {
    return this.trainingService.getUserCompletions(user.id);
  }
}
