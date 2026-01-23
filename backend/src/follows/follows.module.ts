import { Module } from '@nestjs/common';
import { FollowsService } from './follows.service';
import { FollowsRepository } from './follows.repository';

@Module({
  providers: [FollowsService, FollowsRepository],
  exports: [FollowsService],
})
export class FollowsModule {}
