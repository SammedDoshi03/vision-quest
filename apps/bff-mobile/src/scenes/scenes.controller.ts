import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard, CurrentUser, type AuthUser } from '@internal/server-kit';
import type { CheckInRequest, CheckInResponse, WavePayload } from '@internal/contracts';
import { MockDomainServices } from '../services/domain-services';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Scenes')
@ApiBearerAuth()
@Controller('v1/scenes')
@UseGuards(JwtAuthGuard)
export class ScenesController {
  constructor(private readonly domainServices: MockDomainServices) {}

  @Post('check-in')
  async checkIn(
    @CurrentUser() user: AuthUser,
    @Body() body: CheckInRequest
  ): Promise<CheckInResponse> {
    return this.domainServices.verifyCheckIn(user.id, body.sceneId, body.coordinates);
  }

  @Post('wave')
  async sendWave(
    @CurrentUser() user: AuthUser,
    @Body() body: WavePayload
  ): Promise<{ status: string; signalId: string }> {
    return {
      status: 'delivered',
      signalId: `sig_${user.id}_${body.recipientUserId}_${Date.now()}`,
    };
  }
}
