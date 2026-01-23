import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { FeedService } from './feed.service';
import { PostResponseDto } from '../posts/dto/post-response.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RequestUser } from '../common/interfaces/request-user.interface';

@Controller('feed')
export class FeedController {
  constructor(private readonly feedService: FeedService) {}

  @Get()
  @UseGuards(JwtAuthGuard)
  async getFeed(
    @Request() req: { user: RequestUser },
  ): Promise<PostResponseDto[]> {
    return this.feedService.getFeed(req.user.id);
  }
}
