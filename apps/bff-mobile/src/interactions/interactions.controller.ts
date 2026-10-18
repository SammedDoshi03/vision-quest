import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser, type AuthUser } from '@internal/server-kit';
import type { KudosPayload, KudosResponse } from '@internal/contracts';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Interactions')
@ApiBearerAuth()
@Controller('v1/interactions')
@UseGuards(JwtAuthGuard)
export class InteractionsController {
  // Store pairwise kudos: "questId:userA:userB"
  private kudosRecords = new Set<string>();

  @Post('kudos')
  async giveKudos(
    @CurrentUser() user: AuthUser,
    @Body() body: KudosPayload
  ): Promise<KudosResponse> {
    const key = `${body.questId}:${user.id}:${body.targetUserId}`;
    this.kudosRecords.add(key);

    // Check if counterpart already gave kudos to user
    const reverseKey = `${body.questId}:${body.targetUserId}:${user.id}`;
    const isMutualMatch = this.kudosRecords.has(reverseKey);

    return {
      acknowledged: true,
      isMutualMatch,
      matchId: isMutualMatch ? `match_${user.id}_${body.targetUserId}` : undefined,
    };
  }
}
