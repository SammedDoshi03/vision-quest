import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser, type AuthUser } from '@internal/server-kit';
import type { HomeFeedResponse } from '@internal/contracts';
import { ClientContext, type ClientCtx } from '../common/client-context.decorator';
import { FeedOrchestrator } from './feed.orchestrator';

import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';

export class HomeFeedQueryDto {
  lat = 12.9716;
  lng = 77.5946;
  cursor?: string;
  limit = 15;
}

@ApiTags('Feed')
@ApiBearerAuth()
@Controller({ path: 'v1/feed' })
@UseGuards(JwtAuthGuard)
export class FeedController {
  constructor(private readonly orchestrator: FeedOrchestrator) {}

  @Get('home')
  async getHomeFeed(
    @CurrentUser() user: AuthUser,
    @Query() query: HomeFeedQueryDto,
    @ClientContext() client: ClientCtx
  ): Promise<HomeFeedResponse> {
    const lat = Number(query.lat) || 12.9716;
    const lng = Number(query.lng) || 77.5946;
    return this.orchestrator.buildHomeFeed(user, { ...query, lat, lng }, client);
  }
}
