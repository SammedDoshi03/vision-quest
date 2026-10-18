import { Controller, Get, Post, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ReelsService } from './reels.service';
import type { ReelFeedItem } from '@internal/contracts';

@ApiTags('Reels')
@Controller('v1/reels')
export class ReelsController {
  constructor(private readonly reelsService: ReelsService) {}

  @Get('feed')
  @ApiOperation({ summary: 'Get personalized short-form video reels feed' })
  @ApiResponse({ status: 200, description: 'List of video reels with engagement metrics' })
  async getFeed(): Promise<ReelFeedItem[]> {
    return this.reelsService.getReelFeed();
  }

  @Post(':reelId/like')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Toggle like status for reel (Double-tap action)' })
  @ApiParam({ name: 'reelId', description: 'Reel ID' })
  async toggleLike(@Param('reelId') reelId: string): Promise<{ isLiked: boolean; newLikeCount: number }> {
    return this.reelsService.toggleLike(reelId);
  }
}
