import { Module } from '@nestjs/common';
import { FeedController } from './feed.controller';
import { FeedService } from './feed.service';
import { PostsModule } from '../posts/posts.module';
import { FollowsModule } from '../follows/follows.module';

@Module({
  imports: [PostsModule, FollowsModule],
  controllers: [FeedController],
  providers: [FeedService],
})
export class FeedModule {}
