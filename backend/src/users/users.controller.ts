import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserResponseDto } from './dto/user-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { FollowsService } from '../follows/follows.service';
import { RequestUser } from '../common/interfaces/request-user.interface';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly followsService: FollowsService,
  ) {}

  @Get()
  async findAll(): Promise<UserResponseDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<UserResponseDto> {
    return this.usersService.findById(id);
  }

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto): Promise<UserResponseDto> {
    return this.usersService.create(createUserDto);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UserResponseDto> {
    return this.usersService.update(id, updateUserDto);
  }

  @Post(':userId/follow')
  @UseGuards(JwtAuthGuard)
  async follow(
    @Param('userId') userId: string,
    @Request() req: { user: RequestUser },
  ): Promise<void> {
    return this.followsService.follow(req.user.id, userId);
  }

  @Delete(':userId/follow')
  @UseGuards(JwtAuthGuard)
  async unfollow(
    @Param('userId') userId: string,
    @Request() req: { user: RequestUser },
  ): Promise<void> {
    return this.followsService.unfollow(req.user.id, userId);
  }

  @Get(':userId/following')
  async getFollowing(
    @Param('userId') userId: string,
  ): Promise<UserResponseDto[]> {
    return this.followsService.getFollowing(userId);
  }
}
